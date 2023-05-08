function deriveKey(password, salt, iterations = 10000) {
    let hashedPassword = password + salt;
    for (let i = 0; i < iterations; i++) {
        hashedPassword = forge_sha256(hashedPassword);
    }
    return hashedPassword;
}

function generateRandomIV() {
    const array = new Uint8Array(8);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

function arrayBufferToBase64(buf) {
    const bytes = new Uint8Array(buf);
    const binary = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
    return btoa(binary);
}

function structureToBase64(arr) {
    let byteArr = [];
    for (const subArr of arr) {
        for (const subSubArr of subArr) {
            for (const byte of subSubArr) {
                byteArr.push(parseInt(byte, 2));
            }
        }
    }
    return arrayBufferToBase64(byteArr);
}

// Encrypt using AES-CBC
function encrypt(text, password) {
    const iv = generateRandomIV();
    const salt = forge_sha256(generateRandomIV()).slice(0, 16);
    const derivedKey = deriveKey(password, salt);
    const toEncryptWithHash = forge_sha256(text) + text;
    const encryptedMessage = AES.encryptMessage(toEncryptWithHash, derivedKey, iv, 256);
    const encryptedString = structureToBase64(encryptedMessage);
    const combinedData = iv + salt + encryptedString;
    return combinedData;
}

function decodeHtmlEntities(encodedString) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = encodedString;
    return textarea.value;
}

function isMarkdown(text) {
    const htmlPattern = /^\s*<[^<>]+>\s*[\s\S]*<[^<>]+>\s*$/;
    if (htmlPattern.test(text)) {
        return false;
    }

    const multiline = /\n\s*\n/;
    const boldItalic = /([*_-]{2}.*?[*_-]{2})/;
    const inlineCode = /(`{1,3}[^`]+`{1,3})/;
    const links = /(\[.*?\]\(.*?\))/;
    const lists = /(\n\s{0,3}(?:\*|-|\+|\d+\.)\s)/;
    const headings = /(#{1,6}\s+[\w\s]+)|((?:^|\n)[-=]+\s*(?:$|\n))/;

    return (
        multiline.test(text) &&
        (boldItalic.test(text) ||
            inlineCode.test(text) ||
            links.test(text) ||
            lists.test(text) ||
            headings.test(text))
    );
}

async function loadExternalFile(url) {
    const response = await fetch(url);
    if (response.ok) {
        return await response.text();
    } else {
        throw new Error(`Failed to load the external HTML file: ${response.statusText}`);
    }
}

async function getMinifiedScript(fileName) {
    const lib = await loadExternalFile(fileName);
    const libMinifiedPromise = await Terser.minify(lib);
    return libMinifiedPromise.code;
}

function getScriptElement(script) {
    const libElement = document.createElement('script');
    libElement.innerHTML = script;
    return libElement;
}

async function getCssElement(fileName) {
    const markdownCss = await loadExternalFile('css/' + fileName);
    const markdownCssElement = document.createElement('style');
    markdownCssElement.innerHTML = markdownCss;
    return markdownCssElement;
}

async function getScriptElementAndMinifyJs(fileName) {
    const script = await getMinifiedScript(fileName);
    const scriptElement = getScriptElement(script);
    return scriptElement;
}

async function getSvgDataUrl(imagePath) {
    const image = await loadExternalFile(imagePath);
    const imageBase64 = btoa(image);
    return `data:image/svg+xml;base64,${imageBase64}`;
}

function appendChild(e, toAppend) {
    e.appendChild(toAppend);
    e.innerHTML += "\n";
}

async function generateBookmarklet() {
    let content = document.getElementById('content').value;
    if (content.length === 0) return;
    const buttonElement = document.getElementById('generate');
    const buttonPreviousClasses = buttonElement.className;
    buttonElement.className = 'bg-black text-white opacity-50 cursor-not-allowed sm:ml-2 px-4 py-2 mb-2 rounded w-full flex-1 whitespace-nowrap';
    buttonElement.disabled = true;

    const password = document.getElementById('password').value;

    const bookmarkletTemplate = await loadExternalFile('bookmarklet-template.html');
    const bookmarkletParsed = new DOMParser().parseFromString(bookmarkletTemplate, 'text/html');
    const bookmarkletHead = bookmarkletParsed.head;
    bookmarkletParsed.getElementById('open-generator-button').href = window.location.href;

    const faviconElement = document.createElement('link');
    faviconElement.rel = 'icon';
    faviconElement.href = await getSvgDataUrl('svg/favicon.svg');
    appendChild(bookmarkletHead, faviconElement);

    bookmarkletParsed.getElementById('copy-icon').src = await getSvgDataUrl('svg/copy-icon.svg');
    bookmarkletParsed.getElementById('generator-icon').src = await getSvgDataUrl('svg/generator-icon.svg');

    appendChild(bookmarkletHead, await getCssElement('bookmarklet.min.css'));
    appendChild(bookmarkletHead, await getScriptElementAndMinifyJs('decrypt.js'));
    appendChild(bookmarkletHead, await getScriptElementAndMinifyJs('lib/aes-lib.js'));
    appendChild(bookmarkletHead, await getScriptElementAndMinifyJs('lib/forge-sha256.js'));
    if (isMarkdown(content)) {
        appendChild(bookmarkletHead, await getScriptElementAndMinifyJs('lib/snarkdown.js'));
        appendChild(bookmarkletHead, await getCssElement('markdown.min.css'));
    }

    // check if deflating data is worth it, since we also would have to add tiny-inflate lib (~3kb) to decompress
    const inflateScript = await getMinifiedScript('lib/tiny-inflate.js');
    const u8Content = fflate.strToU8(content);
    let compressedData = fflate.deflateSync(u8Content);
    const b64CompressedDataSize = compressedData.byteLength * 4 / 3;
    const useCompression = b64CompressedDataSize + fflate.strToU8(inflateScript).byteLength < u8Content.byteLength;
    if (useCompression) {
        const inflateScriptElement = getScriptElement(inflateScript);
        appendChild(bookmarkletHead, inflateScriptElement);
        const header = {
            uncompressedSize: u8Content.byteLength,
            compressedData: arrayBufferToBase64(compressedData)
        };
        compressedData = JSON.stringify(header);
    }

    const toEncrypt = useCompression ? compressedData : content;
    const encryptedString = encrypt(toEncrypt, password);

    const bookmarkletString = new XMLSerializer().serializeToString(bookmarkletParsed);
    const bookmarkletStringHTML = decodeHtmlEntities(bookmarkletString).replace('{{encryptedData}}', encryptedString);
    const encodedFinalBookmarklet = btoa(bookmarkletStringHTML);
    const dataURL = `data:text/html;base64,${encodedFinalBookmarklet}`;

    const bookmarkletLink = document.getElementById('bookmarklet-link');
    bookmarkletLink.href = dataURL;
    const bookmarkletIsVisible = bookmarkletLink.classList.contains('url-visible');
    if (bookmarkletIsVisible) {
        setVisibility(bookmarkletLink, false);
        setTimeout(() => setVisibility(bookmarkletLink, true), 1);
    } else {
        setVisibility(bookmarkletLink, true);
    }

    const dataSize = dataURL.length;
    const dataSizeKB = (dataSize / 1024).toFixed(1);
    const maxSize = 64 * 1024;
    const warningElem = document.getElementById("warning");
    warningElem.classList.add('hidden');
    if (dataSize > maxSize) {
        warningElem.classList.remove('hidden');
    }
    warning.innerHTML = `Warning: The bookmarklet size is ${dataSizeKB} KB, which is larger than 64 KB (common browser limit) and might not work properly.`;

    buttonElement.className = buttonPreviousClasses;
    buttonElement.disabled = false;
}

function setVisibility(element, setVisible) {
    element.classList.remove(setVisible ? 'url-hidden' : 'url-visible');
    element.classList.add(setVisible ? 'url-visible' : 'url-hidden');
}

function changeBookmarkletButtonColor(bookmarkletLink, color) {
    const classList = bookmarkletLink.classList;
    const currentColor = classList.contains('bg-yellow-500') ? 'yellow' : (classList.contains('bg-green-500') ? 'green' : 'red');
    if (color !== currentColor) {
        const message = color === 'yellow' ? 'Generated Bookmarklet' : (color === 'green' ? 'Copied to Clipboard' : 'Clipboard blocked, copy manually');
        bookmarkletLink.innerHTML = bookmarkletLink.children[0].outerHTML + message;
        classList.replace(`bg-${currentColor}-500`, `bg-${color}-500`);
        classList.replace(`hover:bg-${currentColor}-600`, `hover:bg-${color}-600`);
    }
}

function convertInputToTextarea(pastedData = '') {
    const linkInput = document.getElementById('content');
    const textarea = document.createElement('textarea');
    const minLines = 6;
    const maxViewportHeight = window.innerHeight * 0.5;

    const style = window.getComputedStyle(linkInput);
    const lineHeight = parseFloat(style.lineHeight);

    const numLines = Math.min(
        Math.max(pastedData.split('\n').length, minLines),
        maxViewportHeight / lineHeight
    ) + 2;

    textarea.id = 'content';
    textarea.style.height = `${linkInput.offsetHeight}px`;
    textarea.value = linkInput.value;
    textarea.required = true;
    textarea.classList = 'border border-gray-300 rounded p-2 mb-2 w-full transition-all duration-300 ease-in-out';
    linkInput.parentElement.classList.remove('sm:flex-row');

    linkInput.replaceWith(textarea);

    // Animate the height change
    setTimeout(() => {
        textarea.style.height = `${numLines * lineHeight}px`;
        setTimeout(() => {
            textarea.classList = 'border border-gray-300 rounded p-2 mb-2 w-full';
        }, 100);
    }, 0);
    textarea.focus();
    return textarea;
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('content-form');
    const bookmarkletLink = document.getElementById('bookmarklet-link');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (bookmarkletLink.classList.contains('url-visible')) {
            changeBookmarkletButtonColor(bookmarkletLink, 'yellow');
            setVisibility(bookmarkletLink, false);
        }
        generateBookmarklet();
    });
    bookmarkletLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(bookmarkletLink.href)
            .then(() => changeBookmarkletButtonColor(bookmarkletLink, 'green'))
            .catch(() => changeBookmarkletButtonColor(bookmarkletLink, 'red'));
    });
    const linkInput = document.getElementById('content');
    linkInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            convertInputToTextarea();
        }
    });
    linkInput.addEventListener('paste', (e) => {
        const pastedData = e.clipboardData.getData('text');
        if (!pastedData.includes('\n')) {
            return;
        }
        e.preventDefault();

        const start = linkInput.selectionStart;
        const end = linkInput.selectionEnd;
        const textarea = convertInputToTextarea(pastedData);
        textarea.setRangeText(pastedData, start, end, 'select');
        const cursorPosition = start + pastedData.length;
        textarea.setSelectionRange(cursorPosition, cursorPosition);
    });
    linkInput.addEventListener('dblclick', () => convertInputToTextarea());
});

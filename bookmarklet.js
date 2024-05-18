const encryptedData = `{{encryptedData}}`;
function getEncryptedData() {
    return {
        iv: encryptedData.slice(0, 16),
        salt: encryptedData.slice(16, 32),
        encryptedStructure: base64ToStructure(encryptedData.slice(32))
    };
}

function base64ToUInt8(base64) {
    const binary = window.atob(base64);
    const len = binary.length;
    const uint8 = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        uint8[i] = binary.charCodeAt(i);
    }
    return uint8;
}

function base64ToStructure(base64, numInner = 4, numCols = 4) {
    const uint8Array = base64ToUInt8(base64);
    const numOuter = uint8Array.length / (numInner * numCols);
    const arr = [];

    let index = 0;
    for (let i = 0; i < numOuter; i++) {
        const subArr = [];
        for (let j = 0; j < numInner; j++) {
            const subSubArr = [];
            for (let k = 0; k < numCols; k++) {
                const byte = uint8Array[index++].toString(2).padStart(8, '0');
                subSubArr.push(byte);
            }
            subArr.push(subSubArr);
        }
        arr.push(subArr);
    }
    return arr;
}

function isCompressed() {
    return (typeof tinf_uncompress === 'function');
}

function unlock(password) {
    let data = decrypt(password);
    if (isCompressed()) data = decompress(data);
    console.log('Decrypted message:\n' + data);
}

function decrypt(password) {
    const encryptedData = getEncryptedData();
    const derivedPassword = deriveKey(password, encryptedData.salt);
    const decryptedMessage = AES.decryptMessage(encryptedData.encryptedStructure, derivedPassword, encryptedData.iv, 256);
    const messageHash = decryptedMessage.slice(0, 64);
    const message = decryptedMessage.slice(64);
    if (forge_sha256(message) === messageHash) {
        return message;
    }
    throw new Error('Incorrect password');
}

function decompress(data) {
    const headerObject = JSON.parse(data);
    const compressedData = base64ToUInt8(headerObject.compressedData);
    const decompressedData = new Uint8Array(headerObject.uncompressedSize);
    tinf_uncompress(compressedData, decompressedData);
    return new TextDecoder().decode(decompressedData).replace(/\0/g, '');
}

function isValidURL(str) {
    if (str.split(" ").length !== 1 || str.includes("\n")) {
        return false;
    }
    try {
        new URL(str);
        return true;
    } catch (_) {
        return false;
    }
}

function parseSimple(str) {
    // make links clickable and add line breaks if it is not html
    let clickableText = str;
    const htmlPattern = /^\s*<[^<>]+>\s*[\s\S]*<[^<>]+>\s*$/;
    if (!htmlPattern.test(clickableText)) {
        clickableText = clickableText.replaceAll('\n', '<br>');
    }

    // Split the text by spaces and <br> tags while preserving them
    let words = clickableText.split(/(\s+|<br>)/);
    words = words.map((word) => {
        if (!isValidURL(word)) {
            return word;
        }

        const index = clickableText.indexOf(word);
        const prevStringHref = clickableText.substr(index - 6, 6);
        const prevStringSrc = clickableText.substr(index - 5, 5);
        if ((index === 0 || prevStringHref !== 'href="') && (index === 0 || prevStringSrc !== 'src="')) {
            return `<a href="${word}">${word}</a>`;
        }
    });

    clickableText = words.join('');
    return clickableText;
}

function setPromptMessage(el, title, message, isError = true) {
    const cssClass = isError ? 'error-message' : 'prompt-message';
    el.innerHTML = `<h1 class="prompt-title">${title}</h1><p class="${cssClass}">${message}</p>`;
}

let passwordPrompt = {previousInner: null, error: false};
function resetPrompt(promptElement) {
    promptElement.innerHTML = passwordPrompt.previousInner;
    document.getElementById('password').focus();
    passwordPrompt.error = false;
}

let decryptedString;
function decryptAndOpen() {
    const password = document.getElementById('password').value;
    const promptElement = document.getElementById('prompt-container');
    try {
        decryptedString = decrypt(password);
    } catch (error) {
        if (error.message === 'Incorrect password') {
            passwordPrompt.previousInner = promptElement.innerHTML;
            setPromptMessage(promptElement, 'Incorrect Password', 'Press Enter or tap anywhere to try again.');
            passwordPrompt.error = true;
        } else {
            setPromptMessage(promptElement, 'Unknown Error', 'Check the console for details.');
            console.log("Unknown problem: ", error);
        }
        return;
    }

    if (isCompressed()) {
        decryptedString = decompress(decryptedString);
    }

    if (isValidURL(decryptedString)) {
        window.location.href = decryptedString;
        const linkShort = decryptedString.length > 50 ? decryptedString.slice(0, 50) + "..." : decryptedString;
        setPromptMessage(promptElement, 'Opening Link', `Redirecting to <a href="${decryptedString}">${linkShort}</a>`, false);
        return;
    } 

    const parsedContent = (typeof parse === 'function') ? parse(decryptedString) : parseSimple(decryptedString);
    document.getElementById('content').innerHTML = parsedContent;
    document.getElementById('content-container').classList.remove('hidden');
    document.getElementById('prompt-container').remove();

    const isHeadingOrText = el => /^(H[1-6]|P)$/.test(el.tagName.toUpperCase());
    const firstChild = document.getElementById('content').firstChild;
    const firstChildNoTags = firstChild.innerHTML.replace(/<[^>]*>/g, '');
    document.title = firstChild.tagName !== undefined && isHeadingOrText(firstChild) ? firstChildNoTags : 'Decrypted Message';
}

function copyToClipboard() {
    const el = document.createElement('textarea');
    el.value = decryptedString;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy'); // use of deprecated method because navigator.clipboard is undefined in an unsecure context
    document.body.removeChild(el);
}

function registerListeners() {
    const promptElement = document.getElementById('prompt-container');
    document.addEventListener('click', e => {
        if (e.target.matches('#submit')) {
            decryptAndOpen();
        } else if (passwordPrompt.error) {
            resetPrompt(promptElement);
        }
    });
    document.addEventListener('keydown', e => {
        const passwordElement = document.getElementById('password');
        if (e.key === 'Tab' && !e.target.matches('#password') && passwordElement) {
            e.preventDefault();
            passwordElement.focus();
            return;
        }

        if (e.key === 'Enter') {
            if (e.target.matches('#password')) {
                decryptAndOpen();
            } else if (passwordPrompt.error) {
                resetPrompt(promptElement);
            }
        }
    });
    document.getElementById('copy-button').addEventListener('click', () => {
        copyToClipboard();
        document.getElementById('open-generator-button').classList.remove('hidden');
    });
}

window.onload = () => {
    registerListeners();
    console.log('Use unlock("password") to print your decrypted data to console');
}

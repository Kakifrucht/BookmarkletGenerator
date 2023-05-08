const encryptedData = `{{encryptedData}}`;
function getEncryptedData() {
    return {
        iv: encryptedData.slice(0, 16),
        salt: encryptedData.slice(16, 32),
        encryptedStructure: base64ToStructure(encryptedData.slice(32))
    };
}

function deriveKey(password, salt, iterations = 10000) {
    let hashedPassword = password + salt;
    for (let i = 0; i < iterations; i++) {
        hashedPassword = forge_sha256(hashedPassword);
    }
    return hashedPassword;
}

function base64ToUInt8(base64) {
    const binary = atob(base64);
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

const urlRegex = /https?:\/\/(?:(\w+:\w+)@)?(?:www\.|(?!www)[a-zA-Z0-9-]+(\.)?)[a-zA-Z0-9@:%_+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+~#?&=./]*)/g;
function isValidURL(str) {
    return str.split(" ").length === 1 && !str.includes("\n") && str.match(urlRegex) !== null;
}

function parseSimple(str) {
    // make links clickable and add line breaks if it is not html
    let clickableText = str;
    const htmlPattern = /^\s*<[^<>]+>\s*[\s\S]*<[^<>]+>\s*$/;
    if (!htmlPattern.test(clickableText)) {
        clickableText = clickableText.replaceAll('\n', '<br>');
    }

    let matches = Array.from(clickableText.matchAll(urlRegex));
    matches = matches.filter((match) => {
        const index = match.index;
        const prevStringHref = clickableText.substr(index - 6, 6);
        const prevStringSrc = clickableText.substr(index - 5, 5);
        return (index === 0 || prevStringHref !== 'href="') && (index === 0 || prevStringSrc !== 'src="');
    });
    matches.forEach((match) => {
        const url = match[0];
        clickableText = clickableText.replace(url, `<a href="${url}">${url}</a>`);
    });
    return clickableText;
}

function handleIncorrectPassword(promptElement) {
    const originalInner = promptElement.innerHTML;
    promptElement.innerHTML = '<h1 class="error-title">Incorrect Password</h1><p class="error-message">Press Enter or tap anywhere to try again.</p>';
    setTimeout(() => {
        function handleClickOrEnter(event) {
            if (event.type === 'click' || (event.type === 'keydown' && event.key === 'Enter')) {
                promptElement.innerHTML = originalInner;
                registerListeners();
                document.getElementById('password').focus();
                document.removeEventListener('click', handleClickOrEnter);
                document.removeEventListener('keydown', handleClickOrEnter);
            }
        }
        document.addEventListener('click', handleClickOrEnter);
        document.addEventListener('keydown', handleClickOrEnter);
    }, 1);
}

let decryptedString;
function decryptAndOpen() {
    const password = document.getElementById('password').value;
    try {
        decryptedString = decrypt(password);
    } catch (error) {
        const promptElement = document.getElementById('prompt-container');
        if (error.message === 'Incorrect password') {
            handleIncorrectPassword(promptElement);
        } else {
            promptElement.innerHTML = '<h1 class="error-title">Unknown Error</h1><p class="error-message">Check the console for details.</p>';
            console.log("Unknown problem: ", error);
        }
        return;
    }

    if (isCompressed()) {
        decryptedString = decompress(decryptedString);
    }

    if (isValidURL(decryptedString)) {
        window.location.href = decryptedString;
        return;
    } 

    const parsedContent = (typeof parse === 'function') ? parse(decryptedString) : parseSimple(decryptedString);
    document.getElementById('content').innerHTML = parsedContent;
    document.getElementById('content-container').classList.remove('hidden');
    document.getElementById('prompt-container').remove();

    const isHeadingOrText = el => /^(H[1-6]|P)$/.test(el.tagName.toUpperCase());
    const firstChild = document.getElementById('content').firstChild;
    document.title = firstChild.tagName !== undefined && isHeadingOrText(firstChild) ? firstChild.innerHTML : 'Decrypted Message';
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
    document.getElementById('password').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            decryptAndOpen();
        }
    });
    document.getElementById('submit').addEventListener('click', decryptAndOpen);
    document.getElementById('copy-button').addEventListener('click', () => {
        copyToClipboard();
        document.getElementById('open-generator-button').classList.remove('hidden');
    });
}

window.onload = () => {
    registerListeners();
    console.log('Use unlock("password") to copy your decrypted data from console');
}

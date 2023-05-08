# Encrypted Bookmarklet Generator

Small and user-friendly tool that enables the creation of encrypted bookmarklets with AES-256 encryption. Users can input various data types, such as text or markdown-formatted content, along with a password. The tool generates a data URL containing encrypted data and all required libraries for decryption. Data is compressed if the overhead of adding the decompression library is less than when uncompressed.

Direct URL opening is available for decrypting single links.

## Key Features

- Employs AES-256 encryption for creating encrypted bookmarklets
- Supports markdown-formatted text
- Directly opens single encrypted links
- Embeds all necessary dependencies within the bookmarklet
- Compresses data using deflate if it is smaller with the inflate library included in the bookmarklet
- Enables editing by copying decrypted data to the clipboard and following the convenient link to the generator
- Offers dark and light mode according to browser preferences, and is responsive
- Includes a favicon

## How to Use

You can find a hosted version [here](https://wunderlich.pw/bookmarklet-generator/). Alternatively, you can self-host or run locally:

1. Either clone the repository or download the source files.
2. Set up a local web server, or disable CORS in your browser if you plan to run the tool using the `file://` protocol.
3. Open `index.html` in a web browser.
4. Input your data (text, markdown, or a single link) and a password, then click "Generate Bookmarklet" to create an encrypted bookmarklet.
5. Copy the generated bookmarklet by clicking the "Generated Bookmarklet" button that appears, or right-click and copy manually. Alternatively, drag this button to your bookmarks bar.
6. To decrypt your bookmarklet, open it in your browser and input the same password.

## Constraints

Since this tool operates in an unsecured context from a data URL, the browser's ``crypto.subtle`` API cannot be used. Instead, [aes-lib-js](https://github.com/kyleruss/aes-lib-js) and [forge-sha256](https://github.com/brillout/forge-sha256) are utilized for data encryption and key derivation.

Bookmark size limitations vary across browsers, with Firefox (version 112) having a maximum of 64KB. Chrome and Edge do not appear to have this limitation. The minimum data size for a bookmarklet is approximately 38KB, allowing for encryption of 26KB minus base64 encoding overhead when size restricted.

## Dependencies

- [aes-lib-js](https://github.com/kyleruss/aes-lib-js) for AES-256 in CBC mode
  - [Forge's SHA-256 implementation](https://github.com/brillout/forge-sha256) for key derivation and data integrity verification
- [fflate](https://github.com/101arrowz/fflate) for compression on the generator side
  - [tiny-inflate](https://github.com/foliojs/tiny-inflate) for decompression on the bookmarklet side
- [terser](https://github.com/terser/terser) for JavaScript minification during generation
- [Snarkdown](https://github.com/developit/snarkdown) for Markdown parsing

## License

This open-source project is available under the [MIT License](LICENSE).

# Encrypted Bookmarklet Generator

Small and user-friendly tool that enables the creation of AES-256 encrypted data URL [bookmarklets](https://en.wikipedia.org/wiki/Bookmarklet). It allows users to input text, optionally formatted in markdown, or a URL, paired with a password. This tool then generates a data URL, which includes the encrypted data and all necessary decryption libraries. The generated URL can be saved as a bookmark and synchronized across devices through your browser's data sync feature.

For efficiency, data is compressed when the overhead of adding the decompression library is lower than the uncompressed state.  
Additionally, the tool offers the functionality of opening direct URLs, providing a straightforward way to decrypt individual links.

## Features

- Uses AES-256 encryption to create data URL bookmarklets with your encrypted link/text.
- Supports markdown-formatted text, useful for notes.
- Directly opens single encrypted links.
- Embeds all necessary dependencies within the bookmarklet.
- Fully client side, generator runs on a basic webserver.
- Compresses data using deflate if it is smaller with the inflate library included in the bookmarklet.
- Enables editing by copying decrypted data to the clipboard and following the convenient link to the generator within the bookmarklet.
- Offers dark and light mode according to browser preferences, and is responsive.
- Custom tab title if the first line of the data is a heading, useful for tab hoarders and temporary notes.
- Includes a favicon, wow.

## How to Use

You can find a hosted version [here](https://wunderlich.pw/bookmarklet-generator/). Alternatively, you can self-host or run locally:

1. Either clone the repository or download the source files.
2. Set up a local web server, or disable CORS in your browser if you plan to run the tool using the `file://` protocol.
3. Open `index.html` in a web browser.
4. Input your data (text, markdown, or a single link) and a password, then click "Generate Bookmarklet" to create an encrypted bookmarklet.
5. Copy the generated bookmarklet by clicking the "Generated Bookmarklet" button that appears, or right-click and copy manually. Alternatively, drag this button to your bookmarks bar.
6. To decrypt your bookmarklet, open it in your browser and input your password.

## Constraints

Since this tool operates in an unsecured context from a data URL, the browser's ``crypto.subtle`` API cannot be used. Instead, [aes-lib-js](https://github.com/kyleruss/aes-lib-js) and [forge-sha256](https://github.com/brillout/forge-sha256) are utilized for data encryption and key derivation. These libraries were chosen because they were the smallest (non-gzipped) implementations I could find.

Bookmark size limitations vary across browsers, with Firefox (version 112) having a maximum of 64KB. Chrome and Edge do not appear to have this limitation. The minimum data size for a bookmarklet is approximately 39KB, allowing for encryption of 25KB (minus base64 encoding overhead) when size restricted.

To insert binary encrypted data into a data URL, it has to go through base64 encoding twice. The first round of encoding converts the binary data to a string for the bookmarklet template, while the second round is for creating a data URL from the full page, which increases its size by about 1.8 times. If compression is utilized, there will be an extra step of base64 encoding before the data gets encrypted. However, this added overhead is considered when deciding to use compression.

## Dependencies

Dependencies and their licenses are included in the ``lib`` directory.

- [aes-lib-js](https://github.com/kyleruss/aes-lib-js) for AES-256 in CBC mode.
  - [Forge's SHA-256 implementation](https://github.com/brillout/forge-sha256) for key derivation and data integrity verification.
- [fflate](https://github.com/101arrowz/fflate) for compression on the generator side.
  - [tiny-inflate](https://github.com/foliojs/tiny-inflate) for decompression on the bookmarklet side.
- [terser](https://github.com/terser/terser) for JavaScript minification during generation.
- [Snarkdown](https://github.com/developit/snarkdown) for Markdown parsing.
- [tailwindcss](https://github.com/tailwindlabs/tailwindcss) for generator styling.

## License

This open-source project is available under the [MIT License](LICENSE).

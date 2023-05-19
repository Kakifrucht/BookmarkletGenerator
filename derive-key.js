function deriveKey(password, salt, iterations = 10000) {
    let hashedPassword = password + salt;
    for (let i = 0; i < iterations; i++) {
        hashedPassword = forge_sha256(hashedPassword);
    }
    return hashedPassword;
}

const generateStrongPassword = (length = 8) => {
    const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()_+{}[]";
    const allChars = lowerCase + upperCase + numbers + specialChars;

    if (length < 4) {
        throw new Error("Password length must be at least 4 to include all character types.");
    }

    let password = "";
    password += lowerCase.charAt(Math.floor(Math.random() * lowerCase.length));
    password += upperCase.charAt(Math.floor(Math.random() * upperCase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));

    for (let i = 4; i < length; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    return password
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
};


module.exports = {
    generateStrongPassword,
};
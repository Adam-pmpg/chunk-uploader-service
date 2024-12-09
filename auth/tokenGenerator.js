const jwt = require('jsonwebtoken');
require('dotenv').config();

// Funkcja generująca token
function generateToken(user) {
    const payload = {
        userId: user.id,
        username: user.username,
        // inne dane użytkownika
    };

    const secretKey = process.env.JWT_SECRET_KEY;
    const expirationTime = process.env.JWT_EXPIRATION || "20m";
    const token = jwt.sign(payload, secretKey, { expiresIn: expirationTime });

    return token;
}

module.exports = {
    generateToken
};
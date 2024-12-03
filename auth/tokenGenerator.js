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

    // const token = jwt.sign(payload, secretKey, { expiresIn: '10m' });
    const token = jwt.sign(payload, secretKey);

    return token;
}

module.exports = {
    generateToken
};
const express = require('express');
const { generateToken } = require('../auth/tokenGenerator');
const router = express.Router();

router.post('/login', (req, res) => {
    let username = '';
    let password = '';
    try {
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Basic ')) {
            const base64Credentials = authHeader.split(' ')[1];
            const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
            [username, password] = credentials.split(':');
        } else {
            // Pobieranie danych z ciała żądania
            username = req.body?.username || 'brak-usera';
            password = req.body?.password || 'brak-password';
        }
    } catch (error) {
        console.log({
            message: `Error przy pobieraniu bearer: ${error.message}`,
        });
    }

    const envUsername = process.env.CHUNK_SERVICE_JWT_USER_LOGIN;
    const envUserPss = process.env.CHUNK_SERVICE_JWT_USER_PASS;

    if (username === envUsername && password === envUserPss) {
        const user = {
            id: 1,
            username: envUsername,
        };
        const token = generateToken(user);

        return res.json({ token });
    }

    res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;

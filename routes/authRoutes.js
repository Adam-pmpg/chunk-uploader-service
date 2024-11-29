const express = require('express');
const { generateToken } = require('../auth/tokenGenerator');
const router = express.Router();

router.post('/login', (req, res) => {
    const { username, password } = req.body;  // Oczekujemy w ciele żądania nazwy użytkownika i hasła

    const envUsername = process.env.JWT_USER_LOGIN_TEST;
    const envUserPss = process.env.JWT_USER_PASS_TEST;

    if (username === envUsername && password === envUserPss) {
        const user = {
            id: 1,
            username: envUsername,
        };
        // Generujemy token dla użytkownika
        const token = generateToken(user);
        // Zwracamy token w odpowiedzi
        return res.json({ token });
    }

    res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;
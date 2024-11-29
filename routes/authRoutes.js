const express = require('express');
const { generateToken } = require('../auth/auth'); // Funkcja generująca token
const router = express.Router();

// Przykładowe dane logowania
// W rzeczywistości powinno to być połączenie z bazą danych lub inny mechanizm weryfikacji
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

    // Jeśli dane są niepoprawne, zwrócimy błąd
    res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;
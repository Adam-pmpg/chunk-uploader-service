const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET_KEY;
console.log ({
    a13: '*****',
    secretKey,
})
function authenticateJWT(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    const secretKey = process.env.JWT_SECRET_KEY;

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token.' });
        }

        req.user = user;
        next();
    });
}

module.exports = authenticateJWT;

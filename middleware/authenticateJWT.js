const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET_KEY;

function authenticateJWT(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token.' });
        }

        req.user = user;
        next();
    });
}

module.exports = authenticateJWT;

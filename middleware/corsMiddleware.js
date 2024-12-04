const cors = require("cors");

const allowedOriginPattern = /^https?:\/\/cms(-\w+)?\.(wprost\.ss2|wprost\.pl|dorzeczy\.ss|dorzeczy\.pl)\/?$/;

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOriginPattern.test(origin)) {
            callback(null, true); // Zezwalaj na dostęp
        } else {
            callback(new Error('Not allowed by CORS')); // Blokuj dostęp
        }
    },
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
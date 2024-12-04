require('dotenv').config();

const express = require('express');
const cors = require('cors');
const corsMiddleware = require('./middleware/corsMiddleware');
const authenticateJWT = require('./middleware/authenticateJWT');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const uploadRoute = require('./routes/upload');
const mergeChunksViaStream = require('./routes/mergeChunksViaStream');
const clearChunks = require('./routes/clearChunks');

const app = express();
const port = process.env.HOST_PORT;

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));


app.use(corsMiddleware);

app.use('/auth', authRoutes);
// Rejestracja trasy upload
app.use('/video/upload', authenticateJWT, uploadRoute);
app.use('/video/merge', authenticateJWT, mergeChunksViaStream);
app.use('/video/clear-chunks', clearChunks);
app.get('/', (req, res) => {
    res.status(200).send();
});
app.get('/about', (req, res) => {
    res.send('<p>Video API, version 1.0</p>');
});

// Globalny handler błędów CORS
app.use((err, req, res, next) => {
    if (err.message) {
        if (err.message.includes('CORS policy')) {
            return res.status(403).json({
                error: 'Forbidden',
                message: err.message
            });
        } else if (err.message.includes('Not allowed by CORS')) {
            return res.status(403).json({
                error: 'Forbidden',
                message: err.message
            });
        }
    }
    // Inne błędy
    next(err);
});
// Domyślny handler błędów
app.use((err, req, res, next) => {
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

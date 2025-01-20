require('dotenv').config();

const express = require('express');
const corsMiddleware = require('./middleware/corsMiddleware');
const authenticateJWT = require('./middleware/authenticateJWT');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const uploadRoute = require('./routes/upload');
const mergeChunksViaStream = require('./routes/mergeChunksViaStream');
const clearDir = require('./routes/clearDir');

const app = express();
const port = process.env.CHUNK_SERVICE_HOST_PORT;
const host = process.env.HOST;

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));


app.use(corsMiddleware);

app.use('/auth', authRoutes);
// Rejestracja trasy upload
app.use('/video/upload', authenticateJWT, uploadRoute);
app.use('/video/merge', authenticateJWT, mergeChunksViaStream);
app.use('/video/clear', authenticateJWT, clearDir);
app.get('/', (req, res) => {
    res.status(200).send();
});
app.get('/about', (req, res) => {
    res.status(200).json({ message: 'chunk uploader service version 1.0' });
});

// Globalny handler błędów CORS
app.use((err, req, res, next) => {
    if (err.message) {
        if (err.message.includes('CORS policy')) {
            return res.status(403).json({
                error: 'Forbidden #101',
                message: err.message
            });
        } else if (err.message.includes('Not allowed by CORS')) {
            return res.status(403).json({
                error: 'Forbidden #102',
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

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});

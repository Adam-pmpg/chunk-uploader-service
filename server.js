require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authenticateJWT = require('./middleware/authenticateJWT');

const authRoutes = require('./routes/authRoutes');
const uploadRoute = require('./routes/upload');
const mergeChunksViaStream = require('./routes/mergeChunksViaStream');
const clearChunks = require('./routes/clearChunks');

const app = express();
const port = 3000;
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Umożliwienie CORS dla wszystkich domen, ale tylko dla środowiska developerskiego
if (process.env.ENV_IS_PRODUCTION !== 'true') {
    const corsOptions = {
        origin: '*',
        methods: ['POST, GET, DELETE'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    };
    app.use(cors(corsOptions));
}

app.use('/auth', authRoutes);

// Rejestracja trasy upload
app.use('/video/upload', authenticateJWT, uploadRoute);

app.use('/video/merge', authenticateJWT, mergeChunksViaStream);

app.use('/video/clear-chunks', clearChunks);

// Endpoint główny
app.get('/', (req, res) => {
    res.status(200).send();
});

app.get('/about', (req, res) => {
    res.send('<p>Video API, version 1.0</p>');
});

// Nasłuchiwanie na porcie
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

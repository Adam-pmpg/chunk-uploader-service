const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const uploadRoute = require('./routes/upload');
const mergeChunks = require('./routes/mergeChunks');
const mergeChunksViaStream = require('./routes/mergeChunksViaSteram');
const clearChunks = require('./routes/clearChunks');

const app = express();
const port = 3000;
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Umożliwienie CORS dla wszystkich domen
const corsOptions = {
    origin: '*',
    methods: ['POST, GET, DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true
};
app.use(cors(corsOptions));

// Rejestracja trasy upload
app.use('/upload', uploadRoute);

app.use('/merge-video', mergeChunks);
app.use('/merge-video-via-stream', mergeChunksViaStream);

app.use('/clear-chunks', clearChunks);

// Endpoint główny
app.get('/', (req, res) => {
    res.send('<h1>Hello, welcome to the Video API v1!</h1>');  // Wyświetlamy powitanie
});

app.get('/about', (req, res) => {
    res.send('<p>Video API, version 1.0</p>');
});

// Nasłuchiwanie na porcie
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

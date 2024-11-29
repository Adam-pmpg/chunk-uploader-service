// routes/upload.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 11 * 1024 * 1024 } // Limit 11 MB
});

function calculateHash(buffer) {
    const hash = crypto.createHash('sha256');
    hash.update(buffer);
    return hash.digest('hex');
}
router.post('/', upload.single('file'), (req, res) => {
    const { chunkIndex, totalChunks, hashChunk } = req.body;
    const file = req.file ? req.file : null;

    if (!req.file) {
        return res.status(400).json({ error: 'Brak przesłanego pliku.' });
    }

    const { originalname, size, buffer } = file;

    const calculatedHash = calculateHash(buffer);

    console.log({
        originalname,
        "dane": req.body,
        "daneJSON": JSON.stringify(req.body),
        "plik:": file,
        "hashChunk z CMS": hashChunk,
        "wyliczone w API": calculatedHash,
    });

    if (calculatedHash !== hashChunk) {
        return res.status(400).json({ error: 'Suma kontrolna przesłanego pliku, nie zgadza się!' });
    }

    const chunksDir = path.join(__dirname, '../chunks');
    if (!fs.existsSync(chunksDir)) {
        fs.mkdirSync(chunksDir);
    }
    const chunkPath = path.join(chunksDir, `chunk_${chunkIndex}__${originalname}`);
    // Zapis fragmentu na dysku
    fs.writeFile(chunkPath, file.buffer, (err) => {
        if (err) {
            console.error('Błąd podczas zapisywania fragmentu:', err);

            return res.status(500).json({ error: 'Błąd podczas zapisywania fragmentu.' });
        }
        console.log(`Fragment ${chunkIndex} zapisany.`);

        res.status(200).json({
            chunkIndex: chunkIndex,
            totalChunks: totalChunks,
            progress: (Number(chunkIndex) + 1) / Number(totalChunks) * 100, // Procent ukończenia
            file: file.originalname
        });
    });
});

// Obsługuje błędy
router.use((err, req, res, next) => {
    console.error("Błąd: ", err);  // Logowanie błędów
    if (err instanceof multer.MulterError) {
        // Obsługuje specyficzne błędy Multera
        return res.status(500).send(`Błąd Multera: ${err.message}`);
    }
    // Inny błąd serwera
    res.status(500).send("Wystąpił błąd serwera API.");
});

module.exports = router;
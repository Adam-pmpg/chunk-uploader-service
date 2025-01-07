const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const router = express.Router();

const videoExtensions = process.env.CHUNK_SERVICE_VIDEO_EXTENSIONS.split(',');

// Endpoint do scalania plików wideo
router.post('/:folderId', async (req, res) => {
    const folderId = req.params.folderId;
    const chunksDir = path.join(__dirname, '../chunks', folderId);
    const mergedFilesDir = path.join(__dirname, '../merged-files', folderId);
    if (!fs.existsSync(chunksDir)) {
        return res.status(400).json({error:'Taki Folder nie istnieje.'});
    }
    if (!fs.existsSync(mergedFilesDir)) {
        fs.mkdirSync(mergedFilesDir);
    }
    // Pobierz listę fragmentów, posortowaną po nazwie
    let files = fs.readdirSync(chunksDir)
        .filter(file => file.startsWith('chunk_') && videoExtensions.some(ext => file.endsWith(ext)))
        .sort((a, b) => {
            const indexA = parseInt(a.split('_')[1].split('.')[0]);
            const indexB = parseInt(b.split('_')[1].split('.')[0]);
            return indexA - indexB;
        });
    if (files.length === 0) {
        return res.status(400).json({error:'Brak plików do scalenia.'});
    }

    // Parsuję nazwę pliku, bez chunk_0, chunk_1...
    const firstFile = files[0];
    const parsedFileName = firstFile.replace(/^chunk_000__/, '');
    const extensionFile = path.extname(parsedFileName).toLowerCase();
    const mergedFile = path.join(mergedFilesDir, `${parsedFileName}`);

    const writeStream = fs.createWriteStream(mergedFile);

    writeStream.on('error', (error) => {
        res.status(500).json({error:'Błąd podczas scalania plików.'});
    });

    writeStream.on('finish', () => {
        res.status(200).json({
            message:`Pliki zostały pomyślnie scalone - ${parsedFileName}`,
            folderId,
            chunksDir,
            parsedFileName,
            mergedFile,
            extensionFile,
        });
    });

    // Funkcja pomocnicza do łączenia plików strumieniowo
    const mergeFiles = async () => {
        for (const file of files) {
            const filePath = path.join(chunksDir, file);
            //tu jest klu, dla dużych plików - createReadStream
            const readStream = fs.createReadStream(filePath);
            /*
                Opcja { end: false } w pipe
                Zapobiega automatycznemu zamknięciu writeStream po zakończeniu jednego strumienia odczytu,
                umożliwiając dalsze pisanie.*/
            readStream.pipe(writeStream, { end: false });

            await new Promise((resolve, reject) => {
                readStream.on('end', resolve);
                readStream.on('error', reject);
            });
        }

        // Zamknięcie strumienia zapisu po ostatnim fragmencie
        writeStream.end();
    };

    // Rozpoczęcie łączenia plików
    try {
        await mergeFiles();
    } catch (error) {
        res.status(500).json({error:'Błąd podczas scalania plików.'});
    }
});

module.exports = router;

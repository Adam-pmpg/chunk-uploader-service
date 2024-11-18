const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Endpoint do scalania plików wideo
router.post('/', async (req, res) => {
    const chunksDir = path.join(__dirname, '../chunks');
    const outputDir = path.join(__dirname, '../output');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // Pobierz listę fragmentów, posortowaną po nazwie
    let files = fs.readdirSync(chunksDir)
        .filter(file => (file.startsWith('chunk_') && (file.endsWith('.mp4') || file.endsWith('.wmv'))))
        .sort((a, b) => {
            const indexA = parseInt(a.split('_')[1].split('.')[0]);
            const indexB = parseInt(b.split('_')[1].split('.')[0]);
            return indexA - indexB;
        });

    if (files.length === 0) {
        return res.status(400).send('Brak plików do scalenia.');
    }

    console.log('Znalezione pliki do scalania:', files);

    // Parsuję nazwę pliku, bez chunk_0, chunk_1...
    const firstFile = files[0];
    const parsedFileName = firstFile.replace(/^chunk_0__/, '');
    const outputFile = path.join(outputDir, `${parsedFileName}`);
    console.log(`Plik wynikowy: ${outputFile}`);

    const writeStream = fs.createWriteStream(outputFile);

    writeStream.on('error', (error) => {
        console.error('Błąd podczas zapisu:', error);
        res.status(500).send('Błąd podczas scalania plików.');
    });

    writeStream.on('finish', () => {
        console.log('Scalanie plików zakończone.');
        res.status(200).send(`Pliki zostały pomyślnie scalone w ${parsedFileName}`);
    });

    // Funkcja pomocnicza do łączenia plików strumieniowo
    const mergeFiles = async () => {
        for (const file of files) {
            const filePath = path.join(chunksDir, file);
            console.log(`Łączenie pliku: ${filePath}`);

            //tu jest klu - createReadStream
            const readStream = fs.createReadStream(filePath);
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
        console.error('Błąd podczas scalania plików:', error);
        res.status(500).send('Błąd podczas scalania plików.');
    }
});

module.exports = router;

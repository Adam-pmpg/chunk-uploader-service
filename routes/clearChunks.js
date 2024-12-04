// clearChunks.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Ścieżki do folderów, które mają zostać wyczyszczone
const chunksDir = path.join(__dirname, '../chunks');
const outputDir = path.join(__dirname, '../output');

// Funkcja do usuwania plików w folderze
const clearFolder = (dir) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, { withFileTypes: true }, (err, entries) => {
            if (err) {
                return reject(`Błąd odczytu folderu ${dir}: ${err}`);
            }
            //czy folder pusty
            if (entries.length === 0) {
                return resolve(`Folder ${dir} jest już pusty.`);
            }

            // Usuwamy pliki lub podfoldery
            let deletionPromises = entries.map(entry => {
                const entryPath = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    // Rekurencyjnie usuwamy podfolder
                    return clearFolder(entryPath).then(() => {
                        return new Promise((resolve, reject) => {
                            fs.rmdir(entryPath, (err) => {
                                if (err) {
                                    reject(`Błąd usuwania folderu ${entryPath}: ${err}`);
                                } else {
                                    resolve(`Usunięto folder: ${entryPath}`);
                                }
                            });
                        });
                    });
                } else {
                    // Usuwamy plik
                    return new Promise((resolve, reject) => {
                        fs.unlink(entryPath, (err) => {
                            if (err) {
                                reject(`Błąd usuwania pliku ${entryPath}: ${err}`);
                            } else {
                                resolve(`Usunięto plik: ${entryPath}`);
                            }
                        });
                    });
                }
            });

            // Czekamy na zakończenie usuwania wszystkich plików
            Promise.all(deletionPromises)
                .then(results => resolve(results))
                .catch(error => reject(error));
        });
    });
};

// Routing dla endpointu /clear-chunk
router.delete('/', (req, res) => {
    // Czyścimy foldery chunks i output
    Promise.all([clearFolder(chunksDir), clearFolder(outputDir)])
        .then(results => {
            res.status(200).send({
                message: 'Foldery zostały wyczyszczone',
                details: results
            });
        })
        .catch(error => {
            res.status(500).send({
                message: 'Wystąpił błąd podczas czyszczenia folderów',
                error: error
            });
        });
});

// Eksportujemy router do użycia w pliku głównym
module.exports = router;

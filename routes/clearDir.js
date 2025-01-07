const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Ścieżki do folderów, które mają zostać wyczyszczone
const chunksDir = path.join(__dirname, '../chunks');
const mergedFilesDir = path.join(__dirname, '../merged-files');

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

// Endpoint do usuwania zawartości obu folderów
router.delete('/', (req, res) => {
    // Czyścimy foldery chunks i merged-files
    Promise.all([clearFolder(chunksDir), clearFolder(mergedFilesDir)])
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

// Endpoint do usuwania konkretnego folderu w "chunks"
router.delete('/chunks/:dirName', (req, res) => {
    const { dirName } = req.params;
    const specificDir = path.join(chunksDir, dirName);

    fs.access(specificDir, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send({
                message: `Pojedynczy folder ${dirName} nie istnieje w folderze chunks`,
                error: err
            });
        }

        clearFolder(specificDir)
            .then(results => {
                fs.rmdir(specificDir, (err) => {
                    if (err) {
                        return res.status(500).send({
                            message: `Błąd podczas usuwania pojedynczego folderu ${dirName} w folderze chunks`,
                            error: err
                        });
                    }

                    res.status(200).send({
                        message: `Pojedynczy podfolder ${dirName}, w folderze chunks, został usunięty`,
                        details: results
                    });
                });
            })
            .catch(error => {
                res.status(500).send({
                    message: `Wystąpił błąd podczas usuwania zawartości pojedynczego podfolderu ${dirName}, w folderze chunks`,
                    error: error
                });
            });
    });
});

// Endpoint do usuwania konkretnego podfolderu folderu w "merged-files"
router.delete('/merged-files/:dirName', (req, res) => {
    const { dirName } = req.params;
    const specificDir = path.join(mergedFilesDir, dirName);

    fs.access(specificDir, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send({
                message: `Folder ${dirName} nie istnieje w merged-files`,
                error: err
            });
        }

        clearFolder(specificDir)
            .then(results => {
                fs.rmdir(specificDir, (err) => {
                    if (err) {
                        return res.status(500).send({
                            message: `Błąd podczas usuwania folderu ${dirName} w merged-files`,
                            error: err
                        });
                    }

                    res.status(200).send({
                        message: `Folder ${dirName} w merged-files został usunięty`,
                        details: results
                    });
                });
            })
            .catch(error => {
                res.status(500).send({
                    message: `Wystąpił błąd podczas usuwania zawartości folderu ${dirName} w merged-files`,
                    error: error
                });
            });
    });
});

// Eksportujemy router do użycia w pliku głównym
module.exports = router;

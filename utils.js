import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./db/app.db');

// Create the table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS data(
        keyID TEXT,
        value TEXT,
        PRIMARY KEY (keyID)
    ) STRICT
`);

function write(key, value) {
    return new Promise((resolve, reject) => {
        db.run(`
            INSERT INTO data (keyID, value) VALUES (?, ?)
            ON CONFLICT(keyID) DO UPDATE SET value = ?
        `, [key, value, value], function (err) {
            if (err) {
                return reject(err.message);
            }
            return resolve(this.lastID);
        });
    });
}

function view(key) {
    return new Promise((resolve, reject) => {
        db.get(`
            SELECT value FROM data WHERE keyID = ?
        `, [key], function (err, row) {
            if (err) {
                return reject(err.message);
            }
            return resolve(row ? row.value : null);
        });
    });
}

export default {
    write,
    view
};

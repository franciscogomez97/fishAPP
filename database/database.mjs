import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function setup() {
    const db = await open({
        filename: './fishapp.sqlite',
        driver: sqlite3.Database
    });

    await db.exec(`CREATE TABLE IF NOT EXISTS fishes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        species     TEXT,
        weight      REAL,
        location    TEXT,
        dateCaught  TEXT,
        lure        TEXT,
        lureColour  TEXT,
        waterTemp   REAL
    )`);

    console.log('Table is created or already exists.');
    await db.close();   
}

setup();
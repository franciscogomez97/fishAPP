import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Initializa and open connection to database
async function openDb() {
    return open({
        filename: './fishapp.sqlite',
        driver: sqlite3.Database
    });
}

export { openDb };
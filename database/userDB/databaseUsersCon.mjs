import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Initializa and open connection to database
async function openDb() {
    return open({
        filename: 'users.sqlite',
        driver: sqlite3.Database
    });
}

export { openDb };
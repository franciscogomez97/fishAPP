import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function setup() {
    const db = await open({
        filename: './users.sqlite',
        driver: sqlite3.Database
    });

    await db.exec(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username        TEXT UNIQUE,
        email           TEXT UNIQUE,
        password_hash   TEXT,
        is_admin        BOOLEAN DEFAULT 0,
        created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP        
    )`);

    console.log('Table is created or already exists.');
    await db.close();   
}

setup();
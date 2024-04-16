import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

async function addNewColumn() {
    const db = await open({
        filename: './fishapp.sqlite',
        driver: sqlite3.Database
    });

    // ADD COLUMN
    await db.exec(`ALTER TABLE users ADD COLUMN photoUrl TEXT`);

    console.log('New column added.');
    await db.close();
}

addNewColumn();

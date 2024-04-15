import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

async function addNewColumn() {
    const db = await open({
        filename: './myfishdb.sqlite',
        driver: sqlite3.Database
    });

    // ADD COLUMN
    await db.exec(`ALTER TABLE fishes ADD COLUMN photoUrl TEXT`);

    console.log('New column added.');
    await db.close();
}

addNewColumn();

import express from 'express';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

// Database connection
let db;
async function setupDatabase()  {
    db = await open({
        filename: './fishapp.sqlite',
        driver: sqlite3.Database
    });
}

setupDatabase();

// Express server
const app = express();
const PORT = process.env.PORT || 3000;

// Routes
app.get('/', (req, res) => {
    res.send('fishAPP');
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})


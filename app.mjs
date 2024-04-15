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

// Post (Add a reg in DB)
app.post('/addFish', async (req, res) => {
    const { species, weight, location, dateCaught, lure, lureColour, waterTemp } = req.body;

    // Check if required fields are present
    if (!species || !location || !lure || !lureColour) {
        return res.status(400).send('Missing required fields');
    }

    // Default params if not provided
    if (!dateCaught) {
        dateCaught = new Date();
    }
    if (!waterTemp) {
        waterTemp = 0;
    }
    if (!weight) {
        weight = 0;
    }

    //SQLite insert
    try {
        const result = await db.run(
            'INSERT INTO fishes (species, weight, location, dateCaught, lure, lureColour, waterTemp) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [species, weight, location, dateCaught, lure, lureColour, waterTemp]
        );
        res.status(201).send({ id : result.lastID });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

//Get Fish Data
app.get('/getFish', async (req, res) => {
    try {
        const fishes = await db.all(`SELECT * FROM fishes`);
        res.send(fishes);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/getFish/:id', async (req, res) => {
    try {
        const fish = await db.get(`SELECT * FROM fishes WHERE id = ?`, [req.params.id]);
        if (fish) {
            res.send(fish);
        } else {
            res.status(404).send('Fish not found');
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

//Update fish reg
app.put('/updateFish/:id', async (req, res) => {
    const { species, weight, location, dateCaught, lure, lureColour, waterTemp } = req.body;
    try {
        const result = await db.run(
            `UPDATE fishes SET species = ?, weight = ?, location = ?, dateCaught = ?, lure = ?, lureColour = ?, waterTemp = ? WHERE id = ?`,
            [species, weight, location, dateCaught, lure, lureColour, waterTemp, req.params.id]
        );
        if (result.changes) {
            res.send({ updated: req.params.id });
        } else {
            res.status(404).send('Fish not found');
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

//Delete fish reg
app.delete('/deleteFish/:id', async (req, res) => {
    try {
        const result = await db.run(
            `DELETE FROM fishes WHERE id = ?`,
            [req.params.id]
        );
        if (result.changes) {
            res.status(204).send();
        } else {
            res.status(404).send('Fish not found');
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

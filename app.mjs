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
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('fishAPP');
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})

// Post (Add a reg in DB)
app.post('/addfish', async (req, res) => {
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

    //SQL insert
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

//Get Fish Data (all)
app.get('/getfish', async (req, res) => {
    try {
        const fishes = await db.all(`SELECT * FROM fishes`);
        res.send(fishes);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

//Get Fish Data (only one)
app.get('/getfish/:id', async (req, res) => {
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

//PATCH fish reg (only one param)
app.patch('/patchfish/:id', async (req, res) => {

    //Array with the fields that can be updated
    const fields = ['species', 'weight', 'location', 'dateCaught', 'lure', 'lureColour', 'waterTemp'];

    //Filter the fields that user wants to update, map it to a string (location = ?) and create an array with the values (join)
    const updates = fields.filter(field => req.body[field] !== undefined).map(field => `${field} = ?`).join(", ");

    //The same filter but with the values
    const values = fields.filter(field => req.body[field] !== undefined).map(field => req.body[field]);

    if (!updates) {
        return res.status(400).send({ error: "No valid fields provided for update" });
    }

    //Add the fish id to the values array
    values.push(req.params.id);

    try {
        const result = await db.run(
            `UPDATE fishes SET ${updates} WHERE id = ?`,
            values
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
app.delete('/deletefish/:id', async (req, res) => {
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

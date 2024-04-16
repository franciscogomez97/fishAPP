import { openDb } from '../database/fishDB/databaseFishCon.mjs';

// Add new fish
async function addFish(req, res) {
    let { species, weight, location, dateCaught, lure, lureColour, waterTemp } = req.body;

        // Check if required fields are present
        if (!species || !location || !lure || !lureColour) {
            return res.status(400).send('Missing required fields');
        }

        // Default params if not provided
        if (!dateCaught) {
            const now = new Date();
            dateCaught = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;        
        }
        if (!waterTemp) {
            waterTemp = 0;
        }
        if (!weight) {
            weight = 0;
        }

        //SQL insert
        const db = await openDb();

        try {
            const result = await db.run(
                'INSERT INTO fishes (species, weight, location, dateCaught, lure, lureColour, waterTemp) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [species, weight, location, dateCaught, lure, lureColour, waterTemp]
            );
            res.status(201).send({ id : result.lastID });
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
};

// Get all fish data
async function getFishes(req, res) {
    const db = await openDb();
    try {
        const fishes = await db.all(`SELECT * FROM fishes`);
        res.send(fishes);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Get fish data by id
async function getFishById(req, res) {
    const db = await openDb();
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
};

// Patch fish reg
async function patchFishParams(req, res) {
    
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
    const db = await openDb();
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
};

// Delete fish
async function deleteFish (req, res) {
    const db = await openDb();
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
};

export { addFish, getFishes, getFishById, patchFishParams, deleteFish };
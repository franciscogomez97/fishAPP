import express from 'express';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('fishAPP');
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})

app.get('/test-db', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT NOW()');
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error al conectarse a la base de datos'});
    }
});

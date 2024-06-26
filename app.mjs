import express from 'express';
import multer from 'multer';
import fishRoutes from './routes/fishRoutes.mjs';
import userRoutes from './routes/userRoutes.mjs';
import path from 'path';
import { fileURLToPath } from 'url';


// Express server setup
const app = express();
const PORT = process.env.PORT || 3000;

//JSON parser
app.use(express.json());

// Multer to accept form-data
const multerMiddleware = multer();
app.use(multerMiddleware.none());

// Serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'view')));

//Routes
app.use('/api', fishRoutes);
app.use('/api', userRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
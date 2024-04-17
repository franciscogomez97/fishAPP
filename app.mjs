import express from 'express';
import multer from 'multer';
import basicAuth from 'express-basic-auth';
import fishRoutes from './routes/fishRoutes.mjs';
import userRoutes from './routes/userRoutes.mjs';
import { password } from 'pg/lib/defaults';


// Express server setup
const app = express();
const PORT = process.env.PORT || 3000;

//JSON parser
app.use(express.json());

// Multer to accept form-data
const multerMiddleware = multer();
app.use(multerMiddleware.none());

// Basic Auth
const myAuth = (username, password) => {
  const userMatches = basicAuth.safeCompare(username, 'admin');
  const passMatches = basicAuth.safeCompare(password, 'admin');
  return userMatches && passMatches;
};
app.use(basicAuth({
  authorizer: myAuth,
  challenge: true
}));

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
import express from 'express';
import { registerUser, loginUser, getUserData, patchUserData, deleteUser, changeUserPassword } from '../controllers/userController.mjs';
import passport from '../passportJWT/passport.mjs';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/change-password', passport.authenticate('jwt', { session: false }), changeUserPassword);
router.get('/user/:id', passport.authenticate('jwt', { session: false }), getUserData);
router.patch('/user/:id', passport.authenticate('jwt', { session: false }), patchUserData);
router.delete('/user/:id', passport.authenticate('jwt', { session: false }), deleteUser);

export default router;
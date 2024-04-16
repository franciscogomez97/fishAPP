import express from 'express';
import { registerUser, loginUser, getUserData, patchUserData, deleteUser, changeUserPassword } from '../controllers/userController.mjs';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/change-password', changeUserPassword);
router.get('/user/:id', getUserData);
router.patch('/user/:id', patchUserData);
router.delete('/user/:id', deleteUser);

export default router;
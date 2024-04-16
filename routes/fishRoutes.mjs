import express from 'express';
import { addFish, getFishes, getFishById,patchFishParams ,deleteFish } from '../controllers/fishController.mjs';

const router = express.Router();

router.post('/fish', addFish);
router.get('/fish', getFishes);
router.get('/fish/:id', getFishById);
router.patch('/fish/:id', patchFishParams);
router.delete('/fish/:id', deleteFish);

export default router;
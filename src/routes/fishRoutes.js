import express from 'express';
import * as FishController from '../controllers/fishController.js';

const router = express.Router();

router.get('/', FishController.getAllFish);
router.get('/:id', FishController.getFishById);

export default router;

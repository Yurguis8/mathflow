import express from 'express';

import {
  saveProgress,
  getDashboard
} from '../controllers/progressController.js';

const router = express.Router();

router.post('/save', saveProgress);

router.get('/dashboard/:user_id', getDashboard);

export default router;
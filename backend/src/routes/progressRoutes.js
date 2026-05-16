import express from 'express';

import {
  saveProgress,
  getDashboard,
  trackTime // <-- Adicionado a importação da nova função
} from '../controllers/progressController.js';

const router = express.Router();

router.post('/save', saveProgress);

router.get('/dashboard/:user_id', getDashboard);

router.post('/track-time', trackTime); // <-- Adicionado a rota para registrar o tempo de tela

export default router;
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Adicione isso no topo do seu arquivo server.js ou app.js
BigInt.prototype.toJSON = function() {
  return Number(this.toString());
};
import authRoutes from './routes/authRoutes.js';
import progressRoutes from './routes/progressRoutes.js';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use('/auth', authRoutes);

app.use('/progress', progressRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'API funcionando'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
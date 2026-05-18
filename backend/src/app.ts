import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import groupRoutes from './routes/group.routes';
import sessionRoutes from './routes/session.routes';

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rota de Healthcheck
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Vincular Rotas
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/sessions', sessionRoutes);

export default app;

import app from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso na porta ${env.PORT}!`);
  console.log(`📡 URL Base API: http://localhost:${env.PORT}/api`);
});

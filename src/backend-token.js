import express from 'express';
import { GoogleAuth } from 'google-auth-library';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors()); // ⭐️ Aquí activamos CORS


// Ruta del archivo de credenciales
const keyPath = path.join(__dirname, '..', 'chatbot', 'dialogflow-credentials.json');

const SCOPES = ['https://www.googleapis.com/auth/cloud-platform'];

const auth = new GoogleAuth({
  keyFile: keyPath,
  scopes: SCOPES,
});

// Ruta para obtener token
app.get('/token', async (req, res) => {
  try {
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    res.json({ token: accessToken.token });
  } catch (error) {
    console.error('❌ Error obteniendo token:', error);
    res.status(500).json({ error: 'Error al obtener el token' });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🔐 Token Server funcionando en http://localhost:${PORT}`);
});

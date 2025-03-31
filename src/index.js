import express from 'express';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();



import usuariosRoutes from './routes/usuarios.routes.js';
import indexRoutes from './routes/index.routes.js';
import eventosRoutes from './routes/eventos.routes.js';
import reservationsRoutes from './routes/reservations.routes.js';


const app = express();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/eventos/'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
      const ext = path.extname(file.originalname); // Obtenemos la extensión de la imagen
      cb(null, Date.now() + ext); // Usamos la fecha como nombre del archivo
  }
});

const upload = multer({ storage: storage });


app.use(express.json());


app.use('/api', eventosRoutes)
app.use('/api',usuariosRoutes)
app.use('/api',indexRoutes)
app.use('/api', reservationsRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
  
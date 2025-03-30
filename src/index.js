import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';


import usuariosRoutes from './routes/usuarios.routes.js';
import indexRoutes from './routes/index.routes.js';
import eventosRoutes from './routes/eventos.routes.js';
import reservationsRoutes from './routes/reservations.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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

//Servir archivos estáticos desde 'views'
app.use(express.static(path.join(__dirname, '..', 'views')));
//Servir archivos estáticos desde 'views/ICONOS'
app.use(express.static(path.join(__dirname, '..', 'views', 'ICONOS')));
app.use(express.static(path.join(__dirname, '..', 'uploads')));
app.use(express.static(path.join(__dirname, '..')));

//URL VER EVENTO
app.use(express.static(path.join(__dirname, '..', 'views', 'viewEvent')));
app.get('/VerEvento', (req, res) => {
  // Usamos path.join para construir la ruta absoluta del archivo index.html
  const filePath = path.join(__dirname, '..', 'views', 'viewEvent', 'index.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error al enviar el archivo:', err);
      res.status(500).send('Error al cargar la página');
    }
  });
});

//URL REGISTRAR EVENTO
app.use(express.static(path.join(__dirname, '..', 'views', 'viewRegisterEvent')));
app.get('/api/RegistarEvento', (req, res) => {
  // Usamos path.join para construir la ruta absoluta del archivo index.html
  const filePath = path.join(__dirname, '..', 'views', 'viewRegisterEvent', 'RegistrarEvento.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error al enviar el archivo:', err);
      res.status(500).send('Error al cargar la página');
    }
  });
});

//URL RESERVAR EVENTO
app.get('/ReservarEvento', (req, res) => {
  // Usamos path.join para construir la ruta absoluta del archivo index.html
  const filePath = path.join(__dirname, '..', 'views', 'viewReservarEvent', 'ReservarEvento.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error al enviar el archivo:', err);
      res.status(500).send('Error al cargar la página');
    }
  });
});

//URL REGISTRAR Usuario
app.use(express.static(path.join(__dirname, '..', 'views', 'viewRegisterEvent')));
app.get('/api/RegistarUsuario', (req, res) => {
  // Usamos path.join para construir la ruta absoluta del archivo index.html
  const filePath = path.join(__dirname, '..', 'views', 'viewRegisterUser', 'RegistrarUsuario.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error al enviar el archivo:', err);
      res.status(500).send('Error al cargar la página');
    }
  });
});


//URL VER PERFIL Usuario
app.get('/MiPerfil', (req, res) => {
  // Usamos path.join para construir la ruta absoluta del archivo index.html
  const filePath = path.join(__dirname, '..', 'views', 'viewUserProfile', 'PerfilUsuario.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error al enviar el archivo:', err);
      res.status(500).send('Error al cargar la página');
    }
  });
});

//URL Ver Eventos
app.use(express.static(path.join(__dirname, '..', 'views', 'viewEvents')));
app.get('/VerEventos', (req, res) => {
  // Usamos path.join para construir la ruta absoluta del archivo index.html
  const filePath = path.join(__dirname, '..', 'views', 'viewEvents', 'VerEventos.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error al enviar el archivo:', err);
      res.status(500).send('Error al cargar la página');
    }
  });
});


//En caso de ingresar un url no registrado
app.use((req, res) => {
  res.status(404).send('No se encontro la pagina')
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
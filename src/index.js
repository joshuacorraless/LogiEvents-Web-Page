import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();



import usuariosRoutes from './routes/usuarios.routes.js';
import indexRoutes from './routes/index.routes.js';
import eventosRoutes from './routes/eventos.routes.js';
import reservationsRoutes from './routes/reservations.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();


// Configurar Multer para guardar con el nombre original en 'uploads/eventos/'
const storage = multer.diskStorage({
  destination: "uploads/eventos/",
  filename: (req, file, cb) => {
      cb(null, file.originalname); // Agrega timestamp para evitar duplicados
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("imagen"), (req, res) => {
  if (!req.file) {
      return res.status(400).send("No se envió ninguna imagen.");
  }
  res.send("Imagen guardada en: " + req.file.path);
});

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

//URL LOGIN
app.use(express.static(path.join(__dirname, '..', 'views', 'viewLogin')));
app.get('/Login', (req, res) => {

  const filePath = path.join(__dirname, '..', 'views', 'viewLogin', 'index.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error al enviar el archivo:', err);
      res.status(500).send('Error al cargar la página');
    }
  });
});



//URL VER EVENTO
app.use(express.static(path.join(__dirname, '..', 'views', 'viewEvent')));
app.get('/VerEvento', (req, res) => {
  // Usamos path.join para construir la ruta absoluta del archivo index.html
  const filePath = path.join(__dirname, '..', 'views', 'viewEvent', 'viewEvent.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error al enviar el archivo:', err);
      res.status(500).send('Error al cargar la página');
    }
  });
});

//URL DASHBOARD
app.use(express.static(path.join(__dirname, '..', 'views', 'viewDashBoard')));
app.get('/DashBoard', (req, res) => {
  const filePath = path.join(__dirname, '..', 'views', 'viewDashBoard', 'DashBoard.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error al enviar el archivo:', err);
      res.status(500).send('Error al cargar la página');
    }
  });
});

//URL REGISTAR EVENTO
app.use(express.static(path.join(__dirname, '..', 'views', 'viewRegisterEvent')));
app.get('/RegistrarEvento', (req, res) => {
  const filePath = path.join(__dirname, '..', 'views', 'viewRegisterEvent', 'RegistrarEvento.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error al enviar el archivo:', err);
      res.status(500).send('Error al cargar la página');
    }
  });
});

//URL REGISTRAR EVENTO
app.use(express.static(path.join(__dirname, '..', 'views', 'viewRegisterEvent')));
app.get('/RegistarEvento', (req, res) => {
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
app.get('/RegistarUsuario', (req, res) => {
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

//URL ver eventos admin
app.get('/EventosAdmin', (req, res) => {
  // Usamos path.join para construir la ruta absoluta del archivo index.html
  const filePath = path.join(__dirname, '..', 'views', 'viewVisualizarEventoAdmin', 'visualizarEventoAdmin.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error al enviar el archivo:', err);
      res.status(500).send('Error al cargar la página');
    }
  });
});

//URL Agregar eventos
app.use(express.static(path.join(__dirname, '..', 'views', 'viewRegisterEvent')));
app.get('/AgregarEvento', (req, res) => {
  // Usamos path.join para construir la ruta absoluta del archivo index.html
  const filePath = path.join(__dirname, '..', 'views', 'viewRegisterEvent', 'RegistrarEvento.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error al enviar el archivo:', err);
      res.status(500).send('Error al cargar la página');
    }
  });
});

//URL Ver Admins
app.get('/VerAdmins', (req, res) => {
  // Usamos path.join para construir la ruta absoluta del archivo index.html
  const filePath = path.join(__dirname, '..', 'views', 'viewVisualizarUsuarios', 'visualizarUsuarios.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error al enviar el archivo:', err);
      res.status(500).send('Error al cargar la página');
    }
  });
});
//URL VER PERFIL admin
app.get('/MiPerfilAdmin', (req, res) => {
  // Usamos path.join para construir la ruta absoluta del archivo index.html
  const filePath = path.join(__dirname, '..', 'views', 'viewAdminProfile', 'PerfilAdmin.html');
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
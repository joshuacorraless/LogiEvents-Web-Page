import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import cors from 'cors';

// Routes
import usuariosRoutes from './routes/usuarios.routes.js';
import indexRoutes from './routes/index.routes.js';
import eventosRoutes from './routes/eventos.routes.js';
import reservationsRoutes from './routes/reservations.routes.js';


const app = express();
// Configuración básica que permite cualquier origen
app.use(cors());


// Configurar variables de entorno
dotenv.config();

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true // Forzar HTTPS
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Configuración de Multer (almacenamiento en memoria)
const storage = multer.memoryStorage();
const upload = multer({
  storage: multer.memoryStorage(), // Usa memoria en lugar de disco
  limits: { fileSize: 10 * 1024 * 1024 } // Límite de 10MB
});


// Función para subir imágenes a Cloudinary
const uploadToCloudinary = (fileBuffer, folder, publicId) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                public_id: publicId,
                overwrite: true,
                resource_type: 'auto'
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(fileBuffer);
    });
};



app.get('/favicon.ico', (req, res) => res.status(204));
//Api
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
//URL editar evento
app.get('/EditarEvento', (req, res) => {
  // Usamos path.join para construir la ruta absoluta del archivo index.html
  const filePath = path.join(__dirname, '..', 'views', 'viewEditarEvento', 'EditarEvento.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error al enviar el archivo:', err);
      res.status(500).send('Error al cargar la página');
    }
  });
});

//URL editar evento
app.get('/AgregarAdmin', (req, res) => {
  // Usamos path.join para construir la ruta absoluta del archivo index.html
  const filePath = path.join(__dirname, '..', 'views', 'viewRegistrarAdmin', 'RegistrarAdmin.html');
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
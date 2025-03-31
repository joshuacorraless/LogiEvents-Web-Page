import { Router } from "express";
import { getUsuarios, createUsuarios, deleteUsuarios, updateUsuarios, login, validateUserData, getEventDistribution, getTop5Events} from "../controllers/usuarios.controller.js";   




const router = Router();

router.get('/usuarios',getUsuarios); 
router.post('/usuarios', createUsuarios);
router.put('/usuarios/:id_usuario', updateUsuarios);
router.delete('/usuarios', deleteUsuarios );

//*nuevas rutas para daniela

// Ruta para Login
router.post("/Login", login);

// Ruta para Validar Datos de Usuario
router.post("/Usuario/ValidateData", validateUserData);

// Ruta para Top5 (retorna los 5 eventos con más reservaciones)
router.get("/Top5", getTop5Events);

// Ruta para Distribución de Eventos (por estado)
router.get("/DistribucionEvento", getEventDistribution);


export default router;

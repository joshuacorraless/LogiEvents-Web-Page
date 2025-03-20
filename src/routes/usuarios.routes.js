import { Router } from "express";
import { getUsuarios, createUsuarios, deleteUsuarios, updateUsuarios } from "../controllers/usuarios.controller.js";   




const router = Router();

router.get('/usuarios',getUsuarios); 

router.post('/usuarios', createUsuarios);

router.put('/usuarios/:id_usuario', updateUsuarios);


router.delete('/usuarios', deleteUsuarios );



export default router;

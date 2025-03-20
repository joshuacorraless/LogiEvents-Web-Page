import { Router } from "express";
import { getEventos, createEventos, deleteEventos, updateEventos } from "../controllers/eventos.controller.js";


const router = Router();

router.get('/eventos', getEventos);
router.post('/eventos', createEventos);
router.put('/eventos/:id_evento', updateEventos);
router.delete('/eventos/:id_evento', deleteEventos);

export default router;
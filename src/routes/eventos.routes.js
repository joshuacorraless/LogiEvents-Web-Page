import { Router } from "express";
import {
    getEventos,
    createEventos,
    updateEventos,

    requestDeleteEvent,
    confirmDeleteEvent
  } from '../controllers/eventos.controller.js';
  


const router = Router();

router.get('/eventos', getEventos);
router.post('/eventos', createEventos);
router.put('/eventos/:id_evento', updateEventos);


// NUEVAS rutas para el proceso de eliminación con verificación
router.post('/events/:id/request-delete', requestDeleteEvent);
router.post('/events/:id/confirm-delete', confirmDeleteEvent);

export default router;
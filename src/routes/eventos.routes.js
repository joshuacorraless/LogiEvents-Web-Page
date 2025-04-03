import { Router } from "express";
import {upload} from "../config/multer.config.js";

import {
    getEventos,
    createEventos,
    updateEventos,

    requestDeleteEvent,
    confirmDeleteEvent,
    startDeleteAgotado,
    verifySmsWord,
    sendEmailCode,
    verifyEmailCode,
    confirmDeleteAgotado  } from '../controllers/eventos.controller.js';
  


const router = Router();
router.post('/events', createEventos); 
router.put('/events/:id_evento', updateEventos); 



// NUEVAS rutas para el proceso de eliminación con verificación
router.post('/events/:id/request-delete', requestDeleteEvent);
router.post('/events/:id/confirm-delete', confirmDeleteEvent);


// Rutas para la eliminación de eventos agotados
router.post('/events/:id/agotado-start-delete', startDeleteAgotado);
router.post('/events/:id/agotado-verify-sms', verifySmsWord);
router.post('/events/:id/agotado-send-email', sendEmailCode);
router.post('/events/:id/agotado-verify-email', verifyEmailCode);
router.post('/events/:id/agotado-confirm-delete', confirmDeleteAgotado);
export default router;
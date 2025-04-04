import { Router } from "express";
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
    confirmDeleteAgotado, getEventById  } from '../controllers/eventos.controller.js';
  


const router = Router();


router.get('/eventos', getEventos);
router.post('/eventos', createEventos);
router.put('/eventos/:id_evento', updateEventos);

//* NUEVA ruta maes para obtener un evento por ID
router.get('/events/:id', getEventById);


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
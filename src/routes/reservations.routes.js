// reservations.routes.js
import { Router } from 'express';
import { startReservation, verifyReservation } from '../controllers/reservations.controller.js';

const router = Router();

// POST /api/reservations/start
router.post('/reservations/start', startReservation);

// POST /api/reservations/verify
router.post('/reservations/verify', verifyReservation);

export default router;

import { Router } from 'express';
import { uploadImage } from '../controllers/upload.controller.js';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' }); // Guarda temporalmente en servidor

router.post('/', upload.single('imagen'), uploadImage);

export default router;
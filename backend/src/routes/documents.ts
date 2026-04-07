import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as documentController from '../controllers/documentController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { reviewDocumentSchema } from '../utils/validators';
import { env } from '../config/env';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, env.UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(env.MAX_FILE_SIZE, 10) },
});

const router = Router();

router.use(authenticate);

router.get('/', documentController.getDocuments);
router.post('/', upload.single('file'), documentController.uploadDocument);
router.get('/:id', documentController.getDocument);
router.put('/:id/review', validate(reviewDocumentSchema), documentController.reviewDocument);

export default router;

import { Router } from 'express';
import { handleSendContactEmail } from '../controllers/contact.controller';

const router = Router();

router.post('/', handleSendContactEmail);

export default router;

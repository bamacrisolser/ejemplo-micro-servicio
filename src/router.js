import { Router } from 'express';
import { methods as Auth } from './controller/auth-controller.js';

const router = Router();
router.post('/', Auth.getUserToken);
router.get('/refresh-token', Auth.refreshUserToken);

export default router;
import express from 'express'
import authroutes from './auth.routes.js'
import ariesroutes from './aries.routes.js'
import credroutes from './credential.routes.js'

const router = express.Router();

router.use('/auth', authroutes);
router.use('/cred', credroutes);
router.use('/aries', ariesroutes);

export default router;
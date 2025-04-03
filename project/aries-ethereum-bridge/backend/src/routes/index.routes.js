import express from 'express'
import authroutes from './auth.routes.js'
import ariesroutes from './aries.routes.js'
import academicroutes from './academic.routes.js'

const router = express.Router();

router.use('/auth', authroutes);
router.use('/aries', ariesroutes);
router.use('/academic', academicroutes);

export default router;
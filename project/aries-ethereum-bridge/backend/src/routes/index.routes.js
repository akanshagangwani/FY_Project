import express from 'express'
import authroutes from './auth.routes.js'
import academicroutes from './academic.routes.js'

const router = express.Router();

router.use('/auth', authroutes);
router.use('/academic', academicroutes);

export default router;
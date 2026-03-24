import express from 'express';
const UserRouter = express.Router();
import { login, logout, purchasedCourse, signup } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

UserRouter.post('/signup',signup);
UserRouter.post('/login',login);
UserRouter.post('/logout',logout);
UserRouter.get('/purchased',verifyToken,purchasedCourse);

export default UserRouter;
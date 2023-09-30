import express from 'express';
import AuthController from '../server/controllers/AuthController.js';
import GoogleAuthController from '../server/controllers/GoogleAuthController.js';
import UsersController from '../server/controllers/UsersController.js';

const router = express.Router();

router.post("/signup", AuthController.signup);
router.get("/google", GoogleAuthController.getUser, UsersController.googleLogin);

export default router;

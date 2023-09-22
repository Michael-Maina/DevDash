import express from 'express';
import AuthController from '../server/controllers/AuthController.js';

const router = express.Router();

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.get('/login', (req, res) => {
  res.send('<h1>Login to DevDash</h1>');
});

export default router;

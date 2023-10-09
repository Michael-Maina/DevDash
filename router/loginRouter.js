import express from 'express';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import UsersController from '../server/controllers/UsersController.js';

// Get the current module's URL
const __filename = fileURLToPath(import.meta.url);

// Get the directory name
const __dirname = dirname(__filename);

const router = express.Router();

router.post('/login', UsersController.login);
router.post('/login/google', UsersController.googleLogin);

router.use(express.static(path.join(__dirname, '../frontend/public')));

router.get('/login', (req, res) => {
    const currentDirectory = __dirname;
    const parentDirectory = path.dirname(currentDirectory);
    res.sendFile(parentDirectory + "/frontend/public/login.html");
});

export default router;

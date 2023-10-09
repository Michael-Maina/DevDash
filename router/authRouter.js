import express from 'express';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import AuthController from '../server/controllers/AuthController.js';
import GoogleAuthController from '../server/controllers/GoogleAuthController.js';

// Get the current module's URL
const __filename = fileURLToPath(import.meta.url);

// Get the directory name
const __dirname = dirname(__filename);

const router = express.Router();

router.post("/signup", AuthController.signup);
router.get("/google", GoogleAuthController.getUser);

router.use(express.static(path.join(__dirname, '../frontend/public')));

router.get('/signup', (req, res) => {
    const currentDirectory = __dirname;
    const parentDirectory = path.dirname(currentDirectory);
    res.sendFile(parentDirectory + "/frontend/public/signup.html");
});


export default router;

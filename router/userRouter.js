import express from 'express';
import Session from '../utils/session.js';
import UsersController from '../server/controllers/UsersController.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Get the current module's URL
const __filename = fileURLToPath(import.meta.url);

// Get the directory name
const __dirname = dirname(__filename);

const router = express.Router();

router.use('/user/:userId', async (req, res, next) => {
  if (!req.cookies.session) {
    return res.status(401).redirect('/user/login');
  } else {
    try {
      const sessionCookie = req.cookies.session;
      const userSessionToken = await Session.getUser(sessionCookie);
      if (!userSessionToken) {
        return res.status(401).redirect('/user/login');
      }
      next();
    } catch(error) {
      console.error(`Error Retrieving Session Token`);
    }
  }
});

router.post('/logout', UsersController.logout);
router.put('/update', UsersController.updateUser);
router.delete('/delete', UsersController.deleteUser);
router.post('/login', UsersController.login);


router.use(express.static(path.join(__dirname, '../frontend/public')));

router.get('/login', (req, res) => {
    const currentDirectory = __dirname;
    const parentDirectory = path.dirname(currentDirectory);
    res.sendFile(parentDirectory + "/frontend/public/login.html");
});

router.get('/explore', (req, res) => {
  // res.send('<h1>Explore DevDash</h1>')
  const currentDirectory = __dirname;
  const parentDirectory = path.dirname(currentDirectory);
  res.sendFile(parentDirectory + "/frontend/public/user_explore.html");
});

export default router;

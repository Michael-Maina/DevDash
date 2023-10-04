import express from 'express';
import Session from '../utils/session.js';
import UsersController from '../server/controllers/UsersController.js';

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

router.get('/login', (req, res) => {
  res.send('<h1>Login to DevDash</h1>');
});
router.get('/explore', (req, res) => {
  res.send('<h1>Explore DevDash</h1>')
});

export default router;

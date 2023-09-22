import express from 'express';
import UsersController from '../server/controllers/UsersController.js';

const router = express.Router();

router.post('/logout', UsersController.logout);
router.put('/update', UsersController.updateUser);
router.delete('/delete', UsersController.deleteUser);
router.get('/explore', (req, res) => {
  res.send('<h1>Explore DevDash</h1>')
});

export default router;

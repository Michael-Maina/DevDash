import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './router/authRouter.js';
import userRouter from './router/userRouter.js';

// Load environment variables from .env file
dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cookieParser());
// app.use('/');
app.use('/auth', authRouter);
app.use('/user', userRouter); // Used for the login path
app.use('/user/:userId', userRouter); // Used after login, with userId now available

app.get('/', (req, res) => {
  res.send('<h1>Welcome to DevDash</h1>');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

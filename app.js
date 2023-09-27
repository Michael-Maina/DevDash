import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './router/authRouter.js';
import userRouter from './router/userRouter.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current module's URL
const __filename = fileURLToPath(import.meta.url);

// Get the directory name
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 5000;

const app = express();

// Serve static files from the "frontend" directory
app.use(express.static("frontend"));

app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRouter);
app.use('/:userId', userRouter);

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/frontend/index.html");
});

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + "/frontend/about.html");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

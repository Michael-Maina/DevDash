import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './router/authRouter.js';
import userRouter from './router/userRouter.js';
import loginRouter from './router/loginRouter.js';
import Session from './server/utils/session.js';
import PortHandler from './server/utils/portHandler.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import path from 'path';
import { exec } from 'child_process';
import filesController from './server/controllers/FilesController.js'


// Get the current module's URL
const __filename = fileURLToPath(import.meta.url);

// Get the directory name
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 5000;

const app = express();

// Serve static files from the "frontend" directory
app.use(express.static("frontend/public"));
app.use(cors());

app.use(express.json());
app.use(cookieParser());
// app.use('/');
app.use('/auth', authRouter);
app.use('/user', loginRouter); // Used for the login path
// Middleware function to authenticate login
app.use('/user/:userId', async (req, res, next) => {
  if (!req.cookies.session) {
    console.log('Redirecting user not signed in: No session cookie');
    return res.status(403).redirect('/user/login');
  } else {
    try {
      const sessionCookie = req.cookies.session;
      const userSessionToken = await Session.getUser(sessionCookie);
      if (!userSessionToken) {
        console.log('Redirecting user not signed in: Session Token Expired');
			  res.clearCookie('session', { path: '/user'});
        if (req.cookies.port) {
          res.clearCookie('port', { path: '/user'});
  
          const portsUsed = process.env.REDIS_PORTS_IN_USE;
          await PortHandler.delPort(portsUsed, req.cookies.port);
        }
        return res.status(403).redirect('/user/login');
      }
      if (userSessionToken.userId !== req.params.userId){
        console.log('Redirecting user not signed in: Session Token Invalid');
        console.log(`Session UserID: ${userSessionToken.userId}`);
        console.log(`Parameters UserID: ${req.params.userId}`);
        await Session.deleteUser(sessionCookie);
			  res.clearCookie('session', { path: '/user'});
        if (req.cookies.port) {
          res.clearCookie('port', { path: '/user'});
  
          const portsUsed = process.env.REDIS_PORTS_IN_USE;
          await PortHandler.delPort(portsUsed, req.cookies.port);
        }
        return res.status(403).redirect('/user/login');
      }
      next();
    } catch(error) {
      console.error(`Error Retrieving Session Token: Redirecting to Login Page`);
      return res.status(403).redirect('/user/login');
    }
  }
});
app.use('/user/:userId', userRouter); // Used after login, with userId now available

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/frontend/public/index.html");
});

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + "/frontend/public/signup.html");
});

app.get('/explore', (req, res) => {
  res.sendFile(__dirname + "/frontend/public/explore.html");
});

app.get('/about', (req, res) => {
  res.sendFile(__dirname + "/frontend/public/about.html");
});

// app.get('/login', (req, res) => {
//   res.send('<h1>Explore DevDash</h1>')
//   // res.sendFile(__dirname + "/frontend/public/login.html");
// });


app.use(express.static(path.join(__dirname, 'dist')));

app.get('/user/:userId/tutorial/:title', async (req, res) => {
  // Run Parcel to bundle the entry file
  const title = req.params.title;

  await filesController.formatConverter(`./server/articles/markdown/${title}.md`);

  exec('npx parcel build frontend/content_page.html', (error, stdout, stderr) => {
    if (error) {
      console.error('Parcel bundling error:', error);
      return res.status(500).send('Error bundling JavaScript.');
    }

    // Serve the HTML file
    return res.sendFile(path.join(__dirname, '/dist/content_page.html'));
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

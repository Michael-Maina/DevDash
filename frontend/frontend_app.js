import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { exec } from 'child_process';

// Get the current module's URL
const __filename = fileURLToPath(import.meta.url);

// Get the directory name
const __dirname = dirname(__filename);

const PORT = 5000;

const app = express();

// Serve static files from the "public" directory
app.use(express.static("public"));


app.get('/', (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get('/explore', (req, res) => {
  res.sendFile(__dirname + "/public/explore.html");
});

app.get('/about', (req, res) => {
  res.sendFile(__dirname + "/public/about.html");
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + "/public/signup.html");
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/tutorial', (req, res) => {
  // Run Parcel to bundle the entry file
  console.log("here");
  exec('npx parcel build tutorial.html', (error, stdout, stderr) => {
    if (error) {
      console.error('Parcel bundling error:', error);
      return res.status(500).send('Error bundling JavaScript.');
    }
      res.sendFile(path.join(__dirname, '/dist/tutorial.html'));
    // Serve the HTML file
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

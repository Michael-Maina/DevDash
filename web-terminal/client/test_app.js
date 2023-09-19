// app.js
import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const htmlFilePath = path.join(__dirname, 'index.html');
  res.sendFile(htmlFilePath);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


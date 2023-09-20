const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, 'dist')));


app.get('/tutorial', (req, res) => {
  // Run Parcel to bundle the entry file
  exec('npx parcel rebuild index.html', (error, stdout, stderr) => {
    if (error) {
      console.error('Parcel bundling error:', error);
      return res.status(500).send('Error bundling JavaScript.');
    }

    // Serve the HTML file
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


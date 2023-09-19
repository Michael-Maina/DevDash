const express = require('express');
const Docker = require('dockerode');
const { exec } = require('child_process');

const app = express();
const docker = new Docker();

app.post('/createContainer', async (req, res) => {
  try {
    let desiredPort = Math.floor((Math.random() * (49151 - 1024 + 1)) + 1024);

    // Define the path to your Docker command script file
    const dockerCommandScript = './docker-command.sh';

    // Execute the Docker command script with the desired port number as an argument
    const child = exec(`bash ${dockerCommandScript} ${desiredPort}`);

    // Execute the Docker command script
    child.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    child.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    child.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
    res.json({ message: `Container created and started successfully` });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to create and start container' });
  }
});

app.get('/containers', async (req, res) => {
  try {
    // List all running containers
    const containers = await docker.listContainers({ all: true });

    res.json({ containers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list containers' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

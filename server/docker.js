const express = require('express');
const Docker = require('dockerode');

const app = express();
const docker = new Docker();

app.post('/createContainer', async (req, res) => {
  try {
    // Create a new container with the specified name
    const container = await docker.createContainer({
      Image: 'ubuntu:20.04',
      Cmd: ['bash'],
      Tty: true,
    });

    // Start the container
    await container.start();

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

// async function createContainer()
// {
//     try {
//         // Create a new container with the specified name
//         const container = await docker.createContainer({
//         Image: 'ubuntu:22.04',
//         Cmd: ['bash'],
//         Tty: true,
//         });

//         // Start the container
//         await container.start();

//         console.log("started container");

//     } catch (error) {
//         console.log(error)
//     }
// }

// createContainer();

// const { Docker } = require('node-docker-api');

// const Docker = require('dockerode');
// const docker = new Docker({ socketPath: '/var/run/docker.sock' }); // Adjust the socket path as needed

// async function createContainer() {
//     try {
//         // Create a new container with the specified name
//         const container = await docker.createContainer({
//             Image: 'ubuntu:22.04',
//             Cmd: ['bash'],
//             Tty: true,
//         });

//         // Start the container
//         await container.start();

//         console.log("Started container");

//         // Attach to the container's TTY
//         const exec = await container.exec({
//             AttachStdin: true,
//             AttachStdout: true,
//             AttachStderr: true,
//             Tty: true,
//             Cmd: ['bash'],
//         });

//         const stream = await exec.start({ stdin: true, stdout: true, stderr: true });

//         // Pipe the container's TTY to the current terminal
//         container.modem.demuxStream(stream, process.stdout, process.stderr);

//     } catch (error) {
//         console.error("Error:", error);
//     }
// }

// createContainer();

// const Docker = require('dockerode');


// const { Docker }= require('node-docker-api');

// const docker = new Docker({ socketPath: '/var/run/docker.sock' }); // Adjust the socket path as needed

// async function createContainer() {
//     try {
//         // Create a new container with the specified name
//         const container = await docker.container.create({
//             Image: 'ubuntu:22.04',
//             Cmd: ['bash'],
//             Tty: true,
//             AttachStdin: true,
//             AttachStdout: true,
//             AttachStderr: true,
//         });

//         // Start the container
//         await container.start();

//         console.log("Started container");

//         // Attach to the container's TTY
//         const exec = await container.exec.create({
//             AttachStdin: true,
//             AttachStdout: true,
//             AttachStderr: true,
//             Tty: true,
//             Cmd: ['bash'],
//         });

//         const stream = await exec.start({ hijack: true, stdin: true, stdout: true, stderr: true });

//         // Pipe the container's TTY to the current terminal
//         stream.pipe(process.stdout);

//         // Handle input from the terminal (optional)
//         process.stdin.pipe(stream);

//         // Wait for the container to exit (optional)
//         const status = await exec.inspect();
//         console.log(`Container exited with code ${status.ExitCode}`);

//     } catch (error) {
//         console.error("Error:", error);
//     }
// }

// createContainer();

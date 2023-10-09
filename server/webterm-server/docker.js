import Docker from 'dockerode';
import { exec } from 'child_process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the current module's URL
const __filename = fileURLToPath(import.meta.url);

// Get the directory name
const __dirname = dirname(__filename);

const docker = new Docker();

export default class DockerClient {
  static async createContainer(req, res, next) {
    try {
      let desiredPort = req.cookies.port;

      // Define the path to your Docker command script file
      const dockerCommandScript = path.join(__dirname, 'docker-command.sh');

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
      // res.json({ message: `Container created and started successfully` });

      next();

    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to create and start container' });
    }
  }

  // static async destroyContainer(req, res, next) {
  //   try {
  //     let desiredPort = req.cookies.port;

  //     // Define the path to your Docker command script file
  //     const dockerCommandScript = path.join(__dirname, 'docker-destroy.sh');

  //     // Execute the Docker command script with the desired port number as an argument
  //     const child = exec(`bash ${dockerCommandScript} ${desiredPort}`);

  //     // Execute the Docker command script
  //     child.stdout.on('data', (data) => {
  //       console.log(`stdout: ${data}`);
  //     });

  //     child.stderr.on('data', (data) => {
  //       console.error(`stderr: ${data}`);
  //     });

  //     child.on('close', (code) => {
  //       console.log(`child process exited with code ${code}`);
  //     });
  //     // res.json({ message: `Container created and started successfully` });

  //     next();

  //   } catch (error) {
  //     console.log(error)
  //     res.status(500).json({ error: 'Failed to destroy container' });
  //   }
  // }
}

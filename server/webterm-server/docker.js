import Docker from 'dockerode';
import { exec } from 'child_process';

const docker = new Docker();

export default class DockerClient {
  static async createContainer(req, res, next) {
    try {
      let desiredPort = req.cookies.port;

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

      next();

    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to create and start container' });
    }
  }

  // app.get('/containers', async (req, res) => {
  //   try {
  //     // List all running containers
  //     const containers = await docker.listContainers({ all: true });

  //     res.json({ containers });
  //   } catch (error) {
  //     res.status(500).json({ error: 'Failed to list containers' });
  //   }
  // });
}

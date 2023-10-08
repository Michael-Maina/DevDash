# DevDash Developer Learning Platform

DevDash is a web application designed to empower developers by providing tutorials and hands-on experience with various development tools such as Git, Docker, Bash scripting, and more. It offers a unique sandbox environment, running within a Docker container, which contains the relevant development tools required for each tutorial.

## Tech Stack

### Frontend
- **HTML**: Used for structuring the web pages.
- **CSS**: Responsible for styling and layout.
- **Vanilla JavaScript**: Enhances interactivity and functionality.
- **Xterm**: Powers the client-side terminal for an authentic development experience.
- **Socket.IO**: Enables real-time communication between the client and server.

### Backend
- **Node.js**: The runtime environment for the server.
- **Express.js**: The web framework that simplifies routing and handling HTTP requests.
- **Docker**: Utilized for creating and managing isolated sandbox environments.
- **MongoDB**: Stores essential data related to tutorials, user progress, and more.
- **Mongoose**: ODM for interaction with MongoDB
- **Redis**: Stores essential data related to active user sessions.

## Features

- **Interactive Tutorials**: Engaging tutorials covering a variety of development tools.
- **Sandbox Environment**: Docker-powered isolated environments for practical learning.
- **Real-time Terminal**: WebSocket-driven communication between the client-side and server-side terminals.
- **Responsive Design**: Ensures accessibility across different devices and screen sizes.

## How It Works

1. **Tutorial Selection**: Users can choose from a selection of tutorials on various development tools.
2. **Sandbox Environment**: Upon selecting a tutorial, a Docker container with the necessary development environment is spun up.
3. **Real-time Terminal**: Users can interact with the terminal rendered on the webpage using the Xterm library. Commands entered by the user are executed within the Docker container, providing hands-on experience.

## Usage

To run the DevDash on your local machine, please refer to the project's [installation and setup instructions](https://github.com/Michael-Maina/DevDash/blob/master/INSTALLATION_&_SETUP.md).

## Acknowledgments

- DevDash leverages the power of open-source technologies and libraries to create an immersive learning experience for developers.
- Special thanks to the communities behind Docker, Node.js, Express.js, MongoDB, Xterm, and Socket.IO for their contributions to this project.

For more detailed information on contributing or deploying this application, please check the project's [full documentation](link-to-documentation).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](link-to-license)

---

*Note: This README provides an overview of the DevDash Developer Learning Platform and its tech stack. For detailed information on how to contribute or run the application on another platform, please refer to the project's documentation.*
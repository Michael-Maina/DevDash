# Installation and Setup Instructions

This document provides step-by-step instructions to help you set up DevDash on your local environment. Before you begin, ensure that you have the following technologies and their respective versions installed:

- **Node.js**: Version 18.17.1
- **MongoDB**: Version 6.0.10
- **Docker**: Version 20.10.7
- **Redis**: Version 5.0.7

## Step 1: Clone the Repository

Begin by cloning the DevDash repository from GitHub:

```bash
git clone https://github.com/Michael-Maina/DevDash.git
```

## Step 2: Install Dependencies

Navigate to the project directory and install the required Node.js dependencies:

```bash
cd DevDash
npm install
```

## Step 3: Configure Environment Variables

Create a `.env` file in the project root to store your environment variables. Below is a sample `.env` file with placeholders for you to fill in:

```plaintext
# Database
SCHEMA_VERSION=1.0
DB_HOST=127.0.0.1
DB_PORT=27017
DB_DATABASE="project_db"

# Main server
PORT=3000

# Redis Configuration
REDIS_PORTS_IN_USE='ports:in_use'
REDIS_PORTS_ASSIGNED='ports:assigned'

# User Session
SESSION_EXPIRATION=24 # In hours
```

Replace the placeholder values with your specific configurations.

## Step 4: Start the Application

Run the following command to start the Developer Learning Platform:

```bash
npm start
```

## Step 5: Access the Application

You can access the Developer Learning Platform in your web browser at the following URL:

```plaintext
http://localhost:3000
```

You're now ready to explore and use the platform for learning and practicing various development tools.

---

Please note that this document provides a basic setup for running the application locally. For more advanced deployment options and customization, refer to the project's documentation or consult the development team.

If you encounter any issues or have questions, please refer to the troubleshooting section in the project's documentation or reach out to our support team.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](link-to-license)

---

*Note: Ensure that you have the specified versions of the required technologies installed before proceeding with the setup. The `.env` file allows you to configure environment-specific settings for your instance of the Developer Learning Platform.*
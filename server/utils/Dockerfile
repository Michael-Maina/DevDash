# Use Ubuntu 22.04 as the base image
FROM ubuntu:20.04

# Set the working directory inside the container
WORKDIR /server

# Copy package.json and package-lock.json (if applicable)
COPY package*.json ./

# Install system dependencies (you may need to add more dependencies as per your project's requirements)
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js and npm
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

# Install application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 for the application
EXPOSE 8080

# Define the command to start the application
CMD ["npm", "start"]


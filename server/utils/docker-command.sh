#!/bin/bash

# Check if a port number argument is provided, default to 8080 if not
PORT="${1:-8080}"

# Run the Docker container and link the provided port number to the container's port 8080
docker run -p "$PORT":8080 docker-ptty

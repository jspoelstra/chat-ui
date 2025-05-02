#!/bin/bash

# Script to build the Docker image
# This is a legacy script - consider using ./docker-run.sh instead

echo "This script is deprecated. For a better experience, use ./docker-run.sh instead."
read -p "Continue with this script? (y/n): " CONTINUE

if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
  echo "Exiting. Run ./docker-run.sh for the recommended approach."
  exit 0
fi

# Build the Docker image
echo "Building Docker image..."
docker build -t chat-ui:latest .

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "Docker build failed! Please check the errors above."
  exit 1
fi

echo "Build completed successfully!"

# Ask if user wants to run the container now
read -p "Do you want to start the container now? (y/n): " START_NOW

if [[ "$START_NOW" =~ ^[Yy]$ ]]; then
  echo "Starting container..."
  
  # Get WebSocket URI from user
  read -p "Enter WebSocket URI (or press Enter for default ws://localhost:501): " WS_URI
  WS_URI=${WS_URI:-ws://localhost:501}
  
  # Run the container
  docker run -d --name chat-ui -p 8080:80 -e WS_URI="$WS_URI" chat-ui:latest
  
  # Show the running container
  echo ""
  echo "Running container:"
  docker ps --filter "name=chat-ui"
  
  echo ""
  echo "The application should now be available at http://localhost:8080"
else
  echo ""
  echo "You can start the container later with:"
  echo "docker run -d --name chat-ui -p 8080:80 -e WS_URI=ws://your-backend-server chat-ui:latest"
  echo "Then access the application at http://localhost:8080"
fi

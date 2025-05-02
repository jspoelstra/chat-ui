#!/bin/bash

# This script tests the Docker container with an Azure Container App-like environment

# Exit on error
set -e

echo "========== Chat UI Azure Container App Simulator =========="

# Build the AMD64 image for Azure
echo "Building image for AMD64 architecture..."
docker buildx create --name amd64builder --use 2>/dev/null || true
docker buildx build --platform linux/amd64 \
  --tag chat-ui:azure-test \
  --load \
  .

echo ""
echo "Running container with Azure-like environment variables..."

# Get WebSocket URI
DEFAULT_WS_URI="wss://your-backend.example.com/ws"
read -p "Enter WebSocket URI for testing [$DEFAULT_WS_URI]: " WS_URI
WS_URI=${WS_URI:-$DEFAULT_WS_URI}

# Create special environment variables that exist in Azure Container Apps
echo "Simulating Azure Container App environment"

# Run the container with Azure Container App environment variables
docker run -d \
  --name chat-ui-azure-test \
  -p 8080:80 \
  -e WS_URI="$WS_URI" \
  -e CONTAINER_APP_NAME="chat-ui-local" \
  -e CONTAINER_APP_REVISION="1" \
  -e WEBSITES_CONTAINER_START_TIME_LIMIT="1800" \
  chat-ui:azure-test

echo ""
echo "Container started with Azure-like environment!"
echo "Access the application at http://localhost:8080"
echo ""

# Show logs
echo "Showing container logs:"
docker logs -f chat-ui-azure-test

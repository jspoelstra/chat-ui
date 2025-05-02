#!/bin/bash

# Script to build and run the Docker container directly without Docker Compose
# This script replaces the need for docker-compose.yml

# Exit on error
set -e

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Function to validate WebSocket URI format
validate_ws_uri() {
  uri="$1"
  # Check if it starts with ws:// or wss://
  if echo "$uri" | grep -E "^(ws|wss)://" > /dev/null; then
    return 0 # Valid
  else
    return 1 # Invalid
  fi
}

echo "========== Chat UI Docker Runner =========="
echo ""

# Check if container is already running
if docker ps -q --filter "name=chat-ui" | grep -q .; then
  echo "A container named 'chat-ui' is already running."
  read -p "Do you want to stop and remove it? (y/n): " REMOVE
  if [[ "$REMOVE" =~ ^[Yy]$ ]]; then
    echo "Stopping and removing existing container..."
    docker stop chat-ui || true
    docker rm chat-ui || true
  else
    echo "Exiting without starting a new container."
    exit 0
  fi
fi

# Check if stopped container exists
if docker ps -aq --filter "name=chat-ui" | grep -q .; then
  echo "Removing stopped 'chat-ui' container..."
  docker rm chat-ui || true
fi

# Check if image exists
if ! docker image inspect chat-ui:latest >/dev/null 2>&1; then
  echo "Chat UI Docker image not found. Building image..."
  docker build -t chat-ui:latest .
else
  # Ask if user wants to rebuild the image
  read -p "Do you want to rebuild the Docker image? (y/n): " REBUILD
  if [[ "$REBUILD" =~ ^[Yy]$ ]]; then
    echo "Rebuilding Docker image..."
    docker build -t chat-ui:latest .
  fi
fi

# Get WebSocket URI
DEFAULT_WS_URI="ws://localhost:501"
read -p "Enter WebSocket URI [$DEFAULT_WS_URI]: " WS_URI
WS_URI=${WS_URI:-$DEFAULT_WS_URI}

# Validate WebSocket URI
if ! validate_ws_uri "$WS_URI"; then
  echo "Warning: The WebSocket URI '$WS_URI' may not be valid. It should start with ws:// or wss://"
  read -p "Do you want to continue anyway? (y/n): " CONTINUE
  if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
    echo "Exiting."
    exit 1
  fi
fi

# Get host port
DEFAULT_PORT="8080"
read -p "Enter host port [$DEFAULT_PORT]: " HOST_PORT
HOST_PORT=${HOST_PORT:-$DEFAULT_PORT}

echo ""
echo "Starting container with configuration:"
echo "- Image: chat-ui:latest"
echo "- Host Port: $HOST_PORT"
echo "- WebSocket URI: $WS_URI"
echo ""

# Run the container
docker run -d \
  --name chat-ui \
  -p "$HOST_PORT:80" \
  -e WS_URI="$WS_URI" \
  chat-ui:latest

echo ""
echo "Container started!"
echo "You can access the application at http://localhost:$HOST_PORT"
echo ""

# Show logs
read -p "Do you want to view the container logs? (y/n): " VIEW_LOGS
if [[ "$VIEW_LOGS" =~ ^[Yy]$ ]]; then
  docker logs -f chat-ui
else
  # Show debug commands
  echo ""
  echo "Useful commands:"
  echo "- View logs: docker logs -f chat-ui"
  echo "- Stop container: docker stop chat-ui"
  echo "- Remove container: docker rm chat-ui"
  echo "- Check status: docker ps -a | grep chat-ui"
fi

# Docker Deployment Guide

This guide explains how to deploy the Chat UI application using Docker.

## Prerequisites

- Docker installed on your system

## Quick Start

We provide two options for running the application: a simple script approach and the direct Docker command approach.

### Option 1: Using the Script (Recommended)

1. Run the provided script:

```bash
./docker-run.sh
```

This script will:
- Build the frontend Docker image if needed
- Prompt for WebSocket URI and host port
- Start the container with your configuration
- Provide useful debug commands

### Option 2: Manual Docker Command

1. Build the Docker image:

```bash
docker build -t chat-ui:latest .
```

2. Run the container:

```bash
docker run -d --name chat-ui -p 8080:80 -e WS_URI=ws://your-backend-server chat-ui:latest
```

3. Access the application at http://localhost:8080

## Environment Variables

You can customize the behavior of the application by setting environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| WS_URI | WebSocket server URI | ws://localhost:501 |

### WebSocket Configuration

The WebSocket URI is particularly important as it determines where the browser will attempt to connect for real-time communication:

- **Format**: Must use `ws://` or `wss://` protocol (for secure WebSockets)
- **Direct Connection**: The browser connects directly to this URI, so it must be accessible from the client's network
- **No Proxying**: Nginx in this setup does not proxy WebSocket connections

#### Examples:

1. Local development with locally running backend:
   ```
   WS_URI=ws://host.docker.internal:501
   ```
   Note: `host.docker.internal` allows Docker containers to access services running on the host machine.

2. Production with secure WebSockets:
   ```
   WS_URI=wss://api.example.com/websocket
   ```

3. Custom port:
   ```
   WS_URI=ws://chat-server:8765
   ```

### Setting Environment Variables

When using the `docker-run.sh` script, you'll be prompted to enter the WebSocket URI.

If running Docker directly, set the environment variable when running the container:

```bash
docker run -d --name chat-ui -p 8080:80 -e WS_URI=ws://your-backend-server:501 chat-ui:latest
```

You can set multiple environment variables if needed:

```bash
docker run -d --name chat-ui -p 8080:80 \
  -e WS_URI=ws://your-backend-server:501 \
  chat-ui:latest
```

## Building for Production

To build only the Docker image without starting a container:

```bash
docker build -t chat-ui:latest .
```

## Customizing Nginx Configuration

The Nginx configuration is in the `nginx.conf` file. You can modify it to adjust:

- HTTP headers
- Cache control
- Static file handling
- And more

After modifying the configuration, rebuild the Docker image.

## Connecting to a Backend Service

This application requires a WebSocket backend service to function properly. You must:

1. Ensure your WebSocket backend service is running and accessible
2. Set the WS_URI environment variable to point to your backend server
3. Make sure the WebSocket URI is accessible from the client's browser

```bash
# Example: Starting the container and pointing to your backend
docker run -d --name chat-ui -p 8080:80 -e WS_URI=wss://your-backend-server.com/chat chat-ui:latest
```

## Troubleshooting

### Container Issues

If you encounter issues with the container:

1. Check container logs:
   ```bash
   docker logs chat-ui
   ```

2. Inspect container details:
   ```bash
   docker inspect chat-ui
   ```

3. To restart the container:
   ```bash
   docker restart chat-ui
   ```

### WebSocket Connection Issues

If the WebSocket connection fails:

1. Check if your backend server is running and accessible
2. Verify the WS_URI environment variable is set correctly and points to a valid WebSocket endpoint
3. Check the browser console for connection errors
4. Remember: The browser connects directly to the WebSocket server, so the URI must be accessible from the client's network
5. Test the WebSocket connection using a tool like `websocat` or an online WebSocket tester

### Advanced Docker Troubleshooting

1. For networking issues:
   ```bash
   docker network inspect bridge
   ```

2. To enter the container for debugging:
   ```bash
   docker exec -it chat-ui /bin/sh
   ```

3. To check environment variables inside the container:
   ```bash
   docker exec chat-ui env
   ```

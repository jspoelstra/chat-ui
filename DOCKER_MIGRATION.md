# Docker Migration Notes

This document outlines the migration from Docker Compose to a direct Docker approach for the Chat UI application.

## Changes Made

1. **Simplified Deployment Process**
   - Created an improved `docker-run.sh` script for direct Docker usage
   - Updated documentation to reflect the simpler approach
   - Kept backward compatibility with notes for those using Docker Compose

2. **Why We Moved Away from Docker Compose**
   - With only a single container to manage (frontend only), Docker Compose added unnecessary complexity
   - Direct Docker commands provide better control and are more transparent
   - Simplified onboarding for new developers

3. **Improvements in the New Approach**
   - Interactive prompts for WebSocket URIs and ports
   - Better handling of existing containers
   - Improved validation and error messaging
   - More helpful debug information

## Original Docker Compose Configuration

For reference, the original `docker-compose.yml` was:

```yaml
services:
  # Frontend service
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:80" # Map host port 8080 to container port 80
    environment:
      NODE_ENV: production
      # Default WebSocket URI - can be overridden at runtime
      WS_URI: ws://localhost:501
    restart: unless-stopped
```

## Migration Instructions

If you were using Docker Compose, switch to the new approach by:

1. Using the new script: `./docker-run.sh`
2. Or running direct Docker commands:
   ```bash
   docker build -t chat-ui:latest .
   docker run -d --name chat-ui -p 8080:80 -e WS_URI=ws://your-backend-server chat-ui:latest
   ```

The functionality remains unchanged - only the deployment method has been simplified.

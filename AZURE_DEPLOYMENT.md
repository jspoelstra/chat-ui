# Azure Container App Deployment Guide

This guide explains how to deploy the Chat UI application to Azure Container Apps using the provided Makefile.

## Prerequisites

- [Docker](https://www.docker.com/) installed on your local machine
- [Docker Buildx](https://docs.docker.com/buildx/working-with-buildx/) for multi-architecture builds
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed and configured
- An Azure subscription
- An Azure Container Registry (ACR)
- An Azure Container App Environment

## Configuration

Before deployment, update the following variables in the Makefile or set them as environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `ACR_NAME` | Your Azure Container Registry name | myacr |
| `RESOURCE_GROUP` | Your Azure Resource Group name | myresourcegroup |
| `CONTAINER_APP_ENV` | Your Azure Container App Environment name | mycontainerenv |
| `CONTAINER_APP_NAME` | Name for your Container App | chat-ui |
| `WS_URI` | WebSocket URI for your backend service | wss://your-backend-service.com/websocket |
| `IMAGE_NAME` | Name for your Docker image | chat-ui |
| `IMAGE_TAG` | Tag for your Docker image | latest |

## Deployment Steps

### Step 1: Login to Azure and ACR

```bash
make login
```

This logs you into Azure using the Azure CLI and authenticates Docker with your Azure Container Registry.

### Step 2: Build the Docker Image

```bash
make image
```

This builds an AMD64 architecture Docker image (compatible with Azure) using Docker Buildx, even when running on ARM-based systems like M1/M2/M3 MacBooks.

### Step 3: Push the Image to ACR

```bash
make push
```

This pushes the built Docker image to your Azure Container Registry.

### Step 4: Deploy to Azure Container Apps

```bash
make deploy
```

This creates or updates your Azure Container App with the latest image, configuring the required environment variables and ingress settings.

### All-in-One Command

To run all steps in sequence:

```bash
make all-steps
```

## Environment Variables in Azure Container App

The deployment configures the following environment variables:

- `WS_URI`: WebSocket URI for your backend service

## Customizing the Deployment

### Custom Image Tag

To use a specific image tag:

```bash
IMAGE_TAG=v1.0.0 make all-steps
```

### Custom WebSocket URI

To specify a different WebSocket backend:

```bash
WS_URI=wss://api.example.com/ws make deploy
```

## Troubleshooting

### Image Build Issues

If you encounter issues with the multi-architecture build:

1. Make sure Docker Buildx is installed and configured
2. Try running `docker buildx ls` to verify available builders
3. Clear Docker build cache with `docker builder prune`

### Authentication Issues

If you encounter authentication issues with ACR:

```bash
az acr login --name YOUR_ACR_NAME
```

### Container App Issues

To check the logs of your deployed app:

```bash
az containerapp logs show --name CONTAINER_APP_NAME --resource-group RESOURCE_GROUP
```

## Scaling and Production Considerations

For production deployments, consider configuring:

1. **Scale Configuration**: Set minimum and maximum replicas
   ```bash
   az containerapp update --name CONTAINER_APP_NAME --resource-group RESOURCE_GROUP --min-replicas 2 --max-replicas 10
   ```

2. **Custom Domain and HTTPS**: Configure custom domains with TLS certificates
   ```bash
   az containerapp hostname add --name CONTAINER_APP_NAME --resource-group RESOURCE_GROUP --hostname example.com
   ```

3. **Monitoring**: Enable Application Insights for monitoring
   ```bash
   az monitor app-insights component create --app YOUR_APP_INSIGHTS --location YOUR_REGION --resource-group RESOURCE_GROUP
   ```

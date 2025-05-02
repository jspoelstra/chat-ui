# Makefile for Chat UI Container App deployment

# Configuration variables (can be overridden via environment variables)
IMAGE_NAME ?= chat-ui
IMAGE_TAG ?= latest
ACR_NAME ?= myacr  # Change to your Azure Container Registry name
RESOURCE_GROUP ?= myresourcegroup  # Change to your resource group
CONTAINER_APP_ENV ?= mycontainerenv  # Change to your Container App environment name
CONTAINER_APP_NAME ?= chat-ui
WS_URI ?= wss://your-backend-service.com/websocket  # Change to your WebSocket backend URL

# Full image reference
ACR_IMAGE = $(ACR_NAME).azurecr.io/$(IMAGE_NAME):$(IMAGE_TAG)

# Default target
.PHONY: all
all: help

# Help information
.PHONY: help
help:
	@echo "Chat UI Azure Container App Deployment"
	@echo ""
	@echo "Available targets:"
	@echo "  image   - Build Docker image (AMD64 architecture) for Azure"
	@echo "  push    - Push Docker image to Azure Container Registry"
	@echo "  deploy  - Deploy to Azure Container App"
	@echo "  clean   - Remove local Docker images"
	@echo "  login   - Login to Azure and ACR"
	@echo ""
	@echo "Configuration (set via environment variables):"
	@echo "  IMAGE_NAME=$(IMAGE_NAME)"
	@echo "  IMAGE_TAG=$(IMAGE_TAG)"
	@echo "  ACR_NAME=$(ACR_NAME)"
	@echo "  RESOURCE_GROUP=$(RESOURCE_GROUP)"
	@echo "  CONTAINER_APP_ENV=$(CONTAINER_APP_ENV)"
	@echo "  CONTAINER_APP_NAME=$(CONTAINER_APP_NAME)"
	@echo "  WS_URI=$(WS_URI)"

# Build Docker image for AMD64 architecture (compatible with Azure)
.PHONY: image
image:
	@echo "Building $(IMAGE_NAME):$(IMAGE_TAG) for AMD64 architecture..."
	docker buildx create --name amd64builder --use || true
	docker buildx build --platform linux/amd64 \
		--tag $(IMAGE_NAME):$(IMAGE_TAG) \
		--tag $(ACR_NAME).azurecr.io/$(IMAGE_NAME):$(IMAGE_TAG) \
		--load \
		.
	@echo "Image built successfully: $(IMAGE_NAME):$(IMAGE_TAG)"

# Login to Azure and ACR
.PHONY: login
login:
	@echo "Logging in to Azure..."
	az login
	@echo "Logging in to ACR..."
	az acr login --name $(ACR_NAME)

# Push Docker image to Azure Container Registry
.PHONY: push
push:
	@echo "Pushing image to $(ACR_NAME).azurecr.io..."
	docker push $(ACR_NAME).azurecr.io/$(IMAGE_NAME):$(IMAGE_TAG)
	@echo "Image pushed: $(ACR_IMAGE)"

# Deploy to Azure Container App
.PHONY: deploy
deploy:
	@echo "Deploying to Azure Container App..."
	az containerapp create \
		--name $(CONTAINER_APP_NAME) \
		--resource-group $(RESOURCE_GROUP) \
		--environment $(CONTAINER_APP_ENV) \
		--registry-server $(ACR_NAME).azurecr.io \
		--image $(ACR_IMAGE) \
		--target-port 80 \
		--ingress external \
		--env-vars WS_URI=$(WS_URI)
	@echo "Deployment completed for $(CONTAINER_APP_NAME)"
	@echo "Access your application at: https://$(CONTAINER_APP_NAME).$(az containerapp env show --name $(CONTAINER_APP_ENV) --resource-group $(RESOURCE_GROUP) --query 'properties.defaultDomain' -o tsv)"

# Clean Docker images
.PHONY: clean
clean:
	@echo "Removing local Docker images..."
	-docker rmi $(IMAGE_NAME):$(IMAGE_TAG) 2>/dev/null || true
	-docker rmi $(ACR_NAME).azurecr.io/$(IMAGE_NAME):$(IMAGE_TAG) 2>/dev/null || true
	-docker buildx rm amd64builder 2>/dev/null || true
	@echo "Clean completed"

# Run all steps: build, push, and deploy
.PHONY: all-steps
all-steps: login image push deploy
	@echo "Build, push, and deploy completed successfully!"

# filepath: /Users/jacobspoelstra/git/chat-ui/Makefile
# Makefile for Chat UI Container App deployment

# Configuration variables with support for environment variables and .env file
# Preferred order: 1. Command line environment variables, 2. .env file, 3. Default values

# Check if .env file exists and if environment variable is not already set
ifneq ($(wildcard .env),)
  # Function to get value from .env file if environment variable is not set
  env_or_default = $(if $(shell printenv $(1)),$(shell printenv $(1)),$(shell grep -E "^$(1)=" .env 2>/dev/null | cut -d= -f2-))
else
  # If no .env file, just use environment variable or empty string
  env_or_default = $(shell printenv $(1))
endif

# Set final values with defaults if neither environment nor .env provide them
IMAGE_NAME := $(if $(call env_or_default,IMAGE_NAME),$(call env_or_default,IMAGE_NAME),chat-ui)
IMAGE_TAG := $(if $(call env_or_default,IMAGE_TAG),$(call env_or_default,IMAGE_TAG),latest)
ACR_NAME := $(if $(call env_or_default,ACR_NAME),$(call env_or_default,ACR_NAME),myacr)
RESOURCE_GROUP := $(if $(call env_or_default,RESOURCE_GROUP),$(call env_or_default,RESOURCE_GROUP),myresourcegroup)
CONTAINER_APP_ENV := $(if $(call env_or_default,CONTAINER_APP_ENV),$(call env_or_default,CONTAINER_APP_ENV),mycontainerenv)
CONTAINER_APP_NAME := $(if $(call env_or_default,CONTAINER_APP_NAME),$(call env_or_default,CONTAINER_APP_NAME),chat-ui)
WS_URI := $(if $(call env_or_default,WS_URI),$(call env_or_default,WS_URI),wss://your-backend-service.com/websocket)
LOCATION := $(if $(call env_or_default,LOCATION),$(call env_or_default,LOCATION),eastus)

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
	@echo "  init    - Create a new .env file from the sample template"
	@echo "  show-config - Display current configuration values"
	@echo ""
	@if [ -f .env ]; then \
		echo "Configuration (using .env file plus any environment variable overrides):"; \
	else \
		echo "Configuration (using environment variables or defaults):"; \
	fi
	@echo "  IMAGE_NAME=$(IMAGE_NAME)"
	@echo "  IMAGE_TAG=$(IMAGE_TAG)"
	@echo "  ACR_NAME=$(ACR_NAME)"
	@echo "  RESOURCE_GROUP=$(RESOURCE_GROUP)"
	@echo "  CONTAINER_APP_ENV=$(CONTAINER_APP_ENV)"
	@echo "  CONTAINER_APP_NAME=$(CONTAINER_APP_NAME)"
	@echo "  WS_URI=$(WS_URI)"
	@echo "  LOCATION=$(LOCATION)"

# Show configuration values (useful for testing)
.PHONY: show-config
show-config:
	@echo "IMAGE_NAME=$(IMAGE_NAME)"
	@echo "IMAGE_TAG=$(IMAGE_TAG)"
	@echo "ACR_NAME=$(ACR_NAME)"
	@echo "RESOURCE_GROUP=$(RESOURCE_GROUP)"
	@echo "CONTAINER_APP_ENV=$(CONTAINER_APP_ENV)"
	@echo "CONTAINER_APP_NAME=$(CONTAINER_APP_NAME)"
	@echo "WS_URI=$(WS_URI)"
	@echo "LOCATION=$(LOCATION)"

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
		--location $(LOCATION) \
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

# Initialize .env file from sample template
.PHONY: init
init:
	@if [ -f .env ]; then \
		echo "Warning: .env file already exists"; \
		echo "To create a new one, remove or rename the existing .env file first"; \
	else \
		cp -v .env.sample .env; \
		echo "Created .env file from template. Edit it with your specific configuration."; \
		echo "Then use 'make' commands to build, push, and deploy."; \
	fi

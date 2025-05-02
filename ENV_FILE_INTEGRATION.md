# .env File Integration for Azure Deployment

This document describes the implementation of `.env` file support for the Chat UI Azure Container Apps deployment configuration.

> **Note**: The `.env` file is added to `.gitignore` and should not be committed to the repository as it may contain sensitive information and personal environment configurations.

## Overview

The deployment configuration now supports three levels of configuration, in order of priority:

1. **Command line environment variables** (highest priority)
2. **Values from `.env` file** (if it exists)
3. **Default values** in the Makefile (lowest priority)

This allows for flexible deployment configurations, supporting both local development and CI/CD pipelines.

## Implementation Details

### 1. Environment Variable Loading Logic

The Makefile uses a custom function to properly load values with the correct priority order:

```makefile
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
```

### 2. Sample .env Template

A sample template file `.env.sample` is provided with default values:

```
# Azure Container Registry configuration
ACR_NAME=myacr
RESOURCE_GROUP=myresourcegroup
CONTAINER_APP_ENV=mycontainerenv

# Application configuration
CONTAINER_APP_NAME=chat-ui
IMAGE_NAME=chat-ui
IMAGE_TAG=latest

# Application settings
WS_URI=wss://your-backend-service.com/websocket

# Optional: Azure region
LOCATION=eastus
```

### 3. Initialization Command

Users can create a new `.env` file from the template:

```bash
make init
```

### 4. Configuration Display

The current configuration can be displayed:

```bash
make show-config
```

## Testing

A test script `test-env-file.sh` is provided to verify the functionality of the `.env` file and environment variable overrides.

The test script verifies:
1. Proper loading of values from `.env` file
2. Overriding values via environment variables
3. Fallback to default values when no `.env` file exists

## Example Usage

### Using .env File

```bash
# Create and edit a .env file
make init
vi .env

# Use the values from .env
make all-steps
```

### Overriding with Environment Variables

```bash
# Override a single value
IMAGE_TAG=v2.0 make deploy

# Override multiple values
IMAGE_TAG=v2.0 LOCATION=westus2 make deploy
```

### CI/CD Integration

For CI/CD pipelines, you can set environment variables directly in the pipeline configuration, and they will take precedence over any values in the `.env` file.

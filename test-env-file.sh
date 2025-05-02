#!/bin/bash
# filepath: /Users/jacobspoelstra/git/chat-ui/test-env-file.sh
# Test .env file loading and environment variable override in the Makefile

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Testing .env file support in Makefile...${NC}"

# Check if .env file exists
if [ -f .env ]; then
  echo -e "${YELLOW}Found existing .env file: $(cat .env | wc -l) lines${NC}"
else
  echo -e "${YELLOW}Creating a test .env file...${NC}"
  cat > .env <<EOL
# Test environment configuration
ACR_NAME=test-acr
RESOURCE_GROUP=test-rg
CONTAINER_APP_ENV=test-env
CONTAINER_APP_NAME=test-chat-ui
IMAGE_NAME=test-chat-ui
IMAGE_TAG=test-tag
WS_URI=wss://test.example.com/websocket
LOCATION=westus2
EOL
  echo -e "${GREEN}Created test .env file${NC}"
fi

# 1. Show the configuration loaded from .env
echo -e "\n${YELLOW}1. Configuration loaded from .env file:${NC}"
make show-config

# 2. Test overriding with environment variables
echo -e "\n${YELLOW}2. Testing environment variable override:${NC}"
echo -e "${YELLOW}   Running with IMAGE_TAG=override-tag${NC}"

IMAGE_TAG=override-tag make show-config

# 3. Test fully manual setting (no .env)
echo -e "\n${YELLOW}3. Testing manual override by renaming .env temporarily:${NC}"
if [ -f .env ]; then
  mv .env .env.bak
  echo -e "${YELLOW}   .env file temporarily renamed to .env.bak${NC}"
  
  echo -e "${YELLOW}   Running with default values:${NC}"
  make show-config
  
  echo -e "${YELLOW}   Running with custom values:${NC}"
  IMAGE_NAME=manual-test IMAGE_TAG=v1.0 make show-config
  
  # Restore .env
  mv .env.bak .env
  echo -e "${YELLOW}   .env file restored${NC}"
else
  echo -e "${RED}   No .env file found to temporarily rename${NC}"
fi

echo -e "\n${GREEN}All tests completed successfully.${NC}"

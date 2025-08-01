#!/bin/bash
# filepath: /Users/jacobspoelstra/git/chat-ui/test-ui.sh
# Script to test the Chat UI in VSCode Simple Browser

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}    Chat UI Testing Script       ${NC}"
echo -e "${BLUE}=================================${NC}"

# Check if the app is already running
if lsof -i :5173 &>/dev/null; then
  echo -e "${YELLOW}A process is already running on port 5173${NC}"
  echo -e "${YELLOW}Do you want to kill it and restart? (y/n)${NC}"
  read -r response
  if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${RED}Killing existing process on port 5173...${NC}"
    kill $(lsof -t -i:5173) 2>/dev/null
  else
    echo -e "${GREEN}Using the existing server on port 5173${NC}"
  fi
fi

# Source .env file if it exists
if [ -f .env ]; then
  echo -e "${GREEN}Loading environment from .env file${NC}"
  export $(grep -v '^#' .env | xargs)
  echo -e "${GREEN}Using WebSocket URI: $WS_URI${NC}"
fi

# Start the development server in the background
echo -e "${YELLOW}Starting development server...${NC}"
npm run dev &
SERVER_PID=$!

# Wait for the server to start
echo -e "${YELLOW}Waiting for server to start...${NC}"
sleep 3

# Open in VSCode Simple Browser
echo -e "${GREEN}Opening in VSCode Simple Browser...${NC}"
code --open-url "http://localhost:5173"

# Instructions
echo -e "\n${BLUE}=================================${NC}"
echo -e "${GREEN}Chat UI is now running!${NC}"
echo -e "${YELLOW}• Press Ctrl+C to stop the server when done${NC}"
echo -e "${YELLOW}• WebSocket is configured to connect to: ${WS_URI:-ws://localhost:501}${NC}"
echo -e "${BLUE}=================================${NC}"

# Wait for user to press Ctrl+C
trap "kill $SERVER_PID 2>/dev/null; echo -e '\n${RED}Shutting down server...${NC}'; exit 0" INT
wait $SERVER_PID

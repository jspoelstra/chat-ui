#!/bin/sh

# This script runs at container startup to update the config with environment variables

# Function to log messages with timestamp
log() {
  echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1"
}

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

log "Starting Chat UI container..."
log "Container platform: $(uname -s)/$(uname -m)"

# Get the WebSocket URI from environment or use default
# You must set this to your actual backend WebSocket server
WS_URI=${WS_URI:-ws://localhost:501}

# Detect Azure Container Apps environment
if [ -n "$CONTAINER_APP_NAME" ] || [ -n "$WEBSITES_CONTAINER_START_TIME_LIMIT" ]; then
  log "Azure Container Apps environment detected"
  # In Azure, we might want more secure defaults
  if [ "$WS_URI" = "ws://localhost:501" ]; then
    log "WARNING: Using default WebSocket URI in Azure environment"
  fi
fi

# Validate WebSocket URI
if ! validate_ws_uri "$WS_URI"; then
  log "Warning: The WebSocket URI '$WS_URI' may not be valid. It should start with ws:// or wss://"
  log "The application might not function correctly!"
else
  log "WebSocket URI validated successfully"
fi

# Update the configuration file
CONFIG_FILE="/usr/share/nginx/html/config.js"
echo "window.RUNTIME_CONFIG = { WS_URI: '$WS_URI' };" > "$CONFIG_FILE"

if [ -f "$CONFIG_FILE" ]; then
  log "Runtime configuration updated successfully with WS_URI: $WS_URI"
else
  log "ERROR: Failed to write configuration file at $CONFIG_FILE"
  exit 1
fi

# Check if Nginx configuration exists
if [ ! -f "/etc/nginx/conf.d/default.conf" ]; then
  log "ERROR: Nginx configuration not found"
  exit 1
fi

log "Starting Nginx server..."
# Start Nginx
nginx -g 'daemon off;'

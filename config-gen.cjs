/**
 * Runtime Configuration Generator
 * 
 * This CommonJS script injects runtime environment variables into the application.
 * It creates a config.js file in the public directory to expose configuration
 * to the client at runtime.
 * 
 * Usage:
 * - During build time: `node config-gen.cjs`
 * - Environment variables:
 *   - WS_URI: WebSocket URI for backend connections (default: ws://localhost:501)
 * 
 * Note: This script is intentionally in CommonJS format (.cjs) to avoid ES module
 * compatibility issues when running in Docker or other environments.
 */

const fs = require('fs');
const path = require('path');

// Validate WebSocket URI format
function validateWebSocketUri(uri) {
  if (!uri) return false;
  
  try {
    const url = new URL(uri);
    return url.protocol === 'ws:' || url.protocol === 'wss:';
  } catch (e) {
    return false;
  }
}

// Get WebSocket URI from environment or use default
// This should be set to point to your backend WebSocket server
const wsUri = process.env.WS_URI || 'ws://localhost:501';

// Validate the URI and warn if it doesn't look right
if (!validateWebSocketUri(wsUri)) {
  console.warn(`Warning: The WebSocket URI '${wsUri}' may not be valid. It should start with ws:// or wss://`);
}

// Default configuration that can be overridden by environment variables
const defaultConfig = {
  WS_URI: wsUri
};

// Create a config file in the public directory
fs.writeFileSync(
  path.join(__dirname, 'public', 'config.js'),
  `window.RUNTIME_CONFIG = ${JSON.stringify(defaultConfig, null, 2)};`
);

console.log('Runtime configuration file generated with:');
console.log('- WS_URI:', defaultConfig.WS_URI);

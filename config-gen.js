// This script will be used to inject runtime environment variables into the app
// Create a file in the public directory to expose configuration to the client at runtime

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default configuration that can be overridden by environment variables
const defaultConfig = {
  WS_URI: process.env.WS_URI || 'ws://localhost:501'
};

// Create a config file in the public directory
fs.writeFileSync(
  path.join(__dirname, 'public', 'config.js'),
  `window.RUNTIME_CONFIG = ${JSON.stringify(defaultConfig, null, 2)};`
);

console.log('Runtime configuration file generated with WS_URI:', defaultConfig.WS_URI);

// This file provides access to runtime configuration that can be overridden by environment variables
// The configuration is injected at runtime by the Docker container's startup script

// Default values
const DEFAULT_WS_URI = 'ws://localhost:501';

/**
 * Get the WebSocket URI from runtime configuration or use the default
 * @returns The WebSocket URI to use for connections
 */
export function getWebSocketUri(): string {
  // Check if runtime config is available (injected by Docker)
  if (window.RUNTIME_CONFIG?.WS_URI) {
    return window.RUNTIME_CONFIG.WS_URI;
  }
  
  return DEFAULT_WS_URI;
}

/**
 * Safely constructs a WebSocket URI with the specified endpoint
 * @param baseUri The base WebSocket URI
 * @param endpoint The endpoint to append
 * @returns A properly formatted WebSocket URI
 */
export function constructWebSocketUri(baseUri: string, endpoint: string): string {
  try {
    const url = new URL(baseUri);
    // Ensure endpoint starts with a slash
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${url.protocol}//${url.host}${formattedEndpoint}`;
  } catch (e) {
    console.error('Invalid WebSocket URI:', baseUri);
    // Fallback to simple string concatenation
    const separator = baseUri.endsWith('/') ? '' : '/';
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    return `${baseUri}${separator}${cleanEndpoint}`;
  }
}

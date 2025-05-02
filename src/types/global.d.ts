// Global type definitions for runtime configuration

interface RuntimeConfig {
  WS_URI: string;
  // Add any future runtime configuration properties here
}

// Extend the Window interface to include our runtime configuration
declare global {
  interface Window {
    RUNTIME_CONFIG?: RuntimeConfig;
  }
}

export {};

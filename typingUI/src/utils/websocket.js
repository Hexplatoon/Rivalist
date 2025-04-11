// WebSocket utility for typing test results

// Debug mode for verbose logging
const DEBUG = true;

// WebSocket URL configuration with fallbacks
const getWebSocketUrl = () => {
  // Try to get from environment variables
  const envUrl = import.meta.env.VITE_WS_URL;
  
  // Check if we're running on localhost or development environment
  const isDev = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1';
  
  // Common WebSocket endpoints based on Spring Boot WebSocket configurations
  const commonEndpoints = [
    '/ws',               // Common WebSocket endpoint
    '/websocket',        // Alternative endpoint
    '/socket',           // Alternative endpoint
    '/


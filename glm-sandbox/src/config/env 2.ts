/**
 * Environment configuration
 * Centralized configuration for environment variables
 */

export const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    chatUrl: import.meta.env.VITE_CHAT_API_URL || '/api/chat',
  },
  
  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'GLM Learning Sandbox',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  
  // Development Configuration
  dev: {
    mode: import.meta.env.VITE_DEV_MODE === 'true',
    debug: import.meta.env.VITE_DEBUG_MODE === 'true',
  },
  
  // PWA Configuration
  pwa: {
    name: import.meta.env.VITE_PWA_NAME || 'GLM Sandbox',
    shortName: import.meta.env.VITE_PWA_SHORT_NAME || 'GLM',
    description: import.meta.env.VITE_PWA_DESCRIPTION || 'Interactive tool for learning Generalized Linear Models',
  },
} as const

export type Config = typeof config

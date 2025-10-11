
export const config = {
  api: {
    baseUrl: (import.meta as any).env?.VITE_API_BASE_URL || '/api',
    chatUrl: (import.meta as any).env?.VITE_CHAT_API_URL || '/api/chat',
  },
  
  app: {
    name: (import.meta as any).env?.VITE_APP_NAME || 'GLM Learning Sandbox',
    version: (import.meta as any).env?.VITE_APP_VERSION || '1.0.0',
  },
  
  dev: {
    mode: (import.meta as any).env?.VITE_DEV_MODE === 'true',
    debug: (import.meta as any).env?.VITE_DEBUG_MODE === 'true',
  },
  
  pwa: {
    name: (import.meta as any).env?.VITE_PWA_NAME || 'GLM Sandbox',
    shortName: (import.meta as any).env?.VITE_PWA_SHORT_NAME || 'GLM',
    description: (import.meta as any).env?.VITE_PWA_DESCRIPTION || 'Interactive tool for learning Generalized Linear Models',
  },
} as const

export type Config = typeof config

// Configuración de las URLs de API
export const ENV = {
  IS_DEVELOPMENT: import.meta.env.DEV,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  WEBHOOK_LOGIN: import.meta.env.VITE_WEBHOOK_LOGIN,
  WEBHOOK_IMAGE_GENERATION: import.meta.env.VITE_WEBHOOK_IMAGE_GENERATION,
  WEBHOOK_VIDEO_GENERATION: import.meta.env.VITE_WEBHOOK_VIDEO_GENERATION,
  WEBHOOK_AVATAR_VIDEO_GENERATION: import.meta.env.VITE_WEBHOOK_AVATAR_VIDEO_GENERATION,
  WEBHOOK_SYNTHESIA_VIDEO_GENERATION: import.meta.env.VITE_WEBHOOK_SYNTHESIA_VIDEO_GENERATION,
  WEBHOOK_CHAT: import.meta.env.VITE_WEBHOOK_CHAT,
  DEV_PROXY_TARGET: import.meta.env.VITE_DEV_PROXY_TARGET,
  DEBUG: import.meta.env.VITE_DEBUG === 'true',
} as const;

// Configuración base - para desarrollo usamos el proxy de Vite
// En producción, usamos la URL completa
const getBaseUrl = () => {
  if (import.meta.env.MODE === 'development') {
    return '/api'; // Usa el proxy en desarrollo
  }
  return ENV.API_BASE_URL || 'https://n8n.icc-e.org'; // URL completa en producción
};

export const API_BASE_URL = getBaseUrl();

export const API_CONFIG = {
  // Usar proxy en desarrollo, URL directa en producción
  BASE_URL: API_BASE_URL,
  
  // Configuración de CORS
  CORS_CONFIG: {
    mode: 'cors' as const,
    credentials: 'omit' as const,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  },

  // Endpoints de la API
  ENDPOINTS: {
    // Endpoint de autenticación
    LOGIN: ENV.WEBHOOK_LOGIN || '/webhook-test/login',

    // Endpoint para el chat - usa el mismo endpoint en ambos entornos
    // La diferencia está en la URL base (API_BASE_URL)
    CHAT: ENV.WEBHOOK_CHAT || '/webhook/8585afbe-52ba-44e2-b000-6d4028b1b250',

    // Endpoint para generación de imágenes
    IMAGE_GENERATION: ENV.WEBHOOK_IMAGE_GENERATION || '/webhook/607039ee-6cd4-4a8f-a344-b419521a2067',

    // Endpoint para generación de videos
    VIDEO_GENERATION: ENV.WEBHOOK_VIDEO_GENERATION || '/webhook/44f0bb9d-0331-4f86-a741-617ea1121769',

    // Endpoint para generación de videos con avatar
    AVATAR_VIDEO_GENERATION: ENV.WEBHOOK_AVATAR_VIDEO_GENERATION || '/webhook/7049ac67-d242-4c7d-86d0-6e8d0038b8dd',

    // Endpoint para generación de videos con Synthesia
    SYNTHESIA_VIDEO_GENERATION: ENV.WEBHOOK_SYNTHESIA_VIDEO_GENERATION || '/webhook-test/d5a0a76f-fd93-4624-bf1f-6d4c760bfb62',
  },
  
  // Tiempo máximo de espera para las peticiones (en ms)
  TIMEOUT: 15000,

  // Método para construir URLs completas
  getFullUrl: (endpoint: string): string => {
    // Si el endpoint ya es una URL completa, devolverla tal cual
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      if (ENV.DEBUG) {
        console.log('Usando URL completa del endpoint:', endpoint);
      }
      return endpoint;
    }

    // Para desarrollo, usar el proxy de Vite
    if (import.meta.env.MODE === 'development') {
      const proxyUrl = `/api${endpoint}`;
      if (ENV.DEBUG) {
        console.log('Usando proxy en desarrollo:', proxyUrl);
      }
      return proxyUrl;
    }

    // Para producción, construir URL completa
    const baseUrl = API_BASE_URL.endsWith('/')
      ? API_BASE_URL.slice(0, -1)
      : API_BASE_URL;

    const normalizedEndpoint = endpoint.startsWith('/')
      ? endpoint
      : `/${endpoint}`;

    const fullUrl = `${baseUrl}${normalizedEndpoint}`;

    if (ENV.DEBUG) {
      console.log('Construyendo URL completa para producción:', { baseUrl, endpoint, normalizedEndpoint, fullUrl });
    }

    return fullUrl;
  }
};

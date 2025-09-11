// Configuración de las URLs de API
export const ENV = {
  IS_DEVELOPMENT: import.meta.env.DEV,
  // Agrega más variables de entorno según sea necesario
} as const;

// Configuración base - para desarrollo usamos el proxy de Vite
// En producción, usamos la URL completa
const getBaseUrl = () => {
  if (import.meta.env.MODE === 'development') {
    return '/api'; // Usa el proxy en desarrollo
  }
  return 'https://n8n.icc-e.org'; // URL completa en producción
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
    LOGIN: '/webhook/login',
    
    // Endpoint para el chat - usa el mismo endpoint en ambos entornos
    // La diferencia está en la URL base (API_BASE_URL)
    CHAT: '/webhook/8585afbe-52ba-44e2-b000-6d4028b1b250',
  },
  
  // Tiempo máximo de espera para las peticiones (en ms)
  TIMEOUT: 15000,

  // Método para construir URLs completas
  getFullUrl: (endpoint: string): string => {
    // Asegurarse de que no haya dobles barras en la URL
    const baseUrl = API_BASE_URL.endsWith('/') 
      ? API_BASE_URL.slice(0, -1) 
      : API_BASE_URL;
    
    const normalizedEndpoint = endpoint.startsWith('/') 
      ? endpoint 
      : `/${endpoint}`;
    
    return `${baseUrl}${normalizedEndpoint}`;
  }
};

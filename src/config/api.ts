// Configuración de las URLs de la API
export const API_CONFIG = {
  // URL de producción
  BASE_URL: 'https://n8n.icc-e.org/webhook',
  
  // Para desarrollo local o pruebas
  // BASE_URL: 'https://n8n.icc-e.org/webhook-test',
  
  ENDPOINTS: {
    LOGIN: '/login',
    // Agregar más endpoints según sea necesario
  },
  // Tiempo máximo de espera para las peticiones (en ms)
  TIMEOUT: 10000,
};

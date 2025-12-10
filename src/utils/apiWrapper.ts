import { API_CONFIG } from '../config/api';
import { withRetry, fetchWithTimeout } from './retryUtils';
import { errorLogger } from './errorLogger';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
  serviceName: string,
  userId?: string
): Promise<ApiResponse<T>> {
  const url = API_CONFIG.getFullUrl(endpoint);

  try {
    const response = await withRetry(
      () => fetchWithTimeout(url, {
        ...API_CONFIG.CORS_CONFIG,
        ...options,
        headers: {
          ...API_CONFIG.CORS_CONFIG.headers,
          ...options.headers,
        },
      }, API_CONFIG.TIMEOUT),
      {
        maxRetries: 3,
        baseDelay: 1000,
        retryCondition: (error) => {
          // Retry on network errors, timeouts, and server errors
          if (error.message?.includes('timeout')) return true;
          if (error.message?.includes('fetch')) return true;
          if (typeof error.status === 'number' && error.status >= 500) return true;
          return false;
        }
      }
    );

    if (response.ok) {
      try {
        const data = await response.json();
        return { success: true, data, statusCode: response.status };
      } catch (parseError) {
        // If response is not JSON, return success with text
        const text = await response.text();
        return { success: true, data: text as T, statusCode: response.status };
      }
    } else {
      const errorText = await response.text();
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      (error as any).status = response.status;
      (error as any).details = errorText;

      // Always log the error to trigger global notification
      errorLogger.logError(serviceName, error, { url, options, responseText: errorText }, userId);

      return {
        success: false,
        error: getUserFriendlyErrorMessage(response.status, serviceName),
        statusCode: response.status
      };
    }
  } catch (error) {
    // Always log the error to trigger global notification
    errorLogger.logError(serviceName, error, { url, options }, userId);

    return {
      success: false,
      error: getUserFriendlyErrorMessage(null, serviceName)
    };
  }
}

function getUserFriendlyErrorMessage(statusCode: number | null, serviceName: string): string {
  const serviceNames: Record<string, string> = {
    'video-generation': 'generación de vídeo',
    'avatar-video-generation': 'generación de vídeo con avatar',
    'synthesia-video-generation': 'generación de vídeo con Synthesia',
    'image-generation': 'generación de imágenes',
    'chat': 'chat',
  };

  const serviceDisplayName = serviceNames[serviceName] || serviceName;

  if (statusCode === null) {
    return `El servicio de ${serviceDisplayName} no está disponible temporalmente. Por favor, inténtalo de nuevo en unos minutos.`;
  }

  switch (statusCode) {
    case 400:
      return `Los datos proporcionados para ${serviceDisplayName} no son válidos. Por favor, revisa la información e inténtalo de nuevo.`;
    case 401:
      return `No tienes permisos para acceder al servicio de ${serviceDisplayName}.`;
    case 403:
      return `Acceso denegado al servicio de ${serviceDisplayName}.`;
    case 404:
      return `El servicio de ${serviceDisplayName} no se encuentra disponible.`;
    case 429:
      return `Demasiadas solicitudes al servicio de ${serviceDisplayName}. Por favor, espera un momento antes de intentar de nuevo.`;
    case 500:
    case 502:
    case 503:
    case 504:
      return `El servicio de ${serviceDisplayName} está temporalmente no disponible. Estamos trabajando para solucionarlo.`;
    default:
      return `Ha ocurrido un error inesperado en el servicio de ${serviceDisplayName}. Por favor, inténtalo de nuevo.`;
  }
}

// Convenience functions for specific services
export const videoGenerationApi = (options: RequestInit, userId?: string) =>
  apiRequest(API_CONFIG.ENDPOINTS.VIDEO_GENERATION, options, 'video-generation', userId);

export const avatarVideoGenerationApi = (options: RequestInit, userId?: string) =>
  apiRequest(API_CONFIG.ENDPOINTS.AVATAR_VIDEO_GENERATION, options, 'avatar-video-generation', userId);

export const synthesiaVideoGenerationApi = (options: RequestInit, userId?: string) =>
  apiRequest(API_CONFIG.ENDPOINTS.SYNTHESIA_VIDEO_GENERATION, options, 'synthesia-video-generation', userId);

export const imageGenerationApi = (options: RequestInit, userId?: string) =>
  apiRequest(API_CONFIG.ENDPOINTS.IMAGE_GENERATION, options, 'image-generation', userId);

export const chatApi = (options: RequestInit, userId?: string) =>
  apiRequest(API_CONFIG.ENDPOINTS.CHAT, options, 'chat', userId);
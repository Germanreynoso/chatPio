import { useState, useCallback } from 'react';
import { errorLogger } from '../utils/errorLogger';

interface ErrorState {
  hasError: boolean;
  message: string;
  details?: any;
}

export const useErrorHandler = (serviceName: string, userId?: string) => {
  const [error, setError] = useState<ErrorState>({ hasError: false, message: '' });
  const [isRetrying, setIsRetrying] = useState(false);

  const handleError = useCallback((error: any, context?: any) => {
    // Log the error
    errorLogger.logError(serviceName, error, context, userId);

    // Set user-friendly error message
    const userMessage = getUserFriendlyErrorMessage(error, serviceName);
    setError({
      hasError: true,
      message: userMessage,
      details: context
    });
  }, [serviceName, userId]);

  const clearError = useCallback(() => {
    setError({ hasError: false, message: '' });
  }, []);

  const retryOperation = useCallback(async (operation: () => Promise<any>) => {
    setIsRetrying(true);
    clearError();

    try {
      const result = await operation();
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsRetrying(false);
    }
  }, [handleError, clearError]);

  return {
    error,
    isRetrying,
    handleError,
    clearError,
    retryOperation
  };
};

function getUserFriendlyErrorMessage(error: any, serviceName: string): string {
  const serviceNames: Record<string, string> = {
    'video-generation': 'generación de vídeo',
    'avatar-video-generation': 'generación de vídeo con avatar',
    'synthesia-video-generation': 'generación de vídeo con Synthesia',
    'image-generation': 'generación de imágenes',
    'chat': 'chat',
  };

  const serviceDisplayName = serviceNames[serviceName] || serviceName;

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes('timeout') || error.message.includes('Timeout')) {
      return `El servicio de ${serviceDisplayName} está tardando más de lo esperado. Por favor, inténtalo de nuevo.`;
    }

    if (error.message.includes('fetch') || error.message.includes('network')) {
      return `No se pudo conectar al servicio de ${serviceDisplayName}. Verifica tu conexión a internet e inténtalo de nuevo.`;
    }

    if ((error as any).status) {
      const status = (error as any).status;
      switch (status) {
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
          return `Ha ocurrido un error en el servicio de ${serviceDisplayName}. Por favor, inténtalo de nuevo.`;
      }
    }

    // Generic error
    return `Ha ocurrido un error inesperado en ${serviceDisplayName}. Por favor, inténtalo de nuevo.`;
  }

  return `Ha ocurrido un error desconocido en ${serviceDisplayName}. Por favor, inténtalo de nuevo.`;
}
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { errorLogger } from '../utils/errorLogger';

export type ServiceStatus = 'operational' | 'degraded' | 'down';

export interface ServiceInfo {
  status: ServiceStatus;
  lastError?: string;
  lastChecked: string;
}

export interface ServiceStatusState {
  [serviceName: string]: ServiceInfo;
}

interface ServiceStatusContextType {
  serviceStatus: ServiceStatusState;
  refreshStatus: () => void;
  isLoading: boolean;
}

const ServiceStatusContext = createContext<ServiceStatusContextType | undefined>(undefined);

interface ServiceStatusProviderProps {
  children: ReactNode;
}

export const ServiceStatusProvider: React.FC<ServiceStatusProviderProps> = ({ children }) => {
  const [serviceStatus, setServiceStatus] = useState<ServiceStatusState>({});
  const [isLoading, setIsLoading] = useState(false);

  const refreshStatus = () => {
    setIsLoading(true);
    try {
      const status = errorLogger.getServiceStatus();
      const updatedStatus: ServiceStatusState = {};

      Object.entries(status).forEach(([service, info]) => {
        updatedStatus[service] = {
          ...info,
          lastChecked: new Date().toISOString()
        };
      });

      setServiceStatus(updatedStatus);
    } catch (error) {
      console.error('Error refreshing service status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    refreshStatus();

    // Refresh every 5 minutes
    const interval = setInterval(refreshStatus, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const value: ServiceStatusContextType = {
    serviceStatus,
    refreshStatus,
    isLoading
  };

  return (
    <ServiceStatusContext.Provider value={value}>
      {children}
    </ServiceStatusContext.Provider>
  );
};

export const useServiceStatus = (): ServiceStatusContextType => {
  const context = useContext(ServiceStatusContext);
  if (context === undefined) {
    throw new Error('useServiceStatus must be used within a ServiceStatusProvider');
  }
  return context;
};

// Helper functions
export const getOverallStatus = (status: ServiceStatusState): ServiceStatus => {
  const statuses = Object.values(status).map(s => s.status);

  if (statuses.includes('down')) return 'down';
  if (statuses.includes('degraded')) return 'degraded';
  return 'operational';
};

export const getStatusColor = (status: ServiceStatus): string => {
  switch (status) {
    case 'operational':
      return 'text-green-600';
    case 'degraded':
      return 'text-yellow-600';
    case 'down':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

export const getStatusIcon = (status: ServiceStatus): string => {
  switch (status) {
    case 'operational':
      return '✅';
    case 'degraded':
      return '⚠️';
    case 'down':
      return '❌';
    default:
      return '❓';
  }
};

export const getServiceDisplayName = (service: string): string => {
  const names: Record<string, string> = {
    'video-generation': 'Generación de Vídeo',
    'avatar-video-generation': 'Vídeo con Avatar',
    'synthesia-video-generation': 'Vídeo con Synthesia',
    'image-generation': 'Generación de Imágenes',
    'chat': 'Chat'
  };

  return names[service] || service;
};
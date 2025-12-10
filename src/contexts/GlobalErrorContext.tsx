import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { setGlobalErrorNotifier } from '../utils/errorLogger';

interface GlobalErrorContextType {
  showError: (message?: string) => void;
  hideError: () => void;
  isErrorVisible: boolean;
  errorMessage: string;
}

const GlobalErrorContext = createContext<GlobalErrorContextType | undefined>(undefined);

interface GlobalErrorProviderProps {
  children: ReactNode;
}

export const GlobalErrorProvider: React.FC<GlobalErrorProviderProps> = ({ children }) => {
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Servicio momentáneamente no disponible");

  const showError = (message: string = "Servicio momentáneamente no disponible") => {
    setErrorMessage(message);
    setIsErrorVisible(true);
  };

  const hideError = () => {
    setIsErrorVisible(false);
  };

  // Register the global error callback when the provider mounts
  useEffect(() => {
    setGlobalErrorNotifier(showError);
  }, []);

  const value: GlobalErrorContextType = {
    showError,
    hideError,
    isErrorVisible,
    errorMessage
  };

  return (
    <GlobalErrorContext.Provider value={value}>
      {children}
    </GlobalErrorContext.Provider>
  );
};

export const useGlobalError = (): GlobalErrorContextType => {
  const context = useContext(GlobalErrorContext);
  if (context === undefined) {
    throw new Error('useGlobalError must be used within a GlobalErrorProvider');
  }
  return context;
};
import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ErrorNotificationProps {
  message?: string;
  isVisible: boolean;
  onClose: () => void;
  autoHideDelay?: number;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  message = "Servicio momentáneamente no disponible",
  isVisible,
  onClose,
  autoHideDelay = 5000
}) => {
  useEffect(() => {
    if (isVisible && autoHideDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, autoHideDelay]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-xl max-w-md w-full">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-base font-medium text-red-800 text-center">
              {message}
            </p>
          </div>
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className="inline-flex rounded-md bg-red-50 p-1.5 text-red-400 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorNotification;
import React from 'react';
import { RefreshCw, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { useServiceStatus, getOverallStatus, getStatusColor, getStatusIcon, getServiceDisplayName } from '../contexts/ServiceStatusContext';

const ServiceStatusPage: React.FC = () => {
  const { serviceStatus, refreshStatus, isLoading } = useServiceStatus();

  const overallStatus = getOverallStatus(serviceStatus);

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'operational':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'degraded':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'down':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusIconComponent = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'down':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Estado de los Servicios</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Estado actual de todos los servicios del sistema
                </p>
              </div>
              <button
                onClick={refreshStatus}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>
          </div>

          <div className="px-6 py-4">
            {/* Overall Status */}
            <div className="mb-6">
              <div className="flex items-center">
                {getStatusIconComponent(overallStatus)}
                <span className="ml-2 text-lg font-medium text-gray-900">
                  Estado General: {getServiceDisplayName(overallStatus)}
                </span>
                <span className={`ml-2 ${getStatusBadge(overallStatus)}`}>
                  {overallStatus === 'operational' ? 'Todos los servicios operativos' :
                   overallStatus === 'degraded' ? 'Algunos servicios con problemas' :
                   'Servicios críticos afectados'}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Última actualización: {new Date().toLocaleString('es-ES')}
              </p>
            </div>

            {/* Service List */}
            <div className="space-y-4">
              {Object.entries(serviceStatus).map(([service, info]) => (
                <div key={service} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatusIconComponent(info.status)}
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">
                          {getServiceDisplayName(service)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Estado: {getServiceDisplayName(info.status)}
                        </p>
                      </div>
                    </div>
                    <span className={getStatusBadge(info.status)}>
                      {info.status}
                    </span>
                  </div>

                  {info.lastError && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-800">
                        <strong>Último error:</strong> {info.lastError}
                      </p>
                    </div>
                  )}

                  <div className="mt-2 text-xs text-gray-500">
                    Última verificación: {new Date(info.lastChecked).toLocaleString('es-ES')}
                  </div>
                </div>
              ))}

              {Object.keys(serviceStatus).length === 0 && (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Cargando estado de servicios</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Espera un momento mientras obtenemos la información...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <p>
                <strong>¿Problemas con un servicio?</strong> Si un servicio aparece como "afectado" o "no disponible",
                nuestros equipos técnicos ya han sido notificados automáticamente. Te recomendamos intentar de nuevo
                en unos minutos.
              </p>
              <p className="mt-2">
                Para soporte técnico, contacta al administrador del sistema.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceStatusPage;
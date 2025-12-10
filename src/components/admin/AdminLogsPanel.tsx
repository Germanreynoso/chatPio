import React, { useState, useEffect } from 'react';
import { Search, Download, Trash2, AlertTriangle, Info, XCircle, RefreshCw } from 'lucide-react';
import { errorLogger } from '../../utils/errorLogger';

interface LogEntry {
  timestamp: string;
  service: string;
  error: string;
  details?: any;
  userId?: string;
  retryCount?: number;
}

const AdminLogsPanel: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  const services = ['all', 'video-generation', 'avatar-video-generation', 'synthesia-video-generation', 'image-generation', 'chat'];

  const loadLogs = () => {
    setIsLoading(true);
    try {
      const allLogs = errorLogger.getLogs();
      setLogs(allLogs);
      setFilteredLogs(allLogs);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    let filtered = logs;

    // Filter by service
    if (selectedService !== 'all') {
      filtered = filtered.filter(log => log.service === selectedService);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.error.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.userId && log.userId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredLogs(filtered);
  }, [logs, selectedService, searchTerm]);

  const getServiceDisplayName = (service: string): string => {
    const names: Record<string, string> = {
      'video-generation': 'Generación de Vídeo',
      'avatar-video-generation': 'Vídeo con Avatar',
      'synthesia-video-generation': 'Vídeo con Synthesia',
      'image-generation': 'Generación de Imágenes',
      'chat': 'Chat'
    };
    return names[service] || service;
  };

  const getLogIcon = (service: string) => {
    if (service.includes('video') || service.includes('image')) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `logs_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const clearLogs = (service?: string) => {
    if (window.confirm(service ? `¿Eliminar todos los logs de ${getServiceDisplayName(service)}?` : '¿Eliminar todos los logs?')) {
      errorLogger.clearLogs(service);
      loadLogs();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Logs de Error</h2>
            <p className="mt-1 text-sm text-gray-600">
              Historial de errores del sistema para diagnóstico
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={loadLogs}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            <button
              onClick={exportLogs}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </button>
            <button
              onClick={() => clearLogs()}
              className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpiar Todo
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar en logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 w-full"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {services.map(service => (
                <option key={service} value={service}>
                  {service === 'all' ? 'Todos los servicios' : getServiceDisplayName(service)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <Info className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay logs</h3>
            <p className="mt-1 text-sm text-gray-500">
              {logs.length === 0 ? 'No se han registrado errores aún.' : 'No se encontraron logs con los filtros aplicados.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredLogs.map((log, index) => (
              <div key={index} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {getLogIcon(log.service)}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {getServiceDisplayName(log.service)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatTimestamp(log.timestamp)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{log.error}</p>
                    {log.userId && (
                      <p className="mt-1 text-xs text-gray-500">Usuario: {log.userId}</p>
                    )}
                    {log.retryCount && log.retryCount > 0 && (
                      <p className="mt-1 text-xs text-orange-600">Reintentos: {log.retryCount}</p>
                    )}
                    {log.details && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                          Detalles técnicos
                        </summary>
                        <pre className="mt-1 text-xs text-gray-600 bg-gray-100 p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Mostrando {filteredLogs.length} de {logs.length} logs
        </p>
      </div>
    </div>
  );
};

export default AdminLogsPanel;
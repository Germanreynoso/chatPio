import React, { useState, useEffect, useRef } from 'react';
import { X, Eye, History, Calendar, User, Tag, FileText, ChevronDown } from 'lucide-react';
import { versionHistoryService } from '../services/versionHistoryService';
import type { ContentVersion, VersionStatus } from '../types/versionHistory';

type RecentContentType = {
  id: string;
  area: string;
  format: string;
  topic: string;
  time: string;
  contentId?: string;
  description?: string;
};

interface ContentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: RecentContentType;
}

const ContentDetailsModal: React.FC<ContentDetailsModalProps> = ({ isOpen, onClose, content }) => {
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<ContentVersion | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && content.contentId) {
      const contentVersions = versionHistoryService.getVersions(content.contentId);
      setVersions(contentVersions);
      if (contentVersions.length > 0) {
        setSelectedVersion(contentVersions[0]); // Mostrar la versión más reciente por defecto
      }
    }
  }, [isOpen, content]);

  // Verificar si hay contenido que se puede scrollear
  useEffect(() => {
    const checkScrollable = () => {
      if (contentRef.current) {
        const { scrollHeight, clientHeight } = contentRef.current;
        setShowScrollButton(scrollHeight > clientHeight);
      }
    };

    // Verificar después de un pequeño delay para asegurar que el contenido se haya renderizado
    const timeoutId = setTimeout(checkScrollable, 100);

    // También verificar cuando cambie la versión seleccionada
    checkScrollable();

    return () => clearTimeout(timeoutId);
  }, [selectedVersion, versions]);

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: VersionStatus) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: VersionStatus) => {
    switch (status) {
      case 'draft': return 'Borrador';
      case 'published': return 'Publicado';
      case 'archived': return 'Archivado';
      default: return 'Borrador';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Detalles del Contenido</h2>
            <p className="text-sm text-gray-600 mt-1">{content.topic}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Panel lateral fijo */}
          <div className="w-80 border-r bg-gray-50 p-6 overflow-y-auto">
            {/* Información general */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} />
                Información General
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Área:</span>
                  <p className="text-sm text-gray-900">{content.area}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Formato:</span>
                  <p className="text-sm text-gray-900">{content.format}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Tema:</span>
                  <p className="text-sm text-gray-900">{content.topic}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Creado:</span>
                  <p className="text-sm text-gray-900">{content.time}</p>
                </div>
                {content.contentId && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">ID de Contenido:</span>
                    <p className="text-xs text-gray-500 font-mono break-all">{content.contentId}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Versiones disponibles */}
            {versions.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <History size={20} />
                  Versiones ({versions.length})
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {versions.map((version) => (
                    <button
                      key={version.metadata.id}
                      onClick={() => setSelectedVersion(version)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedVersion?.metadata.id === version.metadata.id
                          ? 'bg-blue-100 border-blue-300'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Versión {version.metadata.versionNumber}
                          {version.metadata.isRefinement && (
                            <span className="text-blue-600 ml-1">(Refinada)</span>
                          )}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(version.metadata.status)}`}>
                          {getStatusText(version.metadata.status)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(version.metadata.createdAt)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contenido con scroll */}
          <div className="flex-1 relative">
            <div
              ref={contentRef}
              className="absolute inset-0 overflow-y-auto p-6"
            >
              {selectedVersion ? (
                <div className="max-w-4xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      Versión {selectedVersion.metadata.versionNumber}
                    </h3>
                    <span className={`px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(selectedVersion.metadata.status)}`}>
                      {getStatusText(selectedVersion.metadata.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-8 text-sm bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <User size={18} className="text-gray-400" />
                      <div>
                        <span className="font-medium text-gray-700">Usuario:</span>
                        <p className="text-gray-900">{selectedVersion.metadata.createdBy}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-gray-400" />
                      <div>
                        <span className="font-medium text-gray-700">Fecha:</span>
                        <p className="text-gray-900">{formatDate(selectedVersion.metadata.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Tag size={18} className="text-gray-400" />
                      <div>
                        <span className="font-medium text-gray-700">Área:</span>
                        <p className="text-gray-900">{selectedVersion.metadata.area}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-gray-400" />
                      <div>
                        <span className="font-medium text-gray-700">Formatos:</span>
                        <p className="text-gray-900">{selectedVersion.metadata.formats.join(', ')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {selectedVersion.content.map((item, index) => (
                      <div key={index} className="border rounded-lg p-6 bg-white shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-xl font-semibold text-blue-600">{item.title}</h4>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium">
                            {item.format}
                          </span>
                        </div>

                        {/* Audio player si existe */}
                        {item.audioUrl && (
                          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 text-lg">🎵</span>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">Audio disponible</div>
                                <div className="text-sm text-gray-600">Contenido con audio generado</div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className={`text-base text-gray-700 leading-relaxed whitespace-pre-line ${
                          item.format.toLowerCase().includes('nota de prensa') ? 'text-left' : ''
                        }`}>
                          {item.content}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Metadatos adicionales */}
                  {selectedVersion.formData && (
                    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                      <h4 className="text-xl font-semibold text-gray-900 mb-4">Datos del Formulario Original</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedVersion.formData.tema && (
                          <div className="bg-white p-4 rounded-lg border">
                            <span className="font-medium text-gray-700 block mb-2">Tema principal:</span>
                            <p className="text-gray-900">{selectedVersion.formData.tema}</p>
                          </div>
                        )}
                        {selectedVersion.formData.audiencia && (
                          <div className="bg-white p-4 rounded-lg border">
                            <span className="font-medium text-gray-700 block mb-2">Audiencia objetivo:</span>
                            <p className="text-gray-900">{selectedVersion.formData.audiencia}</p>
                          </div>
                        )}
                        {selectedVersion.formData.mensaje && (
                          <div className="md:col-span-2 bg-white p-4 rounded-lg border">
                            <span className="font-medium text-gray-700 block mb-2">Mensaje clave:</span>
                            <p className="text-gray-900">{selectedVersion.formData.mensaje}</p>
                          </div>
                        )}
                        {selectedVersion.formData.contexto && (
                          <div className="md:col-span-2 bg-white p-4 rounded-lg border">
                            <span className="font-medium text-gray-700 block mb-2">Contexto adicional:</span>
                            <p className="text-gray-900">{selectedVersion.formData.contexto}</p>
                          </div>
                        )}
                        {selectedVersion.metadata.wordCount && (
                          <div className="bg-white p-4 rounded-lg border">
                            <span className="font-medium text-gray-700 block mb-2">Cantidad de palabras:</span>
                            <p className="text-gray-900 text-lg font-semibold">{selectedVersion.metadata.wordCount}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="bg-gray-50 rounded-lg p-12 text-center max-w-md">
                    <FileText size={64} className="text-gray-400 mx-auto mb-6" />
                    <h3 className="text-xl font-medium text-gray-900 mb-3">
                      No hay versiones disponibles
                    </h3>
                    <p className="text-gray-600">
                      Este contenido no tiene versiones guardadas en el sistema de historial.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Botón flotante para scroll */}
            {showScrollButton && (
              <button
                onClick={scrollToBottom}
                className="absolute bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
                title="Desplazarse hacia abajo"
              >
                <ChevronDown size={24} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailsModal;
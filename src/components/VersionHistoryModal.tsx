import React, { useState, useEffect } from 'react';
import { X, Search, Download, Eye, RotateCcw, Filter, Calendar, User, Tag } from 'lucide-react';
import { versionHistoryService } from '../services/versionHistoryService';
import type { ContentVersion, VersionSearchFilters, VersionComparison, VersionStatus } from '../types/versionHistory';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId?: string;
}

const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({ isOpen, onClose, contentId }) => {
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [filteredVersions, setFilteredVersions] = useState<ContentVersion[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [comparison, setComparison] = useState<VersionComparison | null>(null);
  const [searchFilters, setSearchFilters] = useState<VersionSearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadVersions();
    }
  }, [isOpen, contentId]);

  useEffect(() => {
    applyFilters();
  }, [versions, searchFilters]);

  const loadVersions = () => {
    if (contentId) {
      const contentVersions = versionHistoryService.getVersions(contentId);
      setVersions(contentVersions);
    } else {
      // Load all versions if no specific contentId
      const allHistories = versionHistoryService.getAllHistories();
      const allVersions: ContentVersion[] = [];
      allHistories.forEach(history => {
        allVersions.push(...history.versions);
      });
      setVersions(allVersions);
    }
  };

  const applyFilters = () => {
    let filtered = [...versions];

    if (searchFilters.keyword) {
      const keyword = searchFilters.keyword.toLowerCase();
      filtered = filtered.filter(version =>
        version.content.some(c =>
          c.content.toLowerCase().includes(keyword) ||
          c.title.toLowerCase().includes(keyword)
        ) ||
        version.metadata.topic.toLowerCase().includes(keyword) ||
        version.metadata.area.toLowerCase().includes(keyword)
      );
    }

    if (searchFilters.dateFrom) {
      filtered = filtered.filter(v => new Date(v.metadata.createdAt) >= new Date(searchFilters.dateFrom!));
    }

    if (searchFilters.dateTo) {
      filtered = filtered.filter(v => new Date(v.metadata.createdAt) <= new Date(searchFilters.dateTo!));
    }

    if (searchFilters.area) {
      filtered = filtered.filter(v => v.metadata.area === searchFilters.area);
    }

    if (searchFilters.user) {
      filtered = filtered.filter(v => v.metadata.createdBy === searchFilters.user);
    }

    if (searchFilters.format) {
      filtered = filtered.filter(v => v.metadata.formats.includes(searchFilters.format!));
    }

    if (searchFilters.status) {
      filtered = filtered.filter(v => v.metadata.status === searchFilters.status);
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime());

    setFilteredVersions(filtered);
  };

  const handleVersionSelect = (versionId: string) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionId)) {
        return prev.filter(id => id !== versionId);
      } else if (prev.length < 2) {
        return [...prev, versionId];
      }
      return prev;
    });
  };

  const handleCompare = () => {
    if (selectedVersions.length === 2) {
      const version1 = versions.find(v => v.metadata.id === selectedVersions[0]);
      const version2 = versions.find(v => v.metadata.id === selectedVersions[1]);
      if (version1 && version2) {
        const comp = versionHistoryService.compareVersions(version1, version2);
        setComparison(comp);
        setShowComparison(true);
      }
    }
  };

  const handleRestore = (version: ContentVersion) => {
    // In a real implementation, this would restore the version
    alert(`Versión ${version.metadata.versionNumber} restaurada (simulación)`);
  };

  const handleStatusChange = (versionId: string, status: VersionStatus) => {
    if (contentId) {
      versionHistoryService.updateVersionStatus(contentId, versionId, status);
      loadVersions(); // Reload to reflect changes
    }
  };

  const handleExport = () => {
    // The exportToPDF function now handles the PDF generation and download directly
    versionHistoryService.exportToPDF(contentId || 'all');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            📚 Historial de Versiones
            {contentId && <span className="text-sm text-gray-500 ml-2">({contentId})</span>}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por palabra clave..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={searchFilters.keyword || ''}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, keyword: e.target.value }))}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter size={20} />
                Filtros
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download size={20} />
                Exportar
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha desde
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={searchFilters.dateFrom || ''}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha hasta
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={searchFilters.dateTo || ''}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Tag size={16} className="inline mr-1" />
                    Estado
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={searchFilters.status || ''}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, status: e.target.value as VersionStatus || undefined }))}
                  >
                    <option value="">Todos</option>
                    <option value="draft">Borrador</option>
                    <option value="published">Publicado</option>
                    <option value="archived">Archivado</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Compare Button */}
          {selectedVersions.length === 2 && (
            <div className="mb-4">
              <button
                onClick={handleCompare}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                🔍 Comparar versiones seleccionadas
              </button>
            </div>
          )}

          {/* Versions List */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredVersions.map((version) => (
              <div key={version.metadata.id} className="border rounded-lg p-4 bg-white">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedVersions.includes(version.metadata.id)}
                      onChange={() => handleVersionSelect(version.metadata.id)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Versión {version.metadata.versionNumber}
                        {version.metadata.isRefinement && <span className="text-sm text-blue-600 ml-2">(Refinada)</span>}
                      </h3>
                      <p className="text-sm text-gray-600">{version.metadata.topic}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(version.metadata.status)}`}>
                      {getStatusText(version.metadata.status)}
                    </span>
                    <select
                      value={version.metadata.status}
                      onChange={(e) => handleStatusChange(version.metadata.id, e.target.value as VersionStatus)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="draft">Borrador</option>
                      <option value="published">Publicado</option>
                      <option value="archived">Archivado</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                  <div>
                    <User size={14} className="inline mr-1" />
                    {version.metadata.createdBy}
                  </div>
                  <div>
                    <Calendar size={14} className="inline mr-1" />
                    {formatDate(version.metadata.createdAt)}
                  </div>
                  <div>
                    Área: {version.metadata.area}
                  </div>
                  <div>
                    Formatos: {version.metadata.formats.join(', ')}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRestore(version)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    <RotateCcw size={14} />
                    Restaurar
                  </button>
                  <button
                    onClick={() => {
                      // Show version details (could expand this)
                      alert(`Detalles de la versión ${version.metadata.versionNumber}:\n\n${version.content.map(c => `${c.title}:\n${c.content.substring(0, 200)}...`).join('\n\n')}`);
                    }}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    <Eye size={14} />
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredVersions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron versiones que coincidan con los filtros.
            </div>
          )}
        </div>

        {/* Comparison Modal */}
        {showComparison && comparison && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Comparación de Versiones</h3>
                <button
                  onClick={() => setShowComparison(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Cambios</h4>
                    <div className="space-y-2">
                      {comparison.differences.added.map((change, index) => (
                        <div key={index} className="text-green-700 text-sm">+ {change}</div>
                      ))}
                      {comparison.differences.removed.map((change, index) => (
                        <div key={index} className="text-red-700 text-sm">- {change}</div>
                      ))}
                      {comparison.differences.modified.map((change, index) => (
                        <div key={index} className="text-blue-700 text-sm">~ {change}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Versión {comparison.version1.metadata.versionNumber}</h4>
                    <div className="text-sm text-gray-600">
                      {formatDate(comparison.version1.metadata.createdAt)}
                    </div>
                    <div className="mt-2 text-sm">
                      {comparison.version1.content[0]?.content.substring(0, 200)}...
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Versión {comparison.version2.metadata.versionNumber}</h4>
                    <div className="text-sm text-gray-600">
                      {formatDate(comparison.version2.metadata.createdAt)}
                    </div>
                    <div className="mt-2 text-sm">
                      {comparison.version2.content[0]?.content.substring(0, 200)}...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VersionHistoryModal;
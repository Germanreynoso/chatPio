import React, { useState, useEffect } from 'react';
import { X, Copy, Lightbulb } from 'lucide-react';

interface Example {
  titulo: string;
  tema: string;
  mensaje: string;
  contexto: string;
  audiencia: string;
}

interface ExamplesModalProps {
  area: string;
  onClose: () => void;
  onCopyExample: (example: Example) => void;
}

const ExamplesModal: React.FC<ExamplesModalProps> = ({ area, onClose, onCopyExample }) => {
  const [examples, setExamples] = useState<Example[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar ejemplos desde el archivo JSON
    const loadExamples = async () => {
      try {
        const response = await fetch('/examples.json');
        const data = await response.json();
        setExamples(data[area] || []);
      } catch (error) {
        console.error('Error loading examples:', error);
        setExamples([]);
      } finally {
        setLoading(false);
      }
    };

    loadExamples();
  }, [area]);

  const handleCopyExample = (example: Example) => {
    onCopyExample(example);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-w-2xl w-full bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Lightbulb className="text-yellow-500" />
                Ejemplos para: {area}
              </h2>
              <p className="text-gray-600 mt-1">
                Selecciona un ejemplo para precargar el formulario
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-udlp-yellow mx-auto"></div>
              <p className="text-gray-600 mt-2">Cargando ejemplos...</p>
            </div>
          ) : examples.length === 0 ? (
            <div className="text-center py-8">
              <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay ejemplos disponibles para esta área.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {examples.map((example, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-yellow-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {example.titulo}
                    </h3>
                    <button
                      onClick={() => handleCopyExample(example)}
                      className="flex items-center gap-2 bg-udlp-yellow text-udlp-dark px-3 py-2 rounded-lg hover:bg-yellow-400 transition-colors text-sm font-medium"
                    >
                      <Copy className="w-4 h-4" />
                      Copiar este ejemplo
                    </button>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Tema:</span>
                      <p className="text-gray-600 mt-1">{example.tema}</p>
                    </div>

                    <div>
                      <span className="font-medium text-gray-700">Mensaje clave:</span>
                      <p className="text-gray-600 mt-1">{example.mensaje}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <span className="font-medium text-gray-700">Contexto:</span>
                        <p className="text-gray-600 mt-1 text-xs">{example.contexto}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Audiencia:</span>
                        <p className="text-gray-600 mt-1 text-xs">{example.audiencia}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="text-center pt-4 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800 underline"
                >
                  Ver más ejemplos próximamente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamplesModal;
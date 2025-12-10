import React, { useState } from 'react';
import { FileText, X, Eye, Sparkles, MessageSquare, Instagram, Facebook, Twitter, Newspaper, Globe, Youtube, Linkedin } from 'lucide-react';

interface FormExamplesModalProps {
  onClose: () => void;
}

interface PlatformExample {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  exampleData: any;
  color: string;
}

const FormExamplesModal: React.FC<FormExamplesModalProps> = ({ onClose }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformExample | null>(null);

  const platforms: PlatformExample[] = [
    {
      id: 'nota-prensa',
      name: 'Nota de Prensa',
      icon: <Newspaper className="w-6 h-6" />,
      description: 'Comunicados oficiales y anuncios corporativos',
      color: 'bg-blue-500',
      exampleData: {
        characters: 'Ejecutivo corporativo de 45 años, traje ejecutivo azul marino, expresión seria y profesional. Logo de la empresa visible en el fondo.',
        world: 'Sala de conferencias moderna con mesa ovalada, sillas ejecutivas, proyector de pantalla grande, iluminación profesional, ambiente corporativo.',
        action: 'El ejecutivo está presentando ante un grupo de periodistas, señalando gráficos en la pantalla, con micrófonos y cámaras de televisión alrededor.',
        visualStyle: 'Fotografía corporativa profesional, estilo documental, colores corporativos azul y blanco, composición formal y elegante.',
        sensoryElements: 'Ambiente de seriedad y confianza, iluminación profesional, sensación de autoridad y credibilidad corporativa.',
        includeText: true,
        textContent: 'COMUNICADO DE PRENSA - Nuevo Lanzamiento',
        textPosition: 'superior',
        selectedFormat: 'horizontal',
        selectedResolution: '1920x1080',
        selectedPlatform: 'web',
        selectedModel: 'imagen4',
        quality: 'alta'
      }
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: <Twitter className="w-6 h-6" />,
      description: 'Contenido breve y viral para redes sociales',
      color: 'bg-black',
      exampleData: {
        characters: 'Persona joven de 25 años, expresión entusiasta y energética, cabello moderno, ropa casual urbana.',
        world: 'Café moderno con mesas de madera, iluminación cálida, plantas decorativas, ambiente urbano y trendy.',
        action: 'La persona está tomando una foto con su teléfono móvil, sonriendo a la cámara, con una taza de café en la mesa.',
        visualStyle: 'Fotografía móvil moderna, estilo instagram, colores vibrantes, composición dinámica y juvenil.',
        sensoryElements: 'Ambiente de energía y positividad, iluminación cálida, sensación de conexión social y modernidad.',
        includeText: true,
        textContent: '¡Nuevo día, nuevas oportunidades! ☕ #Motivacion',
        textPosition: 'inferior',
        selectedFormat: 'cuadrado',
        selectedResolution: '1024x1024',
        selectedPlatform: 'twitter',
        selectedModel: 'imagen4',
        quality: 'alta'
      }
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="w-6 h-6" />,
      description: 'Contenido visual atractivo para stories y feed',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      exampleData: {
        characters: 'Mujer joven de 28 años, expresión feliz y relajada, cabello largo ondulado, vestimenta casual elegante.',
        world: 'Jardín urbano con flores coloridas, bancos de madera, iluminación natural, ambiente tranquilo y estético.',
        action: 'La mujer está sentada en un banco leyendo un libro, con una bicicleta apoyada al lado, expresión de paz y disfrute.',
        visualStyle: 'Fotografía de estilo instagram, colores pastel suaves, composición estética, iluminación natural dorada.',
        sensoryElements: 'Ambiente de calma y bienestar, texturas naturales, sensación de paz y conexión con la naturaleza.',
        includeText: true,
        textContent: 'Momentos de paz en la ciudad 🌸',
        textPosition: 'centro',
        selectedFormat: 'cuadrado',
        selectedResolution: '1024x1024',
        selectedPlatform: 'instagram',
        selectedModel: 'imagen4',
        quality: 'alta'
      }
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="w-6 h-6" />,
      description: 'Contenido comunitario y familiar',
      color: 'bg-blue-600',
      exampleData: {
        characters: 'Familia completa: padre, madre e hijos pequeños, expresiones felices y unidas, ropa cómoda familiar.',
        world: 'Parque familiar con césped verde, árboles frondosos, columpios infantiles, iluminación natural, ambiente acogedor.',
        action: 'La familia está jugando en el parque, los niños en los columpios, padres sonriendo y fotografiando el momento.',
        visualStyle: 'Fotografía familiar cálida, colores naturales, composición grupal, iluminación suave y emotiva.',
        sensoryElements: 'Ambiente de amor y unión familiar, sensación de calidez, alegría y momentos compartidos.',
        includeText: true,
        textContent: 'Domingo familiar perfecto! 👨‍👩‍👧‍👦 #Familia #Amor',
        textPosition: 'inferior',
        selectedFormat: 'horizontal',
        selectedResolution: '1920x1080',
        selectedPlatform: 'web',
        selectedModel: 'imagen4',
        quality: 'alta'
      }
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin className="w-6 h-6" />,
      description: 'Contenido profesional y corporativo',
      color: 'bg-blue-700',
      exampleData: {
        characters: 'Profesional de negocios de 40 años, traje ejecutivo, expresión confiada, portando una laptop.',
        world: 'Oficina moderna con ventanales amplios, muebles minimalistas, iluminación profesional, ambiente corporativo.',
        action: 'El profesional está trabajando en su laptop, revisando gráficos en la pantalla, con una taza de café al lado.',
        visualStyle: 'Fotografía corporativa profesional, colores neutros y corporativos, composición formal y elegante.',
        sensoryElements: 'Ambiente de productividad y profesionalismo, sensación de confianza y competencia corporativa.',
        includeText: true,
        textContent: 'Impulsando la innovación tecnológica 🚀 #Business #Tech',
        textPosition: 'superior',
        selectedFormat: 'horizontal',
        selectedResolution: '1920x1080',
        selectedPlatform: 'linkedin',
        selectedModel: 'imagen4',
        quality: 'alta'
      }
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: <Youtube className="w-6 h-6" />,
      description: 'Miniaturas atractivas para videos',
      color: 'bg-red-600',
      exampleData: {
        characters: 'Creador de contenido joven, expresión energética y entusiasta, con auriculares y micrófono.',
        world: 'Estudio de grabación casero con luces RGB, computadora gaming, fondo verde para chroma key.',
        action: 'El creador está grabando un video, gesticulando animadamente, con efectos visuales alrededor.',
        visualStyle: 'Imagen vibrante y llamativa, colores saturados, texto en negrita, composición impactante.',
        sensoryElements: 'Ambiente de energía y entretenimiento, sensación de emoción y dinamismo, colores llamativos.',
        includeText: true,
        textContent: '¡EL MEJOR TUTORIAL 2024! 🔥',
        textPosition: 'centro',
        selectedFormat: 'horizontal',
        selectedResolution: '1920x1080',
        selectedPlatform: 'web',
        selectedModel: 'imagen4',
        quality: 'alta'
      }
    }
  ];

  const handleViewExample = (platform: PlatformExample) => {
    setSelectedPlatform(platform);
  };

  const handleCloseExample = () => {
    setSelectedPlatform(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative max-w-4xl w-full bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="text-blue-600" />
                  Ejemplos de Formularios
                </h2>
                <p className="text-gray-600 mt-1">
                  Ve cómo completar los formularios para diferentes plataformas
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <div
                  key={platform.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleViewExample(platform)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg text-white ${platform.color}`}>
                      {platform.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                      <p className="text-sm text-gray-600">{platform.description}</p>
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    Ver Ejemplo
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedPlatform && (
        <ExamplePreviewModal
          platform={selectedPlatform}
          onClose={handleCloseExample}
        />
      )}
    </>
  );
};

interface ExamplePreviewModalProps {
  platform: PlatformExample;
  onClose: () => void;
}

const ExamplePreviewModal: React.FC<ExamplePreviewModalProps> = ({ platform, onClose }) => {
  const [currentField, setCurrentField] = useState(0);
  const [filledFields, setFilledFields] = useState<Set<number>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);

  const fields = [
    { key: 'characters', label: 'Personajes/Sujetos', icon: '👥' },
    { key: 'world', label: 'Escenario/Mundo', icon: '🌍' },
    { key: 'action', label: 'Acción/Composición', icon: '⚡' },
    { key: 'visualStyle', label: 'Estilo Visual', icon: '🎨' },
    { key: 'sensoryElements', label: 'Elementos Sensoriales', icon: '👁️' },
    ...(platform.exampleData.includeText ? [{ key: 'textContent', label: 'Texto', icon: '📝' }] : [])
  ];

  const startAnimation = () => {
    setIsAnimating(true);
    setFilledFields(new Set());
    setCurrentField(0);

    fields.forEach((_, index) => {
      setTimeout(() => {
        setFilledFields(prev => new Set([...prev, index]));
        setCurrentField(index + 1);
      }, index * 1500);
    });

    setTimeout(() => {
      setIsAnimating(false);
    }, fields.length * 1500);
  };

  React.useEffect(() => {
    // Auto-start animation when modal opens
    const timer = setTimeout(startAnimation, 500);
    return () => clearTimeout(timer);
  }, []);

  const getFieldValue = (fieldKey: string) => {
    return platform.exampleData[fieldKey] || '';
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative max-w-5xl w-full bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg text-white ${platform.color}`}>
                {platform.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Ejemplo: {platform.name}
                </h2>
                <p className="text-gray-600">{platform.description}</p>
              </div>
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
          <div className="mb-6 text-center">
            <button
              onClick={startAnimation}
              disabled={isAnimating}
              className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5" />
              {isAnimating ? 'Autocompletando...' : 'Ver Autocompletado'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field, index) => (
              <div
                key={field.key}
                className={`border rounded-lg p-4 transition-all duration-500 ${
                  filledFields.has(index)
                    ? 'border-green-300 bg-green-50 shadow-md'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{field.icon}</span>
                  <label className="font-medium text-gray-900">
                    {index + 1}. {field.label}
                  </label>
                  {filledFields.has(index) && (
                    <span className="text-green-600 text-sm">✓ Completado</span>
                  )}
                </div>

                {field.key === 'textContent' ? (
                  <input
                    type="text"
                    value={filledFields.has(index) ? getFieldValue(field.key) : ''}
                    readOnly
                    className={`w-full p-3 border rounded-md transition-all duration-1000 ${
                      filledFields.has(index)
                        ? 'border-green-300 bg-white text-gray-900'
                        : 'border-gray-300 bg-gray-100'
                    }`}
                    placeholder="Texto a incluir..."
                  />
                ) : (
                  <textarea
                    value={filledFields.has(index) ? getFieldValue(field.key) : ''}
                    readOnly
                    rows={3}
                    className={`w-full p-3 border rounded-md transition-all duration-1000 resize-none ${
                      filledFields.has(index)
                        ? 'border-green-300 bg-white text-gray-900'
                        : 'border-gray-300 bg-gray-100'
                    }`}
                    placeholder={`${field.label}...`}
                  />
                )}

                {filledFields.has(index) && (
                  <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Campo autocompletado
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Configuración Técnica Sugerida:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Formato:</span>
                <p className="text-blue-700">{platform.exampleData.selectedFormat}</p>
              </div>
              <div>
                <span className="font-medium">Plataforma:</span>
                <p className="text-blue-700">{platform.exampleData.selectedPlatform}</p>
              </div>
              <div>
                <span className="font-medium">Modelo:</span>
                <p className="text-blue-700">{platform.exampleData.selectedModel}</p>
              </div>
              <div>
                <span className="font-medium">Calidad:</span>
                <p className="text-blue-700">{platform.exampleData.quality}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-100 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormExamplesModal;
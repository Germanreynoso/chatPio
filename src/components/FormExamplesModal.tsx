import React, { useState } from 'react';
import { FileText, X, Eye, Sparkles, MessageSquare, Instagram, Facebook, Twitter, Newspaper, Globe, Youtube, Linkedin, Image, Mic } from 'lucide-react';

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
  type: 'text' | 'image' | 'audio';
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
      type: 'text',
      exampleData: {
        tema: 'Partido benéfico Estadio Gran Canaria',
        mensaje: 'La Fundación organiza partido benéfico para familias necesitadas. Todos los fondos recaudados irán destinados a programas sociales.',
        contexto: 'Sábado 14:00h, entrada 5€, familias necesitadas, colaboración con entidades locales',
        audiencia: 'Comunidad local'
      }
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: <Twitter className="w-6 h-6" />,
      description: 'Contenido breve y viral para redes sociales',
      color: 'bg-black',
      type: 'text',
      exampleData: {
        tema: 'Nuevo acuerdo de patrocinio',
        mensaje: 'La UD Las Palmas firma acuerdo histórico con empresa tecnológica para digitalizar el estadio. #UDLP #Innovacion',
        contexto: 'Acuerdo 3 años, inversión 2M€, implementación IA para aficionados, lanzamiento inmediato',
        audiencia: 'Aficionados y seguidores en redes'
      }
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="w-6 h-6" />,
      description: 'Contenido visual atractivo para stories y feed',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      type: 'text',
      exampleData: {
        tema: 'Colaboración innovadora',
        mensaje: '✨ ¡Nueva era digital en la UD Las Palmas! Firmamos acuerdo con tech leader para revolucionar la experiencia de nuestros aficionados. #UDLP #Tecnologia #Futbol',
        contexto: 'Apps móviles, realidad aumentada, contenido exclusivo, comunidad digital ampliada',
        audiencia: 'Jóvenes aficionados'
      }
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="w-6 h-6" />,
      description: 'Contenido comunitario y familiar',
      color: 'bg-blue-600',
      type: 'text',
      exampleData: {
        tema: 'Avance tecnológico en el deporte',
        mensaje: 'La UD Las Palmas da un paso adelante en la innovación deportiva con nuevo acuerdo tecnológico. ¡Descubre cómo estamos transformando el fútbol!',
        contexto: 'Mejora experiencia aficionados, sostenibilidad digital, inclusión tecnológica, futuro del deporte',
        audiencia: 'Comunidad local y familias'
      }
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin className="w-6 h-6" />,
      description: 'Contenido profesional y corporativo',
      color: 'bg-blue-700',
      type: 'text',
      exampleData: {
        tema: 'Convenio estratégico corporativo',
        mensaje: 'Anunciamos alianza estratégica con líder tecnológico para transformación digital del club deportivo. Interesados en contactar: info@udlaspalmas.es',
        contexto: 'Proyecto innovación, desarrollo sostenible, impacto comunitario, oportunidades profesionales',
        audiencia: 'Profesionales y empresas'
      }
    },
    {
      id: 'audio-podcast',
      name: 'Audio/podcast',
      icon: <Mic className="w-6 h-6" />,
      description: 'Contenido de audio conversacional',
      color: 'bg-green-600',
      type: 'audio',
      exampleData: {
        formatoAudio: 'Monólogo',
        participantes: 'Pedro (Narrador)',
        duracion: '5',
        idioma: 'Español',
        musicaFondo: 'Sin música',
        temaPrincipal: 'Las tendencias de inteligencia artificial en las empresas canarias durante 2025, sus aplicaciones prácticas y el impacto en la transformación digital del sector',
        estructuraGuion: '1) Introducción y contexto (2 min), 2) Análisis de casos reales en Canarias (5 min), 3) Entrevista con experto local (8 min), 4) Conclusiones y call to action (2 min), 5) Despedida',
        puntosClave: '- Estadísticas de adopción de IA en Canarias, - Casos de éxito de MMI Analytics, - Beneficios de la automatización, - Retos comunes y soluciones, - Futuro del sector tecnológico en las islas',
        audienciaObjetivo: 'Directivos de empresas canarias, emprendedores tecnológicos',
        callToAction: 'Visita mmi-e.com para más información',
        estiloPodcast: 'Profesional - Corporativo y formal',
        tonoConversacion: 'Conversacional - Natural y cercano',
        modeloIA: 'ElevenLabs',
        calidadAudio: 'Alta (44kHz)',
        opcionesAdicionales: 'Incluir introducción, Incluir despedida'
      }
    },
    {
      id: 'imagen',
      name: 'Imagen',
      icon: <Image className="w-6 h-6" />,
      description: 'Generación de imágenes personalizadas',
      color: 'bg-purple-600',
      type: 'image',
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
  const [typingTexts, setTypingTexts] = useState<{ [key: string]: string }>({});
  const intervalsRef = React.useRef<{ [key: string]: number }>({});

  const fields = platform.type === 'text' ? [
    { key: 'tema', label: 'Tema o asunto principal', icon: '📝' },
    { key: 'mensaje', label: 'Mensaje clave que quiere transmitir', icon: '💬' },
    { key: 'contexto', label: 'Contexto o detalles adicionales', icon: '📋' },
    { key: 'audiencia', label: 'Audiencia objetivo', icon: '👥' }
  ] : platform.type === 'audio' ? [
    { key: 'formatoAudio', label: 'Formato del audio', icon: '🎙️' },
    { key: 'participantes', label: 'Configuración de participantes', icon: '👥' },
    { key: 'duracion', label: 'Duración (minutos)', icon: '⏱️' },
    { key: 'idioma', label: 'Idioma', icon: '🌍' },
    { key: 'musicaFondo', label: 'Música de fondo', icon: '🎵' },
    { key: 'temaPrincipal', label: 'Tema principal', icon: '📝' },
    { key: 'estructuraGuion', label: 'Estructura del guión', icon: '📋' },
    { key: 'puntosClave', label: 'Puntos clave a cubrir', icon: '✅' },
    { key: 'audienciaObjetivo', label: 'Audiencia objetivo', icon: '👥' },
    { key: 'callToAction', label: 'Call to action', icon: '📢' },
    { key: 'estiloPodcast', label: 'Estilo del podcast', icon: '🎭' },
    { key: 'tonoConversacion', label: 'Tono de la conversación', icon: '🗣️' },
    { key: 'modeloIA', label: 'Modelo de IA', icon: '🤖' },
    { key: 'calidadAudio', label: 'Calidad de audio', icon: '🔊' },
    { key: 'opcionesAdicionales', label: 'Opciones adicionales', icon: '⚙️' }
  ] : [
    { key: 'characters', label: 'Personajes/Sujetos', icon: '👥' },
    { key: 'world', label: 'Escenario/Mundo', icon: '🌍' },
    { key: 'action', label: 'Acción/Composición', icon: '⚡' },
    { key: 'visualStyle', label: 'Estilo Visual', icon: '🎨' },
    { key: 'sensoryElements', label: 'Elementos Sensoriales', icon: '👁️' },
    ...(platform.exampleData.includeText ? [{ key: 'textContent', label: 'Texto', icon: '📝' }] : [])
  ];

  const startAnimation = () => {
    // Clear previous intervals
    Object.values(intervalsRef.current).forEach(clearInterval);
    intervalsRef.current = {};

    setIsAnimating(true);
    setFilledFields(new Set());
    setCurrentField(0);
    setTypingTexts({});

    // Start with the first field
    startTypingForIndex(0);
  };

  React.useEffect(() => {
    // Auto-start animation when modal opens
    const timer = setTimeout(startAnimation, 500);
    return () => {
      clearTimeout(timer);
      Object.values(intervalsRef.current).forEach(clearInterval);
    };
  }, []);

  const getFieldValue = (fieldKey: string) => {
    return platform.exampleData[fieldKey] || '';
  };

  const typeText = (fieldKey: string, fullText: string, onComplete?: () => void) => {
    let index = 0;
    const interval = setInterval(() => {
      setTypingTexts(prev => ({ ...prev, [fieldKey]: fullText.slice(0, index + 1) }));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
        delete intervalsRef.current[fieldKey];
        onComplete?.();
      }
    }, 30); // 30ms per character for faster typing
    intervalsRef.current[fieldKey] = interval;
  };

  const startTypingForIndex = (index: number) => {
    if (index >= fields.length) {
      setIsAnimating(false);
      return;
    }
    setFilledFields(prev => new Set([...prev, index]));
    const field = fields[index];
    const fullText = getFieldValue(field.key);
    typeText(field.key, fullText, () => startTypingForIndex(index + 1));
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

                {(platform.type === 'image' && field.key === 'textContent') ? (
                  <input
                    type="text"
                    value={filledFields.has(index) ? (typingTexts[field.key] || getFieldValue(field.key)) : ''}
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
                    value={filledFields.has(index) ? (typingTexts[field.key] || getFieldValue(field.key)) : ''}
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

          {platform.type === 'image' && (
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
          )}

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
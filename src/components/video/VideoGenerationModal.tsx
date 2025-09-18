import React, { useState } from 'react';
import { Video, Users, Globe2, Zap, Palette, Eye, Volume2, Clock, Settings, Sparkles, FileVideo, Lightbulb, DollarSign, Monitor, Layout } from 'lucide-react';

type VideoGenerationModalProps = {
  onClose?: () => void;
};

const VideoGenerationModal: React.FC<VideoGenerationModalProps> = ({ onClose }) => {
  const [characters, setCharacters] = useState('');
  const [world, setWorld] = useState('');
  const [action, setAction] = useState('');
  const [visualStyle, setVisualStyle] = useState('');
  const [sensoryElements, setSensoryElements] = useState('');
  const [audioDescription, setAudioDescription] = useState('');
  const [duration, setDuration] = useState('5');
  const [selectedFormat, setSelectedFormat] = useState('horizontal');
  const [selectedResolution, setSelectedResolution] = useState('1080p');
  const [selectedPlatform, setSelectedPlatform] = useState('youtube');
  const [selectedModel, setSelectedModel] = useState('veo3');
  const [frameRate, setFrameRate] = useState('24');
  const [cameraMovement, setCameraMovement] = useState('estatico');
  const [quality, setQuality] = useState('alta');

  const formatos = [
    { id: 'horizontal', nombre: 'Horizontal (16:9)', resolucion: '1920x1080', uso: 'YouTube, web, presentaciones' },
    { id: 'vertical', nombre: 'Vertical (9:16)', resolucion: '1080x1920', uso: 'TikTok, Instagram Stories, móvil' },
    { id: 'cuadrado', nombre: 'Cuadrado (1:1)', resolucion: '1080x1080', uso: 'Instagram posts, Facebook' },
    { id: 'cine', nombre: 'Cinemático (21:9)', resolucion: '2560x1080', uso: 'Producciones premium' },
    { id: 'personalizado', nombre: 'Personalizado', resolucion: 'custom', uso: 'Dimensiones específicas' }
  ];

  const plataformas = [
    { id: 'youtube', nombre: 'YouTube', formato: 'horizontal', fps: '24', optimizacion: 'Engagement y retención' },
    { id: 'tiktok', nombre: 'TikTok', formato: 'vertical', fps: '30', optimizacion: 'Viralidad y impacto visual' },
    { id: 'instagram', nombre: 'Instagram Reels', formato: 'vertical', fps: '30', optimizacion: 'Estético y llamativo' },
    { id: 'linkedin', nombre: 'LinkedIn', formato: 'horizontal', fps: '24', optimizacion: 'Profesional y corporativo' },
    { id: 'web', nombre: 'Sitio web', formato: 'horizontal', fps: '24', optimizacion: 'Carga rápida y compatibilidad' },
    { id: 'personalizado', nombre: 'Personalizado', formato: 'horizontal', fps: '24', optimizacion: 'Configuración manual' }
  ];

  const modelos = [
    { id: 'veo3', nombre: 'Google Veo 3', descripcion: 'Último modelo, mejor calidad', coste: '0.15-0.40', disponible: true },
    { id: 'runway', nombre: 'Runway Gen-3', descripcion: 'Excelente para movimiento', coste: '0.25-0.50', disponible: true },
    { id: 'kling', nombre: 'Kling AI', descripcion: 'IA china, gran calidad', coste: '0.10-0.30', disponible: true },
    { id: 'luma', nombre: 'Luma Dream Machine', descripcion: 'Buena relación calidad-precio', coste: '0.12-0.35', disponible: true },
    { id: 'sora', nombre: 'OpenAI Sora', descripcion: 'En desarrollo, limitado', coste: '0.20-0.45', disponible: false }
  ];

  const movimientosCamara = [
    { id: 'estatico', nombre: 'Estático', descripcion: 'Sin movimiento de cámara' },
    { id: 'pan_derecha', nombre: 'Pan a la derecha', descripcion: 'Movimiento horizontal hacia la derecha' },
    { id: 'pan_izquierda', nombre: 'Pan a la izquierda', descripcion: 'Movimiento horizontal hacia la izquierda' },
    { id: 'tilt_up', nombre: 'Tilt hacia arriba', descripcion: 'Movimiento vertical ascendente' },
    { id: 'tilt_down', nombre: 'Tilt hacia abajo', descripcion: 'Movimiento vertical descendente' },
    { id: 'zoom_in', nombre: 'Zoom in', descripcion: 'Acercamiento gradual' },
    { id: 'zoom_out', nombre: 'Zoom out', descripcion: 'Alejamiento gradual' },
    { id: 'tracking', nombre: 'Tracking shot', descripcion: 'Seguimiento de sujeto' },
    { id: 'dolly', nombre: 'Dolly movement', descripcion: 'Movimiento hacia adelante/atrás' },
    { id: 'orbital', nombre: 'Movimiento orbital', descripcion: 'Rotación alrededor del sujeto' }
  ];

  const handlePlatformChange = (platformId: string) => {
    const platform = plataformas.find(p => p.id === platformId);
    if (platform && platformId !== 'personalizado') {
      setSelectedPlatform(platformId);
      setSelectedFormat(platform.formato);
      setFrameRate(platform.fps);
      const format = formatos.find(f => f.id === platform.formato);
      if (format && format.resolucion !== 'custom') {
        setSelectedResolution(format.resolucion.split('x')[1] + 'p');
      }
    } else {
      setSelectedPlatform(platformId);
    }
  };

  const calcularCoste = () => {
    const modelo = modelos.find(m => m.id === selectedModel);
    const duracionNum = parseInt(duration) || 5;
    const costeMin = parseFloat(modelo?.coste.split('-')[0] || '0.15');
    const costeMax = parseFloat(modelo?.coste.split('-')[1] || '0.40');
    const multiplicador = quality === 'maxima' ? 1.5 : quality === 'alta' ? 1.2 : 1;
    return {
      min: (duracionNum * costeMin * multiplicador).toFixed(2),
      max: (duracionNum * costeMax * multiplicador).toFixed(2)
    };
  };

  const generarPromptCompleto = () => {
    const sections: string[] = [];
    if (characters.trim()) sections.push(`Personajes/Sujetos: ${characters}`);
    if (world.trim()) sections.push(`Escenario/Mundo: ${world}`);
    if (action.trim()) sections.push(`Acción/Movimiento: ${action}`);
    if (visualStyle.trim()) sections.push(`Estilo Visual: ${visualStyle}`);
    if (sensoryElements.trim()) sections.push(`Elementos Sensoriales: ${sensoryElements}`);
    if (audioDescription.trim()) sections.push(`Audio/Sonido: ${audioDescription}`);
    if (cameraMovement !== 'estatico') {
      const mov = movimientosCamara.find(m => m.id === cameraMovement);
      if (mov) sections.push(`Movimiento de Cámara: ${mov.descripcion}`);
    }
    sections.push(`Duración: ${duration} segundos`);
    return sections.join('. ') || 'Complete los campos para generar el prompt...';
  };

  const coste = calcularCoste();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-w-5xl w-full mx-4 bg-white rounded-2xl shadow-udlp-lg ring-1 ring-gray-200 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Video className="text-purple-600" />
            Generar vídeo con prompting efectivo
          </h2>
          <p className="text-gray-600 mt-1">Crea vídeos profesionales usando los principios de prompting efectivo adaptados para contenido audiovisual</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-purple-600" />
              <h3 className="font-medium text-purple-900">5 tips para prompting efectivo en vídeo</h3>
            </div>
            <p className="text-sm text-purple-700">
              Usa descripción detallada para cada elemento. Los vídeos requieren más especificidad que las imágenes para obtener resultados coherentes y fluidos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Duración (segundos)
              </label>
              <select 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="3">3 segundos (0.45-1.20$)</option>
                <option value="5">5 segundos (0.75-2.00$)</option>
                <option value="10">10 segundos (1.50-4.00$)</option>
                <option value="15">15 segundos (2.25-6.00$)</option>
                <option value="30">30 segundos (4.50-12.00$)</option>
                <option value="60">60 segundos (9.00-24.00$)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plataforma destino</label>
              <select 
                value={selectedPlatform}
                onChange={(e) => handlePlatformChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {plataformas.map((plat) => (
                  <option key={plat.id} value={plat.id}>{plat.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Movimiento de cámara</label>
              <select 
                value={cameraMovement}
                onChange={(e) => setCameraMovement(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {movimientosCamara.map((mov) => (
                  <option key={mov.id} value={mov.id}>{mov.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Users className="inline w-5 h-5 mr-2 text-blue-600" />
              1. Define tus personajes/sujetos principales
            </label>
            <textarea
              value={characters}
              onChange={(e) => setCharacters(e.target.value)}
              placeholder="Ejemplo: Profesional joven trabajando en laptop, movimientos naturales al escribir, expresión concentrada..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
              maxLength={800}
            />
            <p className="text-xs text-gray-500 mt-1">
              Para vídeo: incluye movimientos, gestos, transiciones entre acciones. {characters.length}/800 caracteres
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Globe2 className="inline w-5 h-5 mr-2 text-purple-600" />
              2. Construye el escenario/mundo
            </label>
            <textarea
              value={world}
              onChange={(e) => setWorld(e.target.value)}
              placeholder="Ejemplo: Oficina moderna con luz natural que cambia sutilmente, ambiente dinámico..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[80px]"
              maxLength={800}
            />
            <p className="text-xs text-gray-500 mt-1">
              Para vídeo: describe elementos que aporten movimiento y vida al escenario. {world.length}/800 caracteres
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Zap className="inline w-5 h-5 mr-2 text-orange-600" />
              3. Define la acción/secuencia detallada
            </label>
            <textarea
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="Ejemplo: Secuencia de planos: medio → primer plano manos → zoom out mostrando pantalla..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-h-[80px]"
              maxLength={800}
            />
            <p className="text-xs text-gray-500 mt-1">
              Para vídeo: secuencia de acciones, timing, transiciones, ritmo del vídeo. {action.length}/800 caracteres
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Palette className="inline w-5 h-5 mr-2 text-green-600" />
              4. Define el estilo visual único
            </label>
            <textarea
              value={visualStyle}
              onChange={(e) => setVisualStyle(e.target.value)}
              placeholder="Ejemplo: Estilo cinematográfico corporativo, paleta de colores fría, iluminación suave..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[80px]"
              maxLength={800}
            />
            <p className="text-xs text-gray-500 mt-1">
              Para vídeo: estilo, paleta, tipo de planos, referencias visuales. {visualStyle.length}/800 caracteres
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Eye className="inline w-5 h-5 mr-2 text-red-600" />
              5. Elementos sensoriales/ambientales
            </label>
            <textarea
              value={sensoryElements}
              onChange={(e) => setSensoryElements(e.target.value)}
              placeholder="Ejemplo: Atmósfera de productividad e innovación, sensaciones, texturas, luz..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[80px]"
              maxLength={800}
            />
            <p className="text-xs text-gray-500 mt-1">
              Para vídeo: atmósfera, sensaciones que debe transmitir, mood general, emociones. {sensoryElements.length}/800 caracteres
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
            <label className="block text sm font-medium text-gray-700 mb-3">
              <Volume2 className="inline w-5 h-5 mr-2 text-indigo-600" />
              6. Diseño de audio/sonido
            </label>
            <textarea
              value={audioDescription}
              onChange={(e) => setAudioDescription(e.target.value)}
              placeholder="Ejemplo: Sonido ambiente sutil, música instrumental corporativa, efectos discretos..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px]"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              Específico para vídeo: sonidos ambientales, efectos sonoros, música de fondo. {audioDescription.length}/500 caracteres
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuración técnica avanzada
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Formato</label>
                <select 
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  disabled={selectedPlatform !== 'personalizado'}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100"
                >
                  {formatos.map((formato) => (
                    <option key={formato.id} value={formato.id}>{formato.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resolución</label>
                <select 
                  value={selectedResolution}
                  onChange={(e) => setSelectedResolution(e.target.value)}
                  disabled={selectedPlatform !== 'personalizado'}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100"
                >
                  <option value="720p">720p</option>
                  <option value="1080p">1080p (recomendado)</option>
                  <option value="1440p">1440p (2K)</option>
                  <option value="2160p">2160p (4K)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">FPS</label>
                <select 
                  value={frameRate}
                  onChange={(e) => setFrameRate(e.target.value)}
                  disabled={selectedPlatform !== 'personalizado'}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100"
                >
                  <option value="24">24 fps (cinematográfico)</option>
                  <option value="30">30 fps (estándar)</option>
                  <option value="60">60 fps (suave)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calidad</label>
                <select 
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="estandar">Estándar</option>
                  <option value="alta">Alta (recomendado)</option>
                  <option value="maxima">Máxima (+50% coste)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Modelo de IA para generación</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {modelos.map((modelo) => (
                <div
                  key={modelo.id}
                  onClick={() => modelo.disponible && setSelectedModel(modelo.id)}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    !modelo.disponible 
                      ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' 
                      : selectedModel === modelo.id 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm">{modelo.nombre}</div>
                  <div className="text-xs text-gray-500">{modelo.descripcion}</div>
                  <div className="text-xs text-green-600 mt-1">{modelo.coste}$ por segundo</div>
                  {!modelo.disponible && <div className="text-xs text-red-500">No disponible</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2 flex items-center">
              <FileVideo className="w-4 h-4 mr-1" />
              Prompt final generado para vídeo
            </h4>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border max-h-40 overflow-y-auto">
              {generarPromptCompleto()}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              Información de coste estimado
            </h4>
            <div className="text-sm text-yellow-700">
              <p><strong>Coste estimado:</strong> ${coste.min} - ${coste.max} para {duration} segundos</p>
              <p><strong>Modelo seleccionado:</strong> {modelos.find(m => m.id === selectedModel)?.nombre}</p>
              <p className="text-xs mt-1">Los precios varían según complejidad de la escena y resolución final</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button 
              disabled={!modelos.find(m => m.id === selectedModel)?.disponible}
              className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-md hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              Generar vídeo
            </button>
            <button className="bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors">
              Vista previa
            </button>
            <button onClick={onClose} className="bg-gray-100 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-200 transition-colors">
              Cancelar
            </button>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-2">🎬 Tips específicos para generación de vídeo</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• <strong>Movimiento coherente:</strong> Describe transiciones suaves entre acciones</li>
              <li>• <strong>Duración inicial:</strong> Empieza con vídeos cortos (5-10s) para testear prompts</li>
              <li>• <strong>Audio descriptivo:</strong> El audio se genera según la descripción, sé específico</li>
              <li>• <strong>Estabilidad:</strong> Evita demasiados elementos en movimiento simultáneo</li>
              <li>• <strong>Coherencia temporal:</strong> Asegúrate de que la secuencia tenga sentido cronológico</li>
              <li>• <strong>Coste-beneficio:</strong> Veo 3 tiene la mejor relación calidad-precio actualmente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerationModal;


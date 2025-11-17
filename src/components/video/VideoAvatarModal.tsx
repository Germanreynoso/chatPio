import React, { useState } from 'react';
import { Play, Camera, Settings, FileText, Globe, Monitor, ChevronDown } from 'lucide-react';
import { API_CONFIG } from '../../config/api';

type VideoAvatarModalProps = {
  onClose?: () => void;
};

const VideoAvatarModal: React.FC<VideoAvatarModalProps> = ({ onClose }) => {
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('medio');
  const [selectedPosition, setSelectedPosition] = useState('centro');
  const [selectedBackground, setSelectedBackground] = useState('oficina');
  const [script, setScript] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [selectedVoice, setSelectedVoice] = useState('natural');
  const [outputFormat, setOutputFormat] = useState('horizontal');
  const [resolution, setResolution] = useState('1080p');
  const [platform, setPlatform] = useState('youtube');
  const [isGeneratingHeyGen, setIsGeneratingHeyGen] = useState(false);
  const [isGeneratingSynthesia, setIsGeneratingSynthesia] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [includeSubtitles, setIncludeSubtitles] = useState(false);
  const [subtitleText, setSubtitleText] = useState('');
  const [backgroundUrl, setBackgroundUrl] = useState('');

  const avatares = [
    { id: 'maria', nombre: 'María', descripcion: 'Presentadora profesional', imagen: '👩‍💼' },
    { id: 'carlos', nombre: 'Carlos', descripcion: 'Comunicador corporativo', imagen: '👨‍💼' },
    { id: 'ana', nombre: 'Ana', descripcion: 'Locutora joven', imagen: '👩‍🎓' },
    { id: 'david', nombre: 'David', descripcion: 'Presentador deportivo', imagen: '👨‍🏫' }
  ];

  const fondos = [
    { id: 'oficina', nombre: 'Oficina moderna', preview: '🏢' },
    { id: 'estudio', nombre: 'Estudio de noticias', preview: '📺' },
    { id: 'salon', nombre: 'Salón ejecutivo', preview: '🪑' },
    { id: 'verde', nombre: 'Pantalla verde', preview: '🟢' },
    { id: 'personalizado', nombre: 'Fondo personalizado', preview: '🎨' }
  ];

  const plataformas = [
    { id: 'youtube', nombre: 'YouTube', formato: 'horizontal', resolucion: '1080p' },
    { id: 'tiktok', nombre: 'TikTok', formato: 'vertical', resolucion: '1080p' },
    { id: 'instagram', nombre: 'Instagram Stories', formato: 'vertical', resolucion: '1080p' },
    { id: 'linkedin', nombre: 'LinkedIn', formato: 'horizontal', resolucion: '720p' },
    { id: 'personalizado', nombre: 'Personalizado', formato: 'horizontal', resolucion: '1080p' }
  ];

  const handlePlatformChange = (platformId: string) => {
    const plat = plataformas.find(p => p.id === platformId);
    if (plat && platformId !== 'personalizado') {
      setPlatform(platformId);
      setOutputFormat(plat.formato);
      setResolution(plat.resolucion);
    } else {
      setPlatform(platformId);
    }
  };

  const handleGenerateVideoWithHeyGen = async () => {
    const formData = {
      avatar_id: selectedAvatar,
      background: backgroundUrl || selectedBackground,
      background_url: backgroundUrl,
      background_type: backgroundUrl ? 'url' : 'preset',
      ratio: outputFormat === 'horizontal' ? '16:9' : outputFormat === 'vertical' ? '9:16' : '1:1',
      video_size: resolution === '1080p' ? '1920x1080' : resolution === '720p' ? '1280x720' : '3840x2160',
      script: {
        type: 'text',
        input_text: script,
        language: selectedLanguage,
        voice: selectedVoice
      },
      subtitles: includeSubtitles ? {
        enabled: true,
        text: subtitleText || script // Use custom subtitle text or fallback to script
      } : { enabled: false },
      selectedPlan,
      selectedPosition,
      selectedLanguage,
      selectedVoice,
      outputFormat,
      resolution,
      platform,
      videoType: 'avatar_heygen'
    };

    console.log('Enviando datos al webhook de video con HeyGen:', formData);
    setIsGeneratingHeyGen(true);

    try {
      const response = await fetch(API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.AVATAR_VIDEO_GENERATION), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Respuesta del webhook de video con HeyGen:', response.status, response.statusText);

      if (response.ok) {
        try {
          const result = await response.json();
          console.log('Video con avatar generado exitosamente:', result);

          // Extraer el mensaje del bot_response
          const message = result.data?.bot_response;
          if (message) {
            setGeneratedMessage(message);
          } else {
            alert('Video con avatar generado, pero no se pudo obtener el mensaje. Revisa la consola para más detalles.');
          }
        } catch (jsonError) {
          console.error('Error al parsear JSON:', jsonError);
          // Si no es JSON válido, intentar obtener como texto plano
          const textResponse = await response.text();
          console.log('Respuesta como texto:', textResponse);
          if (textResponse) {
            setGeneratedMessage(textResponse);
          } else {
            alert('Video con avatar generado, pero la respuesta no es válida. Revisa la consola para más detalles.');
          }
        }
      } else {
        const errorText = await response.text();
        console.error('Error al generar el video con avatar:', response.statusText, errorText);
        alert(`Error al generar el video con avatar: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert(`Error en la solicitud: ${error}`);
    } finally {
      setIsGeneratingHeyGen(false);
    }
  };

  const handleGenerateVideoWithSynthesia = async () => {
    const formData = {
      selectedAvatar,
      selectedPlan,
      selectedPosition,
      selectedBackground,
      script,
      selectedLanguage,
      selectedVoice,
      outputFormat,
      resolution,
      platform,
      videoType: 'avatar_synthesia'
    };

    console.log('Enviando datos al webhook de video con Synthesia:', formData);
    setIsGeneratingSynthesia(true);

    try {
      const response = await fetch(API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.SYNTHESIA_VIDEO_GENERATION), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Respuesta del webhook de video con Synthesia:', response.status, response.statusText);

      if (response.ok) {
        try {
          const result = await response.json();
          console.log('Video con avatar generado exitosamente:', result);

          // Extraer el mensaje del bot_response
          const message = result.data?.bot_response;
          if (message) {
            setGeneratedMessage(message);
          } else {
            alert('Video con avatar generado, pero no se pudo obtener el mensaje. Revisa la consola para más detalles.');
          }
        } catch (jsonError) {
          console.error('Error al parsear JSON:', jsonError);
          // Si no es JSON válido, intentar obtener como texto plano
          const textResponse = await response.text();
          console.log('Respuesta como texto:', textResponse);
          if (textResponse) {
            setGeneratedMessage(textResponse);
          } else {
            alert('Video con avatar generado, pero la respuesta no es válida. Revisa la consola para más detalles.');
          }
        }
      } else {
        const errorText = await response.text();
        console.error('Error al generar el video con avatar:', response.statusText, errorText);
        alert(`Error al generar el video con avatar: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert(`Error en la solicitud: ${error}`);
    } finally {
      setIsGeneratingSynthesia(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-w-4xl w-full mx-4 bg-white rounded-2xl shadow-udlp-lg ring-1 ring-gray-200 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Camera className="text-blue-600" />
            Generar vídeo con avatar
          </h2>
          <p className="text-gray-600 mt-1">Crea contenido audiovisual profesional con presentadores virtuales</p>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Play className="inline w-4 h-4 mr-1" />
              Selecciona el avatar
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {avatares.map((avatar) => (
                <div
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedAvatar === avatar.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl text-center mb-2">{avatar.imagen}</div>
                  <div className="text-sm font-medium text-center">{avatar.nombre}</div>
                  <div className="text-xs text-gray-500 text-center">{avatar.descripcion}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de plano</label>
              <select 
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="primer">Primer plano</option>
                <option value="medio">Plano medio</option>
                <option value="largo">Plano largo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Posición en pantalla</label>
              <select 
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="centro">Centro</option>
                <option value="izquierda">Izquierda</option>
                <option value="derecha">Derecha</option>
                <option value="circulo">En círculo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fondo</label>
              <select
                value={selectedBackground}
                onChange={(e) => setSelectedBackground(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {fondos.map((fondo) => (
                  <option key={fondo.id} value={fondo.id}>
                    {fondo.preview} {fondo.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de fondo personalizado (opcional)
            </label>
            <input
              type="url"
              value={backgroundUrl}
              onChange={(e) => setBackgroundUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen-fondo.jpg"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Si proporcionas una URL de imagen, se usará como fondo en lugar del preset seleccionado arriba.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline w-4 h-4 mr-1" />
              Guión del vídeo
            </label>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Escribe aquí el texto que quieres que diga el avatar. Máximo 500 palabras para mantener la duración del vídeo en límites razonables."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
              maxLength={3000}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {script.length}/3000 caracteres
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="includeSubtitles"
                checked={includeSubtitles}
                onChange={(e) => setIncludeSubtitles(e.target.checked)}
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="includeSubtitles" className="text-sm font-medium text-gray-700">
                Incluir subtítulos en el vídeo
              </label>
            </div>
            {includeSubtitles && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto de subtítulos (opcional)
                </label>
                <textarea
                  value={subtitleText}
                  onChange={(e) => setSubtitleText(e.target.value)}
                  placeholder="Si no especificas texto, se usarán los subtítulos generados automáticamente del script."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                  maxLength={3000}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {subtitleText.length}/3000 caracteres
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="inline w-4 h-4 mr-1" />
                Idioma
              </label>
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estilo de voz</label>
              <select 
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="natural">Natural</option>
                <option value="profesional">Profesional</option>
                <option value="energico">Enérgico</option>
                <option value="calmado">Calmado</option>
              </select>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuración técnica
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Monitor className="inline w-4 h-4 mr-1" />
                  Plataforma destino
                </label>
                <select 
                  value={platform}
                  onChange={(e) => handlePlatformChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {plataformas.map((plat) => (
                    <option key={plat.id} value={plat.id}>{plat.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Formato</label>
                <select 
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  disabled={platform !== 'personalizado'}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="horizontal">Horizontal (16:9)</option>
                  <option value="vertical">Vertical (9:16)</option>
                  <option value="cuadrado">Cuadrado (1:1)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resolución</label>
                <select 
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  disabled={platform !== 'personalizado'}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="720p">720p</option>
                  <option value="1080p">1080p (recomendado)</option>
                  <option value="4k">4K (mayor coste)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-amber-800 mb-2">💰 Información de coste</h4>
            <p className="text-sm text-amber-700">
              Coste estimado: 0,15-0,40$ por segundo de vídeo generado. 
              Un vídeo de 30 segundos costaría aproximadamente 4,50-12$ según la complejidad y resolución.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleGenerateVideoWithHeyGen}
              disabled={isGeneratingHeyGen}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isGeneratingHeyGen ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generando...
                </>
              ) : (
                <>
                  🎬 Generar vídeo con HeyGen
                </>
              )}
            </button>
            <button
              onClick={handleGenerateVideoWithSynthesia}
              disabled={isGeneratingSynthesia}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isGeneratingSynthesia ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generando...
                </>
              ) : (
                <>
                  🎥 Generar vídeo con Synthesia
                </>
              )}
            </button>
            <button onClick={onClose} className="bg-gray-100 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-200 transition-colors">
              Cancelar
            </button>
          </div>

          {generatedMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2 flex items-center">
                <Play className="w-4 h-4 mr-1" />
                Video con avatar generado exitosamente
              </h4>
              <div className="text-sm text-green-700 bg-white p-3 rounded border max-h-40 overflow-y-auto">
                {generatedMessage}
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              <strong>Modo prototipo:</strong> Los vídeos generados incluirán marca de agua. 
              Para uso comercial sin marca de agua se requiere plan específico.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoAvatarModal;


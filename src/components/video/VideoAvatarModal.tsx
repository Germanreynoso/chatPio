import React, { useState, useEffect } from 'react';
import { Play, Camera, Settings, FileText, Globe, Monitor, ChevronDown, Check, RefreshCw } from 'lucide-react';
import { API_CONFIG } from '../../config/api';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { useGlobalError } from '../../contexts/GlobalErrorContext';

const AVATAR_FEMALE_ID = "Hada_Casual_Cup_Front_public";
const AVATAR_MALE_ID = "Armando_Casual_Front_public";
const VOICE_FEMALE_ID = "3fac0e13ef4d42c0a30bc20e524ae43d";
const VOICE_MALE_ID = "ec36396594a24ed182d6849ba0ea94b1";

// Webhooks for Synthesia flow
const WEBHOOK_VALIDATE_SYNTHESIA = 'https://n8n.icc-e.org/webhook-test/7fe6fe12-9bd7-40c0-98b4-c6b8c4c3a13a';
const WEBHOOK_ACCEPT_VIDEO = 'https://n8n.icc-e.org/webhook-test/01669e58-6bf2-430e-87ee-4493e55e0039';
const WEBHOOK_REGENERATE_SCRIPT = '/webhook/7fe6fe12-9bd7-40c0-98b4-c6b8c4c3a13a';

// Type for the preview data from n8n
type SynthesiaPreviewData = {
  ok: boolean;
  data: {
    title: string;
    description: string;
    script: string;
  };
};

type VideoAvatarModalProps = {
  onClose?: () => void;
};

const VideoAvatarModal: React.FC<VideoAvatarModalProps> = ({ onClose }) => {
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [avatarId, setAvatarId] = useState('');
  const [voiceId, setVoiceId] = useState('');
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

  // New state for Synthesia preview
  const [synthesiaPreview, setSynthesiaPreview] = useState<SynthesiaPreviewData | null>(null);
  const [isAcceptingVideo, setIsAcceptingVideo] = useState(false);
  const [isRegeneratingScript, setIsRegeneratingScript] = useState(false);
  const [editedValidation, setEditedValidation] = useState('');
  const [showSynthesiaRestrictions, setShowSynthesiaRestrictions] = useState(false);
  const [showHeyGenRestrictions, setShowHeyGenRestrictions] = useState(false);

  const { handleError } = useErrorHandler('avatar-video-generation');
  const { showError } = useGlobalError();

  useEffect(() => {
    if (selectedAvatar === 'maria') {
      setAvatarId(AVATAR_FEMALE_ID);
      setVoiceId(VOICE_FEMALE_ID);
    } else if (selectedAvatar === 'carlos') {
      setAvatarId(AVATAR_MALE_ID);
      setVoiceId(VOICE_MALE_ID);
    } else {
      setAvatarId(selectedAvatar);
      setVoiceId(selectedVoice);
    }
  }, [selectedAvatar, selectedVoice]);

  const avatares = [
    { id: 'maria', nombre: 'María', descripcion: 'Presentadora profesional', imagen: '👩‍💼' },
    { id: 'carlos', nombre: 'Carlos', descripcion: 'Comunicador corporativo', imagen: '👨‍💼' },
    { id: 'ana', nombre: 'Ana', descripcion: 'Locutora joven', imagen: '👩‍🎓' },
    { id: 'david', nombre: 'David', descripcion: 'Presentador deportivo', imagen: '👨‍🏫' }
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
      avatar_id: avatarId,
      ratio: outputFormat === 'horizontal' ? '16:9' : outputFormat === 'vertical' ? '9:16' : '1:1',
      video_size: resolution === '1080p' ? '1920x1080' : resolution === '720p' ? '1280x720' : '3840x2160',
      script: {
        type: 'text',
        input_text: script,
        language: selectedLanguage,
        voice: voiceId
      },
      subtitles: includeSubtitles ? {
        enabled: true,
        text: subtitleText || script // Use custom subtitle text or fallback to script
      } : { enabled: false },
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
            handleError(new Error('Video con avatar generado, pero no se pudo obtener el mensaje'));
            showError();
          }
        } catch (jsonError) {
          console.error('Error al parsear JSON:', jsonError);
          // Si no es JSON válido, intentar obtener como texto plano
          const textResponse = await response.text();
          console.log('Respuesta como texto:', textResponse);
          if (textResponse) {
            setGeneratedMessage(textResponse);
          } else {
            handleError(new Error('Video con avatar generado, pero la respuesta no es válida'));
            showError();
          }
        }
      } else {
        const errorText = await response.text();
        console.error('Error al generar el video con avatar:', response.statusText, errorText);
        handleError(new Error(`Error al generar el video con avatar: ${response.statusText}`));
        showError();
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      handleError(error);
      showError();
    } finally {
      setIsGeneratingHeyGen(false);
    }
  };

  const handleGenerateVideoWithSynthesia = async () => {
    const formData = {
      avatar_id: avatarId,
      script,
      selectedLanguage,
      voice: voiceId,
      outputFormat,
      resolution,
      platform,
      videoType: 'avatar_synthesia'
    };

    console.log('Enviando datos al webhook de video con Synthesia:', formData);
    setIsGeneratingSynthesia(true);
    setSynthesiaPreview(null); // Reset preview
    setGeneratedMessage(null); // Reset message

    try {
      const response = await fetch(API_CONFIG.getFullUrl(WEBHOOK_VALIDATE_SYNTHESIA), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Respuesta del webhook de video con Synthesia:', response.status, response.statusText);

      // Read the response body only once
      const responseText = await response.text();
      console.log('Respuesta raw de Synthesia:', responseText);

      if (response.ok) {
        // Check if response is empty
        if (!responseText || responseText.trim() === '') {
          console.log('Respuesta vacía del servidor');
          setGeneratedMessage('Solicitud enviada correctamente. El servidor está procesando tu petición.');
          return;
        }

        try {
          const result = JSON.parse(responseText);
          console.log('JSON parseado de Synthesia:', result);

          // Check if the response has the expected structure with title, description, script
          if (result.ok && result.data && result.data.title && result.data.description && result.data.script) {
            // Show preview instead of generating video directly
            setSynthesiaPreview(result);
            setEditedValidation(result.data.script);
            console.log('Vista previa de Synthesia configurada:', result);
          } else if (result.data?.bot_response) {
            // Fallback to old behavior if response has bot_response
            setGeneratedMessage(result.data.bot_response);
          } else if (result.message) {
            // Handle simple message response
            setGeneratedMessage(result.message);
          } else {
            // Try to show whatever we got as preview if it has some structure
            console.log('Estructura de respuesta no reconocida:', result);
            if (typeof result === 'object' && result !== null) {
              setSynthesiaPreview(result);
            } else {
              setGeneratedMessage(JSON.stringify(result));
            }
          }
        } catch (jsonError) {
          console.error('Error al parsear JSON:', jsonError);
          // If not valid JSON, show as message
          setGeneratedMessage(responseText);
        }
      } else {
        console.error('Error al generar el video con avatar:', response.statusText, responseText);
        handleError(new Error(`Error al generar el video con avatar: ${response.statusText}`));
        showError();
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      handleError(error);
      showError();
    } finally {
      setIsGeneratingSynthesia(false);
    }
  };

  // Handler for "Aceptar y generar video" button
  const handleAcceptAndGenerateVideo = async () => {
    if (!synthesiaPreview) return;

    console.log('Aceptando y generando video con datos:', synthesiaPreview);
    setIsAcceptingVideo(true);

    try {
      const response = await fetch(API_CONFIG.getFullUrl(WEBHOOK_ACCEPT_VIDEO), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(synthesiaPreview),
      });

      console.log('Respuesta del webhook de aceptar video:', response.status, response.statusText);

      if (response.ok) {
        const responseText = await response.text();
        console.log('Respuesta de aceptar video:', responseText);

        try {
          const result = JSON.parse(responseText);
          const message = result.data?.bot_response || result.message || 'Video aceptado y en proceso de generación';
          setGeneratedMessage(message);
        } catch {
          setGeneratedMessage(responseText || 'Video aceptado y en proceso de generación');
        }

        // Clear the preview after successful acceptance
        setSynthesiaPreview(null);
      } else {
        const errorText = await response.text();
        console.error('Error al aceptar el video:', response.statusText, errorText);
        handleError(new Error(`Error al aceptar el video: ${response.statusText}`));
        showError();
      }
    } catch (error) {
      console.error('Error en la solicitud de aceptar video:', error);
      handleError(error);
      showError();
    } finally {
      setIsAcceptingVideo(false);
    }
  };

  // Handler for "Continuar con Synthesia" button
  const handleContinueWithSynthesia = async () => {
    const formData = {
      avatar_id: avatarId,
      script,
      selectedLanguage,
      voice: voiceId,
      outputFormat,
      resolution,
      platform,
      videoType: 'avatar_synthesia'
    };

    console.log('Enviando datos para continuar con Synthesia:', formData);
    setIsGeneratingSynthesia(true);
    setSynthesiaPreview(null); // Reset preview
    setGeneratedMessage(null); // Reset message

    try {
      const response = await fetch(API_CONFIG.getFullUrl(WEBHOOK_VALIDATE_SYNTHESIA), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Respuesta de continuar con Synthesia:', response.status, response.statusText);

      if (response.ok) {
        try {
          const result = await response.json();
          console.log('Video con Synthesia continuado exitosamente:', result);

          // Extraer el mensaje del bot_response
          const message = result.data?.bot_response;
          if (message) {
            setGeneratedMessage(message);
          } else {
            handleError(new Error('Video con Synthesia continuado, pero no se pudo obtener el mensaje'));
            showError();
          }
        } catch (jsonError) {
          console.error('Error al parsear JSON:', jsonError);
          // Si no es JSON válido, intentar obtener como texto plano
          const textResponse = await response.text();
          console.log('Respuesta como texto:', textResponse);
          if (textResponse) {
            setGeneratedMessage(textResponse);
          } else {
            handleError(new Error('Video con Synthesia continuado, pero la respuesta no es válida'));
            showError();
          }
        }
      } else {
        const errorText = await response.text();
        console.error('Error al continuar con Synthesia:', response.statusText, errorText);
        handleError(new Error(`Error al continuar con Synthesia: ${response.statusText}`));
        showError();
      }
    } catch (error) {
      console.error('Error en la solicitud de continuar con Synthesia:', error);
      handleError(error);
      showError();
    } finally {
      setIsGeneratingSynthesia(false);
    }
  };

  // Handler for "Regenerar guion" button
  const handleRegenerateScript = async () => {
    if (!synthesiaPreview) return;

    console.log('Regenerando guion con datos:', synthesiaPreview);
    setIsRegeneratingScript(true);

    try {
      const response = await fetch(API_CONFIG.getFullUrl(WEBHOOK_REGENERATE_SCRIPT), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(synthesiaPreview),
      });

      console.log('Respuesta del webhook de regenerar guion:', response.status, response.statusText);

      if (response.ok) {
        const responseText = await response.text();
        console.log('Respuesta de regenerar guion:', responseText);

        try {
          const result = JSON.parse(responseText);
          console.log('JSON parseado de regenerar guion:', result);

          // Check if the response has the expected structure
          if (result.ok && result.data && result.data.title && result.data.description && result.data.script) {
            // Update preview with new data
            setSynthesiaPreview(result);
            console.log('Vista previa actualizada con nuevo guion:', result);
          } else if (result.data?.bot_response) {
            setGeneratedMessage(result.data.bot_response);
          } else {
            // Try to show whatever we got as new preview
            setSynthesiaPreview(result);
          }
        } catch {
          setGeneratedMessage(responseText || 'Guion regenerado');
        }
      } else {
        const errorText = await response.text();
        console.error('Error al regenerar el guion:', response.statusText, errorText);
        handleError(new Error(`Error al regenerar el guion: ${response.statusText}`));
        showError();
      }
    } catch (error) {
      console.error('Error en la solicitud de regenerar guion:', error);
      handleError(error);
      showError();
    } finally {
      setIsRegeneratingScript(false);
    }
  };

  // Handler for sending form data to webhook
  const handleSendFormDataToWebhook = async () => {
    const formData = {
      avatar_id: avatarId,
      script,
      selectedLanguage,
      voice: voiceId,
      outputFormat,
      resolution,
      platform,
      videoType: 'avatar_synthesia'
    };

    console.log('Enviando datos del formulario al webhook:', formData);

    try {
      const response = await fetch('https://n8n.icc-e.org/webhook-test/b3577f4e-827a-481c-8be3-cd38e00166e2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Respuesta del webhook:', response.status, response.statusText);

      if (response.ok) {
        const responseText = await response.text();
        console.log('Respuesta del webhook:', responseText);
        setGeneratedMessage('Datos enviados correctamente al webhook.');
      } else {
        const errorText = await response.text();
        console.error('Error al enviar datos:', response.statusText, errorText);
        handleError(new Error(`Error al enviar datos: ${response.statusText}`));
        showError();
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      handleError(error);
      showError();
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
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${selectedAvatar === avatar.id
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



          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowHeyGenRestrictions(true)}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Conoce las restricciones de HeyGen
            </button>
            <button
              onClick={() => setShowSynthesiaRestrictions(true)}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Conoce las restricciones de Synthesia
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline w-4 h-4 mr-1" />
              Idea de video
            </label>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Escribe aquí el texto que quieres que diga el avatar. Máximo 500 palabras para mantener la duración del vídeo en límites razonables."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[250px]"
              maxLength={3000}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {script.length}/3000 caracteres
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-700">
              Selecciona el motor que quieras utilizar para la generacion del video, recuerda que cada uno tiene sus propias restricciones
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
                  🎬 Validar idea con HeyGen
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
                  🎥 Validar idea con Synthesia
                </>
              )}
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleSendFormDataToWebhook}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-md hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              📤 Enviar datos del formulario
            </button>
          </div>



          {/* Synthesia Preview Section */}
          {synthesiaPreview && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-800 mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Vista previa del contenido generado
              </h4>

              <div className="bg-white p-4 rounded-lg border border-purple-100">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Validación o sugerencia de edición de la idea:</label>
                  <textarea
                    value={editedValidation}
                    onChange={(e) => setEditedValidation(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] max-h-48 overflow-y-auto whitespace-pre-wrap"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  onClick={handleAcceptAndGenerateVideo}
                  disabled={isAcceptingVideo}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isAcceptingVideo ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Aceptar y generar video
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {generatedMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
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

          <div className="flex justify-end pt-4">
            <button onClick={onClose} className="bg-gray-100 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-200 transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      </div>

      {/* HeyGen Restrictions Modal */}
      {showHeyGenRestrictions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowHeyGenRestrictions(false)} />
          <div className="relative max-w-2xl w-full mx-4 bg-white rounded-2xl shadow-udlp-lg ring-1 ring-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Restricciones de Contenido de HeyGen
              </h2>
              <button
                onClick={() => setShowHeyGenRestrictions(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contenido Estrictamente Prohibido</h3>
              <p className="text-gray-600 mb-6">
                Los siguientes tipos de contenido NO están permitidos
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Política y Elecciones</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>Contenido político o de campañas</li>
                    <li>Promoción de partidos políticos</li>
                    <li>Contenido relacionado con elecciones</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Contenido Violento o Criminal</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>Promoción de violencia o actividades criminales</li>
                    <li>Armas o municiones</li>
                    <li>Organizaciones terroristas</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Fraudes y Estafas</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>Esquemas piramidales o Ponzi</li>
                    <li>Estafas de criptomonedas</li>
                    <li>Fraudes financieros</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Contenido Sexual Explícito</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>Actos sexuales, desnudos o contenido pornográfico</li>
                    <li>Excepción: Material educativo claramente etiquetado</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Menores de Edad</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>Cualquier avatar que represente menores de 18 años</li>
                    <li>Contenido que involucre menores</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Discurso de Odio y Acoso</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>Ataques a personas, razas, religiones o géneros</li>
                    <li>Lenguaje ofensivo o amenazas</li>
                    <li>Bullying o acoso</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Desinformación</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>Información falsa sobre salud</li>
                    <li>Noticias falsas o manipuladas</li>
                    <li>Contenido que manipule elecciones</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Propiedad Intelectual</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>Uso de contenido con derechos de autor sin permiso</li>
                    <li>Violación de marcas registradas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Synthesia Restrictions Modal */}
      {showSynthesiaRestrictions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSynthesiaRestrictions(false)} />
          <div className="relative max-w-2xl w-full mx-4 bg-white rounded-2xl shadow-udlp-lg ring-1 ring-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Restricciones de Synthesia para Crear Videos
              </h2>
              <button
                onClick={() => setShowSynthesiaRestrictions(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                A continuación encontrarás un resumen claro y fácil de entender sobre lo que no se puede hacer al generar un video con Synthesia:
              </p>
              <div className="space-y-4 text-sm text-gray-700">
                <p>• No se pueden usar voces o caras de personas reales sin su autorización. Nada de imitar celebridades, políticos o cualquier persona sin permiso.</p>
                <p>• No se puede generar contenido engañoso o manipulado. Está prohibido crear videos que parezcan hechos por alguien real con la intención de confundir, estafar o falsificar información.</p>
                <p>• No se puede producir contenido dañino, violento o discriminatorio. Incluye discursos de odio, amenazas, acoso, violencia gráfica o cualquier mensaje que ataque a un grupo o individuo.</p>
                <p>• No se pueden usar guiones sexualmente explícitos o inapropiados. La plataforma bloquea contenido erótico, insinuaciones fuertes o material para adultos.</p>
                <p>• No se pueden generar instrucciones peligrosas o ilegales. Nada de guías sobre actividades criminales, autolesiones, armas, hackeo o sustancias ilegales.</p>
                <p>• No se puede suplantar identidad o hacerse pasar por instituciones. Prohibido crear videos que imiten organizaciones oficiales o empresas sin autorización.</p>
                <p>• No se permite contenido médico, legal o financiero que pueda inducir a error. No genera diagnósticos, recetas médicas, asesoramiento legal ni promesas financieras.</p>
                <p>• No se pueden usar marcas, logos o material protegido sin derechos. Evita usar contenido con copyright o elementos de marcas registradas sin autorización.</p>
                <p>• No se pueden subir imágenes o recursos visuales que violen derechos de terceros. Nada de fotos privadas, material obtenido sin permiso o imágenes sensibles.</p>
                <p>• No se pueden generar llamados a acciones dañinas o peligrosas. La plataforma bloquea mensajes que incentiven violencia, vandalismo, discursos extremistas o daño a otros.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoAvatarModal;


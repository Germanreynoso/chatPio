import React, { useState } from 'react';
import { Mic, Users, MessageSquare, Volume2, Music, Clock, Settings, Sparkles, FileAudio, Lightbulb, DollarSign, User, Radio } from 'lucide-react';

interface AudioPodcastModalProps {
  onClose: () => void;
  onSubmit?: (data: any, options?: { preview: boolean, onAudioReady?: (audioData: any) => void }) => Promise<string | void>;
}

const AudioPodcastModal: React.FC<AudioPodcastModalProps> = ({ onClose, onSubmit }) => {
  const [format, setFormat] = useState('conversacion');
  const [participants, setParticipants] = useState([
    { id: 1, name: 'Enrique', voice: 'enrique_clone', role: 'Anfitrión', active: true },
    { id: 2, name: 'Andrea', voice: 'andrea_clone', role: 'Co-anfitriona', active: false }
  ]);
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('profesional');
  const [duration, setDuration] = useState('5');
  const [language, setLanguage] = useState('es');
  const [backgroundMusic, setBackgroundMusic] = useState('ninguna');
  const [scriptStructure, setScriptStructure] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [tone, setTone] = useState('conversacional');
  const [targetAudience, setTargetAudience] = useState('');
  const [callToAction, setCallToAction] = useState('');
  const [selectedModel, setSelectedModel] = useState('elevenlabs');
  const [quality, setQuality] = useState('alta');
  const [includeIntro, setIncludeIntro] = useState(true);
  const [includeOutro, setIncludeOutro] = useState(true);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isEditingScript, setIsEditingScript] = useState(false);
  const [editInstructions, setEditInstructions] = useState('');
  const [isRefiningScript, setIsRefiningScript] = useState(false);

  const formatos = [
    { id: 'monologo', nombre: 'Monólogo', descripcion: 'Una sola voz narrando', participantes: 1 },
    { id: 'conversacion', nombre: 'Conversación', descripcion: 'Diálogo entre dos personas', participantes: 2 },
    { id: 'entrevista', nombre: 'Entrevista', descripcion: 'Formato pregunta-respuesta', participantes: 2 },
    { id: 'mesa_redonda', nombre: 'Mesa redonda', descripcion: 'Múltiples participantes', participantes: 3 },
    { id: 'noticiario', nombre: 'Noticiario', descripcion: 'Formato informativo formal', participantes: 1 }
  ];

  const estilos = [
    { id: 'profesional', nombre: 'Profesional', descripcion: 'Corporativo y formal' },
    { id: 'conversacional', nombre: 'Conversacional', descripcion: 'Cercano y natural' },
    { id: 'educativo', nombre: 'Educativo', descripcion: 'Didáctico y explicativo' },
    { id: 'periodistico', nombre: 'Periodístico', descripcion: 'Informativo y directo' },
    { id: 'marketing', nombre: 'Marketing', descripcion: 'Persuasivo y comercial' },
    { id: 'storytelling', nombre: 'Storytelling', descripcion: 'Narrativo y envolvente' }
  ];

  const tonos = [
    { id: 'conversacional', nombre: 'Conversacional', descripcion: 'Natural y cercano' },
    { id: 'autoritativo', nombre: 'Autoritativo', descripcion: 'Experto y confiable' },
    { id: 'amigable', nombre: 'Amigable', descripcion: 'Cálido y accesible' },
    { id: 'formal', nombre: 'Formal', descripcion: 'Serio y profesional' },
    { id: 'energico', nombre: 'Enérgico', descripcion: 'Dinámico y motivador' },
    { id: 'reflexivo', nombre: 'Reflexivo', descripcion: 'Pausado y pensativo' }
  ];

  const musicaFondo = [
    { id: 'ninguna', nombre: 'Sin música', descripcion: 'Solo voces' },
    { id: 'corporativa', nombre: 'Corporativa', descripcion: 'Instrumental profesional' },
    { id: 'ambient', nombre: 'Ambient', descripcion: 'Sutil y atmosférica' },
    { id: 'tecnologica', nombre: 'Tecnológica', descripcion: 'Moderna y digital' },
    { id: 'inspiracional', nombre: 'Inspiracional', descripcion: 'Motivadora y uplifting' },
    { id: 'personalizada', nombre: 'Personalizada', descripcion: 'Subir archivo específico' }
  ];

  const modelosAudio = [
    { id: 'elevenlabs', nombre: 'ElevenLabs', descripcion: 'Voces naturales, mejor calidad', coste: '0.18', disponible: true },
    { id: 'openai', nombre: 'OpenAI TTS', descripcion: 'Buena calidad, económico', coste: '0.015', disponible: true },
    { id: 'google', nombre: 'Google Cloud TTS', descripcion: 'Multiidioma, estable', coste: '0.004', disponible: true },
    { id: 'speechmatics', nombre: 'Speechmatics', descripcion: 'Contacto directo MMI', coste: '0.02', disponible: true },
    { id: 'deepgram', nombre: 'Deepgram', descripcion: 'Especialista en voz', coste: '0.012', disponible: true }
  ];

  const vocesDisponibles = [
    { id: 'enrique_clone', nombre: 'Enrique (Clonada)', tipo: 'Clonada', descripcion: 'Voz original de Enrique' },
    { id: 'andrea_clone', nombre: 'Andrea (Clonada)', tipo: 'Clonada', descripcion: 'Voz original de Andrea' },
    { id: 'presentador_m', nombre: 'Presentador Masculino', tipo: 'Sintética', descripcion: 'Voz profesional masculina' },
    { id: 'presentadora_f', nombre: 'Presentadora Femenina', tipo: 'Sintética', descripcion: 'Voz profesional femenina' },
    { id: 'locutor_radio', nombre: 'Locutor de Radio', tipo: 'Sintética', descripcion: 'Voz radiofónica clásica' },
    { id: 'joven_dinamica', nombre: 'Joven Dinámica', tipo: 'Sintética', descripcion: 'Voz juvenil y energética' }
  ];

  const handleFormatChange = (formatId: string) => {
    const newFormat = formatos.find(f => f.id === formatId);
    setFormat(formatId);
    if (!newFormat) return;
    const newParticipants = [...participants];
    if (newFormat.participantes === 1) {
      newParticipants.forEach((p, i) => { p.active = i === 0; });
    } else if (newFormat.participantes === 2) {
      newParticipants.forEach((p, i) => { p.active = i < 2; });
    } else {
      newParticipants.forEach((p, i) => { p.active = i < newFormat.participantes; });
    }
    setParticipants(newParticipants);
  };

  const updateParticipant = (id: number, field: string, value: any) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const calcularCoste = () => {
    const modelo = modelosAudio.find(m => m.id === selectedModel);
    const duracionMinutos = parseInt(duration) || 5;
    const costeBase = parseFloat(modelo?.coste || '0.18');
    const costePorMinuto = costeBase * 60;
    const participantesActivos = participants.filter(p => p.active).length;
    const multiplicador = quality === 'maxima' ? 1.5 : quality === 'alta' ? 1.2 : 1;
    const costeTotal = (duracionMinutos * costePorMinuto * participantesActivos * multiplicador).toFixed(2);
    return { total: costeTotal, porMinuto: (costePorMinuto * participantesActivos).toFixed(2) };
  };

  const generarPromptCompleto = () => {
    let prompt = '';
    const formatoInfo = formatos.find(f => f.id === format);
    if (formatoInfo) {
      prompt += `Formato: ${formatoInfo.nombre} - ${formatoInfo.descripcion}. `;
    }
    const participantesActivos = participants.filter(p => p.active);
    prompt += `Participantes: ${participantesActivos.map(p => `${p.name} (${p.role})`).join(', ')}. `;
    if (topic.trim()) prompt += `Tema: ${topic}. `;
    if (scriptStructure.trim()) prompt += `Estructura: ${scriptStructure}. `;
    if (keyPoints.trim()) prompt += `Puntos clave a cubrir: ${keyPoints}. `;
    if (targetAudience.trim()) prompt += `Audiencia: ${targetAudience}. `;
    const estiloInfo = estilos.find(e => e.id === style);
    const tonoInfo = tonos.find(t => t.id === tone);
    if (estiloInfo) prompt += `Estilo: ${estiloInfo.descripcion}. `;
    if (tonoInfo) prompt += `Tono: ${tonoInfo.descripcion}. `;
    if (callToAction.trim()) prompt += `Call to action: ${callToAction}. `;
    prompt += `Duración: ${duration} minutos. `;
    if (backgroundMusic !== 'ninguna') {
      const musicaInfo = musicaFondo.find(m => m.id === backgroundMusic);
      if (musicaInfo) prompt += `Música de fondo: ${musicaInfo.descripcion}. `;
    }
    if (includeIntro) prompt += 'Incluir introducción. ';
    if (includeOutro) prompt += 'Incluir despedida. ';
    return prompt || 'Complete los campos para generar el prompt...';
  };

  const coste = calcularCoste();

  const handleScriptPreview = async () => {
    if (!onSubmit) return;

    setIsGeneratingScript(true);
    setGeneratedScript(null);
    setIsEditingScript(false);
    setEditInstructions('');

    const podcastData = {
      format,
      participants: participants.filter(p => p.active),
      topic,
      style,
      duration: parseInt(duration),
      language,
      backgroundMusic,
      scriptStructure,
      keyPoints,
      tone,
      targetAudience,
      callToAction,
      selectedModel,
      quality,
      includeIntro,
      includeOutro
    };

    try {
      // Generate the complete podcast content (script + audio) and show in main chat
      await onSubmit(podcastData);
      onClose(); // Close the modal after generating
    } catch (error) {
      console.error('Error generating script preview:', error);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleRefineScript = async () => {
    if (!onSubmit || !editInstructions.trim()) return;

    setIsRefiningScript(true);

    const podcastData = {
      format,
      participants: participants.filter(p => p.active),
      topic,
      style,
      duration: parseInt(duration),
      language,
      backgroundMusic,
      scriptStructure,
      keyPoints,
      tone,
      targetAudience,
      callToAction,
      selectedModel,
      quality,
      includeIntro,
      includeOutro,
      currentScript: generatedScript,
      refineInstructions: editInstructions
    };

    try {
      const refinedScript = await onSubmit(podcastData, {
        preview: true,
        onAudioReady: (audioData) => {
          // This won't be called for script preview, but keeping for consistency
        }
      });

      if (refinedScript) {
        setGeneratedScript(refinedScript);
        setIsEditingScript(false);
        setEditInstructions('');
      }
    } catch (error) {
      console.error('Error refining script:', error);
    } finally {
      setIsRefiningScript(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const podcastData = {
      format,
      participants: participants.filter(p => p.active),
      topic,
      style,
      duration: parseInt(duration),
      language,
      backgroundMusic,
      scriptStructure,
      keyPoints,
      tone,
      targetAudience,
      callToAction,
      selectedModel,
      quality,
      includeIntro,
      includeOutro
    };

    if (onSubmit) {
      onSubmit(podcastData);
    }

    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mic className="text-orange-600" />
            Generar audio/podcast profesional
          </h2>
          <p className="text-gray-600 mt-1">Crea contenido de audio con múltiples participantes usando voces clonadas o sintéticas</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-orange-600" />
              <h3 className="font-medium text-orange-900">Generación de audio conversacional</h3>
            </div>
            <p className="text-sm text-orange-700">
              Define el formato, participantes y estructura para crear contenido de audio profesional. Las voces clonadas de Enrique y Andrea están disponibles para uso inmediato.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Radio className="inline w-4 h-4 mr-1" />
              Formato del audio
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {formatos.map((formato) => (
                <div
                  key={formato.id}
                  onClick={() => handleFormatChange(formato.id)}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    format === formato.id 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm">{formato.nombre}</div>
                  <div className="text-xs text-gray-500">{formato.descripcion}</div>
                  <div className="text-xs text-orange-600 mt-1">{formato.participantes} participante(s)</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Users className="inline w-4 h-4 mr-1" />
              Configuración de participantes
            </label>
            <div className="space-y-3">
              {participants.map((participant) => (
                <div 
                  key={participant.id}
                  className={`p-4 border rounded-lg transition-all ${
                    participant.active 
                      ? 'border-orange-300 bg-orange-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                    <div>
                      <input
                        type="checkbox"
                        checked={participant.active}
                        onChange={(e) => updateParticipant(participant.id, 'active', e.target.checked)}
                        className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        value={participant.name}
                        onChange={(e) => updateParticipant(participant.id, 'name', e.target.value)}
                        placeholder="Nombre"
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        disabled={!participant.active}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={participant.role}
                        onChange={(e) => updateParticipant(participant.id, 'role', e.target.value)}
                        placeholder="Rol (ej: Anfitrión)"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        disabled={!participant.active}
                      />
                    </div>
                    <div>
                      <select
                        value={participant.voice}
                        onChange={(e) => updateParticipant(participant.id, 'voice', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        disabled={!participant.active}
                      >
                        {vocesDisponibles.map((voz) => (
                          <option key={voz.id} value={voz.id}>
                            {voz.nombre} ({voz.tipo})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="text-xs text-gray-500">
                      {vocesDisponibles.find(v => v.id === participant.voice)?.descripcion}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Duración (minutos)
              </label>
              <select 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="2">2 minutos</option>
                <option value="5">5 minutos</option>
                <option value="10">10 minutos</option>
                <option value="15">15 minutos</option>
                <option value="20">20 minutos</option>
                <option value="30">30 minutos</option>
                <option value="45">45 minutos</option>
                <option value="60">60 minutos</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Music className="inline w-4 h-4 mr-1" />
                Música de fondo
              </label>
              <select 
                value={backgroundMusic}
                onChange={(e) => setBackgroundMusic(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {musicaFondo.map((musica) => (
                  <option key={musica.id} value={musica.id}>{musica.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Contenido del podcast
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tema principal</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ejemplo: Las tendencias de inteligencia artificial en las empresas canarias durante 2025, sus aplicaciones prácticas y el impacto en la transformación digital del sector..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-h-[80px]"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">{topic.length}/1000 caracteres</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estructura del guión</label>
              <textarea
                value={scriptStructure}
                onChange={(e) => setScriptStructure(e.target.value)}
                placeholder="Ejemplo: 1) Introducción y contexto (2 min), 2) Análisis de casos reales en Canarias (5 min), 3) Entrevista con experto local (8 min), 4) Conclusiones y call to action (2 min), 5) Despedida..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-h-[80px]"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">{scriptStructure.length}/1000 caracteres</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Puntos clave a cubrir</label>
              <textarea
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="Ejemplo: - Estadísticas de adopción de IA en Canarias, - Casos de éxito de MMI Analytics, - Beneficios de la automatización, - Retos comunes y soluciones, - Futuro del sector tecnológico en las islas..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-h-[80px]"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">{keyPoints.length}/1000 caracteres</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Audiencia objetivo</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Ejemplo: Directivos de empresas canarias, emprendedores tecnológicos..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text sm font-medium text-gray-700 mb-2">Call to action</label>
                <input
                  type="text"
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
                  placeholder="Ejemplo: Visita mmi-e.com para más información..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Estilo y tono</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estilo del podcast</label>
                <select 
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {estilos.map((estilo) => (
                    <option key={estilo.id} value={estilo.id}>
                      {estilo.nombre} - {estilo.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tono de la conversación</label>
                <select 
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {tonos.map((tono) => (
                    <option key={tono.id} value={tono.id}>
                      {tono.nombre} - {tono.descripcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuración técnica
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modelo de IA</label>
                <select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {modelosAudio.map((modelo) => (
                    <option key={modelo.id} value={modelo.id}>
                      {modelo.nombre} ({modelo.coste}¢/min)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calidad de audio</label>
                <select 
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="estandar">Estándar (22kHz)</option>
                  <option value="alta">Alta (44kHz)</option>
                  <option value="maxima">Máxima (48kHz)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opciones adicionales</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeIntro}
                      onChange={(e) => setIncludeIntro(e.target.checked)}
                      className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className="text-sm">Incluir introducción</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeOutro}
                      onChange={(e) => setIncludeOutro(e.target.checked)}
                      className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className="text-sm">Incluir despedida</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {generatedScript && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-blue-800 flex items-center">
                  📝 Guion generado
                </h4>
                {!isEditingScript && (
                  <button
                    onClick={() => setIsEditingScript(true)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    ✏️ Editar guion
                  </button>
                )}
              </div>
              <div className="text-sm text-blue-700 bg-white p-3 rounded border max-h-60 overflow-y-auto whitespace-pre-line">
                {generatedScript}
              </div>

              {isEditingScript && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      Instrucciones para editar el guion
                    </label>
                    <textarea
                      value={editInstructions}
                      onChange={(e) => setEditInstructions(e.target.value)}
                      placeholder="Ejemplo: Reduce el tono formal, agrega más humor, cambia el orden de los puntos..."
                      className="w-full p-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                      maxLength={500}
                    />
                    <p className="text-xs text-blue-600 mt-1">
                      {editInstructions.length}/500 caracteres
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleRefineScript}
                      disabled={isRefiningScript || !editInstructions.trim()}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {isRefiningScript ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Refinando...
                        </>
                      ) : (
                        <>
                          ↻ Regenerar guion
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingScript(false);
                        setEditInstructions('');
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2 flex items-center">
              <FileAudio className="w-4 h-4 mr-1" />
              Configuración final del podcast
            </h4>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border max-h-40 overflow-y-auto">
              {generarPromptCompleto()}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2 flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              Información de coste estimado
            </h4>
            <div className="text-sm text-green-700">
              <p><strong>Coste estimado:</strong> ${coste.total} para {duration} minutos</p>
              <p><strong>Coste por minuto:</strong> ${coste.porMinuto} ({participants.filter(p => p.active).length} participante(s))</p>
              <p><strong>Modelo seleccionado:</strong> {modelosAudio.find(m => m.id === selectedModel)?.nombre}</p>
              <p className="text-xs mt-1">ElevenLabs ofrece la mejor calidad para voces clonadas</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-md hover:bg-orange-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generar podcast
            </button>
            <button
              type="button"
              onClick={handleScriptPreview}
              disabled={isGeneratingScript}
              className="bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isGeneratingScript ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generando...
                </>
              ) : (
                'Vista previa guión'
              )}
            </button>
            <button onClick={onClose} className="bg-gray-100 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-200 transition-colors">
              Cancelar
            </button>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-medium text-orange-800 mb-2">🎙️ Tips para audio/podcast profesional</h4>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• <strong>Voces clonadas:</strong> Enrique y Andrea tienen voces entrenadas disponibles</li>
              <li>• <strong>Estructura clara:</strong> Define intro, desarrollo y conclusión para mejor flujo</li>
              <li>• <strong>Conversaciones naturales:</strong> Incluye pausas y transiciones orgánicas</li>
              <li>• <strong>Duración óptima:</strong> 5-15 minutos son ideales para retención de audiencia</li>
              <li>• <strong>Call to action:</strong> Siempre incluye una acción clara al final</li>
              <li>• <strong>ElevenLabs:</strong> Mejor opción para voces naturales y clonadas</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AudioPodcastModal;


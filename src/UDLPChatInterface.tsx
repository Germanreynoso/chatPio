import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { API_CONFIG } from './config/api';
import ImageGenerationModal from './components/image-generator/ImageGenerationModal';

// No olvides cambiar estos valores por los tuyos de Supabase
// Si estás usando una librería de Supabase en tu entorno, esta línea debería funcionar.
// Si no, puedes importar la librería completa desde un CDN si es para un prototipo.
// Para este ejemplo, lo he comentado ya que el entorno de desarrollo no lo tiene.
// import { createClient } from '@supabase/supabase-js';
// const supabaseUrl = 'TU_URL_DE_SUPABASE';
// const supabaseAnonKey = 'TU_KEY_DE_SUPABASE';
// const supabase = createClient(supabaseUrl, supabaseAnonKey);


type MessageType = {
  id: number;
  type: 'bot' | 'user';
  content: string;
  timestamp: string;
  showForm?: boolean;
  showContentForm?: boolean;
  loading?: boolean;
  generatedContent?: GeneratedContentType[];
  showActions?: boolean;
  success?: boolean;
  error?: boolean;
  isEditing?: boolean;
  editedContents?: string[];
  formData?: {
    tema: string;
    mensaje: string;
    contexto: string;
    audiencia: string;
  };
};

type GeneratedContentType = {
  format: string;
  title: string;
  content: string;
};

type RecentContentType = {
  area: string;
  format: string;
  topic: string;
  time: string;
};

const UDLPChatInterface = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 1,
      type: 'bot',
      content: '¡Hola! Soy Pío, estoy aquí para ayudarte a crear contenido 💛💙\n\nEmpecemos eligiendo el área y el tipo de contenido:',
      timestamp: '10:30',
      showForm: true
    }
  ]);
  
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['Español']);
  const [recentContents, setRecentContents] = useState<RecentContentType[]>([
    { area: 'Fundación UD', format: 'Instagram', topic: 'Visita hospital infantil', time: '2h' },
    { area: 'Hospitality', format: 'Nota de prensa', topic: 'Nuevo menú VIP', time: '5h' },
    { area: 'Cantera', format: 'TikTok', topic: 'Entrenamiento juvenil', time: '1d' },
    { area: 'Internacional', format: 'Tweet', topic: 'Acuerdo con Santos FC', time: '2d' }
  ]);
  const [contentFilter, setContentFilter] = useState<string>('Todos');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const languages = ['Español', 'English', 'Deutsch', 'Français', 'العربية'];
  const areas = [
    'Abonados', 'Cantera', 'Creative', 'Escuela', 'eSports', 
    'Fundación UD', 'Hospitality', 'Infraestructuras', 'Internacional', 'Marketing'
  ];
  const formats = [
    'Nota de prensa', 'Tweet', 'Instagram', 'YouTube Shorts', 'TikTok', 'Vídeo con avatar', 'LinkedIn'
  ];
  const contentTypeOptions = [
    'Todos', 'Nota de prensa', 'Tweet', 'Instagram', 'YouTube Shorts', 'TikTok', 'Vídeo con avatar', 'LinkedIn'
  ];

  const audienceOptions = [
    'Aficionados del club',
    'Medios de comunicación',
    'Patrocinadores',
    'Comunidad local',
    'Jóvenes y familias',
    'Aficionados internacionales',
    'Instituciones deportivas'
  ];

  const filteredContents = contentFilter === 'Todos' 
    ? recentContents 
    : recentContents.filter(content => content.format === contentFilter);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (message: Partial<MessageType>) => {
    const newMessage: MessageType = {
      id: Date.now(),
      type: message.type || 'bot',
      content: message.content || '',
      timestamp: new Date().toLocaleTimeString(),
      showForm: message.showForm || false,
      showContentForm: message.showContentForm || false,
      loading: message.loading || false,
      showActions: message.showActions || false,
      success: message.success || false,
      error: message.error || false,
      ...message
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const handleFormatChange = (format: string, checked: boolean) => {
    if (checked) {
      setSelectedFormats(prev => [...prev, format]);
    } else {
      setSelectedFormats(prev => prev.filter(f => f !== format));
    }
  };

  const handleLanguageChange = (language: string, checked: boolean) => {
    if (checked) {
      setSelectedLanguages(prev => [...prev, language]);
    } else {
      setSelectedLanguages(prev => prev.filter(l => l !== language));
    }
  };

  const handleSubmit = () => {
    if (!selectedArea || selectedFormats.length === 0 || selectedLanguages.length === 0) {
      // Manejar el error sin alert
      addMessage({
        type: 'bot',
        content: 'Por favor, selecciona un área, al menos un formato y un idioma para continuar.',
        error: true,
      });
      return;
    }

    const summary = `Área: ${selectedArea}\nFormatos: ${selectedFormats.join(', ')}\nIdiomas: ${selectedLanguages.join(', ')}`;
    addMessage({ type: 'user', content: summary });

    setTimeout(() => {
      addMessage({
        type: 'bot',
        content: 'Perfecto! Ahora necesito más detalles sobre el contenido.',
        showContentForm: true
      });
    }, 500);
  };


  const handleContentSubmit = async (formData: {tema: string; mensaje: string; contexto: string; audiencia: string;}) => {
    const summary = Object.entries(formData)
      .filter(([, value]) => value && value.trim() !== '')
      .map(([field, value]) => {
        const labels: Record<string, string> = {
          tema: 'Tema',
          mensaje: 'Mensaje clave',
          contexto: 'Contexto',
          audiencia: 'Audiencia'
        };
        return `${labels[field] || field}: ${value}`;
      })
      .join('\n');
    
    addMessage({ 
      type: 'user', 
      content: `Detalles:\n${summary}`,
      formData: { ...formData } // Guardar los datos del formulario
    });
    
    setIsGenerating(true);
    addMessage({
      type: 'bot',
      content: '✨ Generando contenido...',
      loading: true
    });

    try {
      // 1. Envía los datos al webhook
      // Usar el método getFullUrl para construir la URL correctamente
      const response = await fetch(API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.CHAT), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          area: selectedArea,
          formats: selectedFormats,
          languages: selectedLanguages,
          details: formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar datos al webhook');
      }

      // 2. Obtener la respuesta del webhook
      const responseData = await response.json();
      
      // 3. Verificar que la respuesta tenga el formato esperado
      if (!responseData?.ok || !responseData.data?.bot_response) {
        console.error('Formato de respuesta inesperado:', responseData);
        throw new Error('Formato de respuesta inválido del servidor');
      }

      // 4. Formatear la respuesta para que coincida con lo que espera la interfaz
      const generatedContent = [{
        format: 'Nota de prensa',
        title: 'Contenido generado',
        content: responseData.data.bot_response
      }];

      // 5. Mostrar el contenido generado
      setMessages(prev => prev.slice(0, -1));
      addMessage({
        type: 'bot',
        content: 'He generado el contenido solicitado:',
        generatedContent: generatedContent,
        showActions: true
      });

      // 5. Actualizar el historial
      const newContent: RecentContentType = {
        area: selectedArea,
        format: selectedFormats.join(', '),
        topic: formData.tema,
        time: 'ahora'
      };
      setRecentContents(prev => [newContent, ...prev.slice(0, 3)]);

    } catch (error) {
      console.error("Error al generar o enviar contenido:", error);
      setMessages(prev => prev.slice(0, -1));
      addMessage({
        type: 'bot',
        content: 'Lo siento, ha ocurrido un error al generar o enviar el contenido. Por favor, inténtalo de nuevo.',
        error: true
      });
    } finally {
      setIsGenerating(false);
    }
  };

  

  const handleAction = (action: string) => {
    if (action === 'approve') {
      addMessage({ type: 'user', content: '✅ Aprobar y usar' });
      addMessage({
        type: 'bot',
        content: '🚀 ¡Contenido aprobado y listo para usar! El contenido ha sido guardado en tu biblioteca.',
        success: true
      });
    } else if (action === 'edit') {
      // Activar modo edición en el último mensaje con contenido generado
      setMessages(prev => {
        const newMessages = [...prev];
        for (let i = newMessages.length - 1; i >= 0; i--) {
          const msg = newMessages[i];
          if (msg.type === 'bot' && msg.generatedContent && msg.generatedContent.length > 0) {
            newMessages[i] = {
              ...msg,
              isEditing: true,
              editedContents: msg.generatedContent.map(g => g.content)
            };
            break;
          }
        }
        return newMessages;
      });
    } else if (action === 'new') {
      addMessage({ type: 'user', content: '🆕 Crear otro contenido' });
      setTimeout(() => {
        addMessage({
          type: 'bot',
          content: 'Empecemos con otro contenido:',
          showForm: true
        });
        setSelectedArea('');
        setSelectedFormats([]);
        setSelectedLanguages(['Español']);
      }, 500);
    }
  };

  const InitialForm: React.FC = () => (
    <div className="space-y-4 bg-udlp-gray p-4 rounded-xl mt-3 shadow-udlp">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Área que necesita comunicar
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-udlp-yellow"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
        >
          <option value="">Seleccionar...</option>
          {areas.map(area => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Formato de salida (puedes seleccionar varios)
        </label>
        <div className="space-y-2">
          {formats.map(format => (
            <div key={format} className="flex items-center">
              <input
                type="checkbox"
                id={format}
                className="h-4 w-4 text-udlp-yellow focus:ring-udlp-yellow border-gray-300 rounded"
                checked={selectedFormats.includes(format)}
                onChange={(e) => handleFormatChange(format, e.target.checked)}
              />
              <label htmlFor={format} className="ml-2 text-sm text-gray-900 cursor-pointer">
                {format}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Idioma de salida (puedes seleccionar varios)
        </label>
        <div className="space-y-2">
          {languages.map(language => (
            <div key={language} className="flex items-center">
              <input
                type="checkbox"
                id={language}
                className="h-4 w-4 text-udlp-yellow focus:ring-udlp-yellow border-gray-300 rounded"
                checked={selectedLanguages.includes(language)}
                onChange={(e) => handleLanguageChange(language, e.target.checked)}
              />
              <label htmlFor={language} className="ml-2 text-sm text-gray-900 cursor-pointer">
                {language}
              </label>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-udlp-yellow text-udlp-dark py-2 px-4 rounded-lg hover:bg-yellow-400 font-medium"
      >
        Continuar
      </button>
    </div>
  );

  const ContentForm: React.FC = () => {
    const [formData, setFormData] = useState<{tema: string; mensaje: string; contexto: string; audiencia: string;}>({
      tema: '',
      mensaje: '',
      contexto: '',
      audiencia: ''
    });

    const handleInputChange = (name: string, value: string) => {
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isValid = formData.tema.trim() !== '' && formData.mensaje.trim() !== '';

    return (
      <div className="space-y-4 bg-udlp-gray p-4 rounded-xl mt-3 shadow-udlp">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tema o asunto principal
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-udlp-yellow"
            placeholder="ej: Programas sociales"
            value={formData.tema}
            onChange={(e) => handleInputChange('tema', e.target.value)}
            maxLength={100}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {formData.tema.length}/100
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mensaje clave que quiere transmitir
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-udlp-yellow"
            placeholder="El punto principal que debe entender la audiencia..."
            value={formData.mensaje}
            onChange={(e) => handleInputChange('mensaje', e.target.value)}
            rows={3}
            maxLength={300}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {formData.mensaje.length}/300
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contexto o detalles adicionales
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-udlp-yellow"
            placeholder="Información de fondo, fechas, personas involucradas..."
            value={formData.contexto}
            onChange={(e) => handleInputChange('contexto', e.target.value)}
            rows={3}
            maxLength={500}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {formData.contexto.length}/500
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Audiencia objetivo
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-udlp-yellow"
            value={formData.audiencia}
            onChange={(e) => handleInputChange('audiencia', e.target.value)}
          >
            <option value="">Seleccionar...</option>
            {audienceOptions.map(audience => (
              <option key={audience} value={audience}>{audience}</option>
            ))}
          </select>
        </div>

        <div>
          <button
            onClick={() => handleContentSubmit(formData)}
            disabled={!isValid || isGenerating}
            className="w-full bg-udlp-yellow text-udlp-dark py-2 px-4 rounded-lg hover:bg-yellow-400 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generando contenido...
              </>
            ) : (
              'Generar contenido'
            )}
          </button>
        </div>
      </div>
    );
  };

  const GeneratedContent: React.FC<{content: GeneratedContentType[]}> = ({ content }) => (
    <div className="mt-4 space-y-4">
      {content.map((item, index) => (
        <div key={index} className="border rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-blue-600">{item.title}</h4>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
              {item.format}
            </span>
          </div>
          <div className="whitespace-pre-line text-sm text-gray-700 bg-gray-50 p-3 rounded">
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans">
      <div className="w-full md:w-80 bg-white shadow-lg flex-shrink-0">
        <div className="p-6 bg-udlp-blue text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded">
              <span className="text-udlp-blue font-bold text-lg">UD</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-udlp-yellow">UD LAS PALMAS</h1>
              <p className="text-sm opacity-90">Centro comunicación inteligente</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Últimos contenidos creados</h3>
              
              <select
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                value={contentFilter}
                onChange={(e) => setContentFilter(e.target.value)}
              >
                {contentTypeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              
              <div className="space-y-3">
                {filteredContents.map((content, index) => (
                  <div key={index} className="p-3 bg-udlp-gray rounded-lg border shadow-udlp">
                    <div className="font-medium text-sm text-gray-900">{content.topic}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      <div>{content.area}</div>
                      <div className="flex justify-between mt-1">
                        <span className="bg-udlp-blue text-white px-2 py-1 rounded text-xs">
                          {content.format}
                        </span>
                        <span>{content.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-2">
                  <span>Suministrado por</span>
                  <div className="bg-udlp-dark text-white px-2 py-1 font-bold rounded-sm">
                    <div>ICC</div>
                    <div>SPORTS</div>
                  </div>
                </div>
                <button 
                  onClick={() => window.open('https://t.me/icc_sports_support_bot', '_blank')}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  🤖 Reportar problema o sugerir mejora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-sm p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="text-udlp-yellow" size={24} />
              <div>
                <h2 className="font-semibold text-gray-900">Pío, asistente de comunicación con IA, v70</h2>
                <p className="text-sm text-gray-600">Especializado en cada área del club</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-sm text-gray-900">Francisco Ortiz</div>
              <div className="text-xs text-gray-600">innovacion.fundacion@udlaspalmas.es</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-4xl ${message.type === 'user' ? 'bg-udlp-yellow text-udlp-dark' : 'bg-white border border-gray-200'} rounded-xl p-4 shadow-sm`}>
                {message.loading && (
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-udlp-yellow" />
                    <span>Generando contenido...</span>
                  </div>
                )}
                
                {!message.loading && (
                  <>
                    <div className="whitespace-pre-line">{message.content}</div>
                    
                    {message.generatedContent && (
                      <GeneratedContent content={message.generatedContent} />
                    )}

                    {message.isEditing && message.generatedContent && Array.isArray(message.editedContents) && (
                      <div className="mt-4 space-y-4">
                        {message.generatedContent.map((item, index) => (
                          <div key={index} className="border rounded-lg p-4 bg-white">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-blue-600">{item.title}</h4>
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                {item.format}
                              </span>
                            </div>
                            <textarea
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-udlp-yellow"
                              rows={8}
                              value={message.editedContents?.[index] ?? ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                setMessages(prev => prev.map(m => {
                                  if (m.id !== message.id) return m;
                                  const updated = m.editedContents ? [...m.editedContents] : [];
                                  updated[index] = value;
                                  return { ...m, editedContents: updated };
                                }));
                              }}
                            />
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setMessages(prev => prev.map(m => {
                                if (m.id !== message.id) return m;
                                if (!m.generatedContent || !m.editedContents) return m;
                                const updatedGenerated = m.generatedContent.map((g, i) => ({
                                  ...g,
                                  content: m.editedContents![i]
                                }));
                                return { ...m, generatedContent: updatedGenerated, isEditing: false };
                              }));
                            }}
                            className="p-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium text-white"
                          >
                            💾 Guardar cambios
                          </button>
                          <button
                            onClick={() => {
                              setMessages(prev => prev.map(m => m.id === message.id ? { ...m, isEditing: false } : m));
                            }}
                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 border border-gray-200"
                          >
                            ✖️ Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {message.success && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <span className="text-green-700 font-medium">¡Contenido aprobado!</span>
                      </div>
                    )}
                    
                    {message.error && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <span className="text-red-700 font-medium">Error al generar contenido</span>
                      </div>
                    )}
                    
                    {message.showForm && <InitialForm />}
                    {message.showContentForm && <ContentForm />}
                    
                    {message.showActions && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <button
                          onClick={() => handleAction('approve')}
                          className="p-3 bg-green-50 hover:bg-green-100 rounded-lg text-sm font-medium text-green-700 border border-green-200"
                        >
                          ✅ Aprobar y usar
                        </button>
                        <button
                          onClick={() => handleAction('edit')}
                          className="p-3 bg-udlp-blue hover:bg-blue-700 rounded-lg text-sm font-medium text-white border border-udlp-blue"
                        >
                          ✏️ Editar contenido
                        </button>
                        <button
                          onClick={() => setShowImageModal(true)}
                          className="p-3 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium text-white"
                        >
                          🖼️ Crear imagen
                        </button>
                        <button
                          onClick={() => handleAction('new')}
                          className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 border border-gray-200"
                        >
                          🆕 Crear otro contenido
                        </button>
                      </div>
                    )}
                  </>
                )}
                
                <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-gray-600' : 'text-gray-500'}`}>
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
    {showImageModal && (
      <ImageGenerationModal onClose={() => setShowImageModal(false)} />
    )}
    </>
  );
};

export default UDLPChatInterface;

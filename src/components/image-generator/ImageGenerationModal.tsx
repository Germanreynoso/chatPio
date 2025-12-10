import React, { useEffect, useState } from 'react';
import { Image, Users, Globe2, Zap, Palette, Eye, Type, Layout, Settings, Sparkles, FileImage, Lightbulb, X } from 'lucide-react';
import imagePreview from '../../assets/image2.jpg';
import { API_CONFIG } from '../../config/api';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { useGlobalError } from '../../contexts/GlobalErrorContext';

export interface ImageGenerationModalProps {
  onClose: () => void;
  initialData?: any;
}

export default function ImageGenerationModal({ onClose, initialData }: ImageGenerationModalProps) {
   const [characters, setCharacters] = useState('');
   const [world, setWorld] = useState('');
   const [action, setAction] = useState('');
   const [visualStyle, setVisualStyle] = useState('');
   const [sensoryElements, setSensoryElements] = useState('');
   const [includeText, setIncludeText] = useState(false);
   const [textContent, setTextContent] = useState('');
   const [textPosition, setTextPosition] = useState('centro');
   const [selectedFormat, setSelectedFormat] = useState('horizontal');
   const [selectedResolution, setSelectedResolution] = useState('1920x1080');
   const [selectedPlatform, setSelectedPlatform] = useState('general');
   const [selectedModel, setSelectedModel] = useState('imagen4');
   const [quality, setQuality] = useState('alta');
   const [imageUrl, setImageUrl] = useState<string | null>(null);
   const [showPreview, setShowPreview] = useState(false);
   const [isGenerating, setIsGenerating] = useState(false);
   const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
   const [generatedMessage, setGeneratedMessage] = useState<string>('');

   const { handleError } = useErrorHandler('image-generation');
   const { showError } = useGlobalError();

  // Prefill fields when initialData is provided
  useEffect(() => {
    if (!initialData) return;
    const d = initialData;
    // Keys as labels from backend (Spanish phrases)
    if (typeof d["Define tus personajes/sujetos principales"] === 'string') setCharacters(d["Define tus personajes/sujetos principales"]);
    if (typeof d["Construye el escenario/mundo"] === 'string') setWorld(d["Construye el escenario/mundo"]);
    if (typeof d["Define la acción/composición detallada"] === 'string') setAction(d["Define la acción/composición detallada"]);
    if (typeof d["Define el estilo visual único"] === 'string') setVisualStyle(d["Define el estilo visual único"]);
    if (typeof d["Elementos sensoriales/ambientales"] === 'string') setSensoryElements(d["Elementos sensoriales/ambientales"]);

    if (typeof d.characters === 'string') setCharacters(d.characters);
    if (typeof d.personajes === 'string') setCharacters(d.personajes);
    if (typeof d.world === 'string') setWorld(d.world);
    if (typeof d.escenario === 'string') setWorld(d.escenario);
    if (typeof d.action === 'string') setAction(d.action);
    if (typeof d.composicion === 'string') setAction(d.composicion);
    if (typeof d.visualStyle === 'string') setVisualStyle(d.visualStyle);
    if (typeof d.estilo === 'string') setVisualStyle(d.estilo);
    if (typeof d.sensoryElements === 'string') setSensoryElements(d.sensoryElements);
    if (typeof d.sensorial === 'string') setSensoryElements(d.sensorial);
    if (typeof d.includeText === 'boolean') setIncludeText(d.includeText);
    if (typeof d.incluirTexto === 'boolean') setIncludeText(d.incluirTexto);
    if (typeof d.textContent === 'string') setTextContent(d.textContent);
    if (typeof d.texto === 'string') setTextContent(d.texto);
    if (typeof d.textPosition === 'string') setTextPosition(d.textPosition);
    if (typeof d.posicionTexto === 'string') setTextPosition(d.posicionTexto);
    // Map incoming human-readable format to internal id
    const mapFormatLabelToId = (val: string): string | null => {
      const v = val.toLowerCase();
      if (v.includes('horizontal')) return 'horizontal';
      if (v.includes('vertical')) return 'vertical';
      if (v.includes('cuadrado') || v.includes('1:1')) return 'cuadrado';
      if (v.includes('banner') || v.includes('3:1')) return 'banner';
      if (v.includes('personal')) return 'personalizado';
      return null;
    };
    if (typeof d.selectedFormat === 'string') {
      const id = mapFormatLabelToId(d.selectedFormat) || d.selectedFormat;
      handleFormatChange(id);
    }
    if (typeof d.formato === 'string') {
      const id = mapFormatLabelToId(d.formato) || d.formato;
      handleFormatChange(id);
    }
    if (typeof d.selectedResolution === 'string') setSelectedResolution(d.selectedResolution);
    if (typeof d.resolucion === 'string') setSelectedResolution(d.resolucion);
    // Platforms mapping (ids: general, instagram, linkedin, twitter, web, print)
    const mapPlatformToId = (val: string): string => {
      const v = (val || '').toString().toLowerCase();
      if (v.includes('instagram')) return 'instagram';
      if (v.includes('linkedin')) return 'linkedin';
      if (v.includes('twitter') || v === 'x') return 'twitter';
      if (v.includes('web') || v.includes('sitio')) return 'web';
      if (v.includes('impres')) return 'print';
      return 'general';
    };
    if (typeof d.selectedPlatform === 'string') setSelectedPlatform(mapPlatformToId(d.selectedPlatform));
    if (typeof d.plataforma === 'string') setSelectedPlatform(mapPlatformToId(d.plataforma));
    if (typeof d.plataforma_destino === 'string') setSelectedPlatform(mapPlatformToId(d.plataforma_destino));
    if (typeof d.selectedModel === 'string') setSelectedModel(d.selectedModel);
    if (typeof d.modelo === 'string') setSelectedModel(d.modelo);
    if (typeof d.quality === 'string') setQuality(d.quality);
    if (typeof d.calidad === 'string') setQuality(d.calidad);
  }, [initialData]);
  useEffect(() => {
  fetch("https://n8n.icc-e.org/webhook/8585afbe-52ba-44e2-b000-6d4028b1b250") // ← URL de tu flujo en n8n
    .then((res) => res.json())
    .then((data) => setImageUrl(data.imageUrl))
    .catch((err) => console.error("Error obteniendo la imagen:", err));
}, []);


  const formatos = [
    { id: 'horizontal', nombre: 'Horizontal (16:9)', resolucion: '1920x1080', uso: 'YouTube, LinkedIn, web' },
    { id: 'vertical', nombre: 'Vertical (9:16)', resolucion: '1080x1920', uso: 'Stories, TikTok, móvil' },
    { id: 'cuadrado', nombre: 'Cuadrado (1:1)', resolucion: '1024x1024', uso: 'Instagram, Facebook' },
    { id: 'banner', nombre: 'Banner (3:1)', resolucion: '1200x400', uso: 'Portadas, headers' },
    { id: 'personalizado', nombre: 'Personalizado', resolucion: 'custom', uso: 'Dimensiones específicas' }
  ];

  const plataformas = [
    { id: 'general', nombre: 'Uso general', optimizacion: 'Equilibrado para múltiples usos' },
    { id: 'instagram', nombre: 'Instagram', optimizacion: 'Colores vibrantes, alta saturación' },
    { id: 'linkedin', nombre: 'LinkedIn', optimizacion: 'Profesional, colores corporativos' },
    { id: 'twitter', nombre: 'Twitter/X', optimizacion: 'Alto contraste, legible en miniatura' },
    { id: 'web', nombre: 'Sitio web', optimizacion: 'SEO friendly, carga rápida' },
    { id: 'print', nombre: 'Impresión', optimizacion: 'Alta resolución, CMYK compatible' }
  ];

  const modelos = [
    { id: 'imagen4', nombre: 'Google Imagen 4', descripcion: 'Excelente con texto, último modelo', coste: '0.02$' },
    { id: 'dalle3', nombre: 'DALL-E 3', descripcion: 'OpenAI, buena creatividad', coste: '0.04$' },
    { id: 'midjourney', nombre: 'Midjourney v6', descripcion: 'Artístico y detallado', coste: '0.03$' },
    { id: 'banana', nombre: 'Nano Banana', descripcion: 'Rápido y económico', coste: '0.01$' }
  ];

  const handleFormatChange = (formatId: string) => {
    const format = formatos.find(f => f.id === formatId);
    setSelectedFormat(formatId);
    if (format && format.resolucion !== 'custom') {
      setSelectedResolution(format.resolucion);
    }
  };

  const generarPromptCompleto = () => {
    const sections: string[] = [];
    if (characters.trim()) sections.push(`Personajes/Sujetos: ${characters}`);
    if (world.trim()) sections.push(`Escenario/Mundo: ${world}`);
    if (action.trim()) sections.push(`Acción/Composición: ${action}`);
    if (visualStyle.trim()) sections.push(`Estilo Visual: ${visualStyle}`);
    if (sensoryElements.trim()) sections.push(`Elementos Sensoriales: ${sensoryElements}`);
    if (includeText && textContent.trim()) sections.push(`Texto a incluir: "${textContent}" (posición: ${textPosition})`);
    return sections.join('. ') || 'Complete los campos para generar el prompt...';
  };

  const handleGenerateImage = async () => {
    const formData = {
      characters,
      world,
      action,
      visualStyle,
      sensoryElements,
      includeText,
      textContent,
      textPosition,
      selectedFormat,
      selectedResolution,
      selectedPlatform,
      selectedModel,
      quality,
      promptCompleto: generarPromptCompleto()
    };

    console.log('Enviando datos al webhook:', formData);
    setIsGenerating(true);

    try {
      const response = await fetch(API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.IMAGE_GENERATION), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Respuesta del webhook:', response.status, response.statusText);

      if (response.ok) {
        try {
          const result = await response.json();
          console.log('Imagen generada exitosamente:', result);

          // Extraer el mensaje del bot_response
          const message = result.data?.bot_response;
          if (message) {
            setGeneratedMessage(message);
            setShowPreview(true);
          } else {
            handleError(new Error('Imagen generada, pero no se pudo obtener el mensaje'));
            showError();
          }
        } catch (jsonError) {
          console.error('Error al parsear JSON:', jsonError);
          // Si no es JSON válido, intentar obtener como texto plano
          const textResponse = await response.text();
          console.log('Respuesta como texto:', textResponse);
          if (textResponse) {
            setGeneratedMessage(textResponse);
            setShowPreview(true);
          } else {
            handleError(new Error('Imagen generada, pero la respuesta no es válida'));
            showError();
          }
        }
      } else {
        const errorText = await response.text();
        console.error('Error al generar la imagen:', response.statusText, errorText);
        handleError(new Error(`Error al generar la imagen: ${response.statusText}`));
        showError();
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      handleError(error);
      showError();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-w-5xl w-full mx-4 bg-white rounded-2xl shadow-udlp-lg ring-1 ring-gray-200 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-white rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Image className="text-udlp-blue" />
            Generar imagen con prompting efectivo
          </h2>
          <p className="text-sm text-gray-600 mt-1">Usa los 5 principios de prompting efectivo para crear imágenes profesionales de alta calidad</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-blue-900">5 tips para prompting efectivo</h3>
            </div>
            <p className="text-sm text-blue-800">
              Completa cada sección con detalles específicos para obtener mejores resultados. Cuanta más información proporciones, más precisa será la imagen generada.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors bg-white">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Users className="inline w-5 h-5 mr-2 text-udlp-blue" />
              1. Define tus personajes/sujetos principales
            </label>
            <textarea
              value={characters}
              onChange={(e) => setCharacters(e.target.value)}
              placeholder="Ejemplo: Un empresario de 40 años con traje azul marino, expresión confiada y postura profesional. Cabello corto y gafas modernas. Una mujer joven con laptop, vestimenta casual-elegante..."
              className="w-full p-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-md focus:ring-2 focus:ring-udlp-yellow focus:border-udlp-yellow min-h-[80px]"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              Describe apariencia, vestimenta, expresiones, posturas y características específicas. {characters.length}/500 caracteres
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors bg-white">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Globe2 className="inline w-5 h-5 mr-2 text-udlp-blue" />
              2. Construye el escenario/mundo
            </label>
            <textarea
              value={world}
              onChange={(e) => setWorld(e.target.value)}
              placeholder="Ejemplo: Oficina moderna con ventanales amplios, iluminación natural suave, plantas verdes, escritorios de madera clara, ambiente minimalista y profesional. Ciudad al fondo..."
              className="w-full p-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-md focus:ring-2 focus:ring-udlp-yellow focus:border-udlp-yellow min-h-[80px]"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              Describe el entorno, iluminación, textura, atmósfera y detalles del escenario. {world.length}/500 caracteres
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors bg-white">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Zap className="inline w-5 h-5 mr-2 text-udlp-blue" />
              3. Define la acción/composición detallada
            </label>
            <textarea
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="Ejemplo: Los personajes están en una reunión colaborativa, uno señalando una presentación en pantalla, otros tomando notas. Composición en regla de tercios, perspectiva ligeramente elevada..."
              className="w-full p-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-md focus:ring-2 focus:ring-udlp-yellow focus:border-udlp-yellow min-h-[80px]"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              Especifica qué están haciendo, cómo están posicionados, ángulos de cámara y composición. {action.length}/500 caracteres
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors bg-white">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Palette className="inline w-5 h-5 mr-2 text-udlp-blue" />
              4. Define el estilo visual único
            </label>
            <textarea
              value={visualStyle}
              onChange={(e) => setVisualStyle(e.target.value)}
              placeholder="Ejemplo: Fotografía corporativa profesional, estilo realista, colores corporativos azul y blanco, acabado limpio y moderno, similar a campañas de LinkedIn..."
              className="w-full p-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-md focus:ring-2 focus:ring-udlp-yellow focus:border-udlp-yellow min-h-[80px]"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              ¿Es realista, ilustrado, fotográfico? ¿Qué estilo artístico o referencia visual? {visualStyle.length}/500 caracteres
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors bg-white">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Eye className="inline w-5 h-5 mr-2 text-udlp-blue" />
              5. Elementos sensoriales/ambientales
            </label>
            <textarea
              value={sensoryElements}
              onChange={(e) => setSensoryElements(e.target.value)}
              placeholder="Ejemplo: Sensación de productividad y colaboración, textura suave en materiales, luz cálida de atardecer, colores que transmiten confianza y profesionalidad..."
              className="w-full p-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-md focus:ring-2 focus:ring-udlp-yellow focus:border-udlp-yellow min-h-[80px]"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              Describe texturas, mood, sensaciones, temperatura de color, emociones que debe transmitir. {sensoryElements.length}/500 caracteres
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="includeText"
                checked={includeText}
                onChange={(e) => setIncludeText(e.target.checked)}
                className="mr-3 h-4 w-4 text-udlp-yellow focus:ring-udlp-yellow border-gray-300 rounded"
              />
              <label htmlFor="includeText" className="text-sm font-medium text-gray-700 flex items-center">
                <Type className="inline w-4 h-4 mr-1 text-udlp-blue" />
                Incluir texto en la imagen
              </label>
            </div>
            {includeText && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Texto a incluir</label>
                  <input
                    type="text"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Ejemplo: MMI Analytics, Innovación que Transforma, etc."
                    className="w-full p-2 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-md focus:ring-2 focus:ring-udlp-yellow focus:border-udlp-yellow"
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Posición del texto</label>
                  <select 
                    value={textPosition}
                    onChange={(e) => setTextPosition(e.target.value)}
                    className="w-full p-2 border border-gray-300 bg-white text-gray-900 rounded-md focus:ring-2 focus:ring-udlp-yellow focus:border-udlp-yellow"
                  >
                    <option value="centro">Centro</option>
                    <option value="superior">Parte superior</option>
                    <option value="inferior">Parte inferior</option>
                    <option value="izquierda">Izquierda</option>
                    <option value="derecha">Derecha</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Layout className="inline w-4 h-4 mr-1 text-udlp-blue" />
              Formato y dimensiones
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Formato</label>
                <select 
                  value={selectedFormat}
                  onChange={(e) => handleFormatChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 bg-white text-gray-900 rounded-md focus:ring-2 focus:ring-udlp-yellow focus:border-udlp-yellow"
                >
                  {formatos.map((formato) => (
                    <option key={formato.id} value={formato.id}>
                      {formato.nombre} - {formato.uso}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resolución</label>
                <input
                  type="text"
                  value={selectedResolution}
                  onChange={(e) => setSelectedResolution(e.target.value)}
                  disabled={selectedFormat !== 'personalizado'}
                  className="w-full p-2 border border-gray-300 bg-white text-gray-900 rounded-md focus:ring-2 focus:ring-udlp-yellow focus:border-udlp-yellow disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="1920x1080"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Settings className="w-5 h-5 text-udlp-blue" />
              Configuración técnica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plataforma destino</label>
                <select 
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full p-2 border border-gray-300 bg-white text-gray-900 rounded-md focus:ring-2 focus:ring-udlp-yellow focus:border-udlp-yellow"
                >
                  {plataformas.map((plat) => (
                    <option key={plat.id} value={plat.id}>{plat.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modelo de IA</label>
                <select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full p-2 border border-gray-300 bg-white text-gray-900 rounded-md focus:ring-2 focus:ring-udlp-yellow focus:border-udlp-yellow"
                >
                  {modelos.map((modelo) => (
                    <option key={modelo.id} value={modelo.id}>
                      {modelo.nombre} ({modelo.coste})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calidad</label>
                <select 
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full p-2 border border-gray-300 bg-white text-gray-900 rounded-md focus:ring-2 focus:ring-udlp-yellow focus:border-udlp-yellow"
                >
                  <option value="estandar">Estándar (más rápido)</option>
                  <option value="alta">Alta (recomendado)</option>
                  <option value="maxima">Máxima (más lento)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <FileImage className="w-4 h-4 mr-1 text-udlp-blue" />
              Prompt final generado
            </h4>
            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border max-h-40 overflow-y-auto">
              {generarPromptCompleto()}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">💰 Información de coste</h4>
            <p className="text-sm text-green-700">
              Coste estimado: {modelos.find(m => m.id === selectedModel)?.coste} por imagen generada.
              {quality === 'maxima' && ' Calidad máxima puede aumentar el coste un 50%.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleGenerateImage}
              disabled={isGenerating}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generar imagen
                </>
              )}
            </button>
            <button
              onClick={() => setShowPreview(true)}
              disabled={!generatedMessage}
              className="bg-udlp-blue text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              type="button"
            >
              <Eye className="w-4 h-4" />
              {generatedMessage ? 'Ver resultado' : 'Vista previa'}
            </button>
            
            {showPreview && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold">Imagen generada</h3>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-4 flex justify-center">
                    {generatedMessage ? (
                      <div className="text-center max-w-2xl">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-green-800">Imagen generada exitosamente</span>
                          </div>
                          <div className="text-left">
                            <p className="text-green-700 whitespace-pre-line">
                              {generatedMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={imagePreview}
                        alt="Vista previa"
                        className="max-w-full h-auto max-h-[70vh] object-contain"
                      />
                    )}
                  </div>
                  <div className="p-4 border-t flex justify-end">
                    <button
                      onClick={() => setShowPreview(false)}
                      className="bg-udlp-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button onClick={onClose} className="bg-gray-100 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-200 transition-colors border border-gray-200">
              Cancelar
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">💡 Tips adicionales para mejores resultados</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Sé específico:</strong> "Luz natural suave" es mejor que "buena iluminación"</li>
              <li>• <strong>Usa referencias:</strong> "Estilo corporativo como LinkedIn" da contexto claro</li>
              <li>• <strong>Para logos/texto:</strong> Google Imagen 4 tiene el mejor rendimiento</li>
              <li>• <strong>Combina elementos:</strong> Cada campo se suma para crear el prompt final</li>
              <li>• <strong>Experimenta:</strong> Puedes ajustar cualquier campo y regenerar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


# PioChat - Centro de Comunicación Inteligente UD Las Palmas

Una plataforma de comunicación inteligente impulsada por IA que permite a los equipos de comunicación del club generar contenido de alta calidad de manera eficiente y automatizada.

## 🚀 Características Principales

- **🤖 Asistente IA Conversacional**: Interfaz de chat inteligente especializada en cada área del club
- **📝 Generación de Contenido**: Creación automática de notas de prensa, posts en redes sociales, contenido web
- **🎨 Generación de Imágenes**: Creación de imágenes personalizadas con IA
- **🎵 Podcasts y Audio**: Generación de guiones y audio para podcasts
- **🎬 Videos con Avatar**: Creación de videos profesionales con presentadores virtuales
- **🔐 Sistema de Autenticación**: Control de acceso por roles y áreas
- **📊 Dashboard Administrativo**: Panel de control para administradores
- **📱 Diseño Responsive**: Funciona en desktop y dispositivos móviles

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** - Framework principal
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **React Router** - Navegación
- **Lucide React** - Iconos

### Backend & APIs
- **n8n** - Automatización de workflows y webhooks
- **ElevenLabs** - Generación de audio
- **Synthesia** - Videos con avatar
- **HeyGen** - Videos con avatar alternativo
- **OpenAI/DALL-E** - Generación de imágenes

### Infraestructura
- **Vercel/Netlify** - Despliegue (producción)
- **Vite Proxy** - Proxy para desarrollo local

## 📋 Requisitos Previos

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Git**

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd chatPio
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Configuración de API
VITE_API_BASE_URL=https://n8n.icc-e.org

# Webhooks de n8n
VITE_WEBHOOK_LOGIN=/webhook-test/login
VITE_WEBHOOK_IMAGE_GENERATION=/webhook/607039ee-6cd4-4a8f-a344-b419521a2067
VITE_WEBHOOK_VIDEO_GENERATION=/webhook/44f0bb9d-0331-4f86-a741-617ea1121769
VITE_WEBHOOK_AVATAR_VIDEO_GENERATION=/webhook-test/7049ac67-d242-4c7d-86d0-6e8d0038b8dd
VITE_WEBHOOK_SYNTHESIA_VIDEO_GENERATION=/webhook-test/7fe6fe12-9bd7-40c0-98b4-c6b8c4c3a13a
VITE_WEBHOOK_CHAT=/webhook/8585afbe-52ba-44e2-b000-6d4028b1b250

# Configuración de desarrollo
VITE_DEV_PROXY_TARGET=https://n8n.icc-e.org

# Debug
VITE_DEBUG=true
```

### 4. Iniciar servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Estructura del Proyecto

```
src/
├── components/                 # Componentes reutilizables
│   ├── audio/                  # Componentes de audio/podcast
│   ├── image-generator/        # Generación de imágenes
│   ├── video/                  # Videos con avatar y generación
│   ├── LoadingSpinner.tsx      # Spinner de carga
│   ├── ProtectedRoute.tsx      # Rutas protegidas
│   └── ...
├── contexts/                   # Contextos de React
│   └── AuthContext.tsx         # Gestión de autenticación
├── pages/                      # Páginas principales
│   ├── Login.tsx              # Página de login
│   ├── UserDashboard.tsx      # Dashboard de usuario
│   ├── AdminDashboard.tsx     # Dashboard administrativo
│   └── ...
├── types/                     # Definiciones TypeScript
│   └── auth.ts                # Tipos de autenticación
├── config/                    # Configuración
│   └── api.ts                 # Configuración de APIs
├── App.tsx                    # Componente principal
├── App.css                    # Estilos globales
├── main.tsx                   # Punto de entrada
└── UDLPChatInterface.tsx      # Interfaz principal de chat
```

## 🔐 Sistema de Autenticación

### Roles de Usuario
- **User**: Acceso básico a la interfaz de chat
- **Admin**: Acceso al dashboard administrativo
- **Superadmin**: Control total del sistema

### Áreas del Club
- Abonados
- Cantera
- Creative
- Escuela
- eSports
- Fundación UD
- Hospitality
- Infraestructuras
- Internacional
- Marketing

## 🎯 Funcionalidades

### Interfaz de Chat (Pío)
- Conversación natural con IA especializada
- Selección de área y tipo de contenido
- Generación automática de contenido
- Modo de edición conversacional
- Historial de contenidos generados

### Tipos de Contenido
- **Nota de prensa**: Artículos periodísticos con diferentes longitudes
- **Redes sociales**: Posts optimizados para X, LinkedIn, Instagram, Facebook
- **Audio/Podcast**: Guiones y generación de audio con ElevenLabs
- **Video con avatar**: Videos con presentadores virtuales (Synthesia/HeyGen)
- **Imágenes**: Generación de imágenes con IA

### Gestión de Contenido
- Vista previa antes de generación final
- Edición y refinamiento conversacional
- Aprobación de contenido
- Historial y biblioteca de contenidos

## 🔧 Configuración de Desarrollo

### Proxy para APIs
El proyecto usa un proxy de Vite para desarrollo local:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'https://n8n.icc-e.org',
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, ''),
    }
  }
}
```

### Variables de Entorno
- `VITE_API_BASE_URL`: URL base de la API de n8n
- `VITE_WEBHOOK_*`: URLs específicas de cada webhook
- `VITE_DEBUG`: Habilitar logs de debug

## 🚀 Despliegue

### Producción
```bash
npm run build
npm run preview
```

### Variables de Entorno en Producción
Asegurarse de configurar las variables de entorno en el proveedor de hosting (Vercel, Netlify, etc.).

## 📊 Dashboard Administrativo

Accesible para usuarios con rol `admin` o superior:
- Gestión de usuarios
- Estadísticas de uso
- Configuración del sistema
- Monitoreo de webhooks

## 🔗 APIs y Webhooks

### Endpoints Principales
- `POST /webhook-test/login` - Autenticación
- `POST /webhook/8585afbe-52ba-44e2-b000-6d4028b1b250` - Chat principal
- `POST /webhook/607039ee-6cd4-4a8f-a344-b419521a2067` - Generación de imágenes
- `POST /webhook/44f0bb9d-0331-4f86-a741-617ea1121769` - Generación de videos
- `POST /webhook-test/d5a0a76f-fd93-4624-bf1f-6d4c760bfb62` - Aceptar video Synthesia
- `POST /webhook/7fe6fe12-9bd7-40c0-98b4-c6b8c4c3a13a` - Regenerar guion Synthesia

### Formato de Respuesta Esperado
```json
{
  "ok": true,
  "data": {
    "bot_response": "Contenido generado",
    "image_prompt_data": "...",
    "audio_base64": "...",
    "audio_mime_type": "audio/mpeg"
  }
}
```

## 🐛 Solución de Problemas

### Error "body stream already read"
- **Síntoma**: Error al hacer múltiples llamadas fetch
- **Solución**: Leer `response.text()` solo una vez y almacenar el resultado

### Videos Synthesia sin respuesta
- **Síntoma**: Respuesta vacía del servidor
- **Solución**: Verificar configuración del webhook en n8n

### Problemas de autenticación
- **Síntoma**: No puede iniciar sesión
- **Solución**: Verificar configuración del webhook de login en n8n

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📝 Licencia

Este proyecto es propiedad de UD Las Palmas. Todos los derechos reservados.

## 📞 Soporte

Para soporte técnico:
- **Bot de soporte**: [@icc_sports_support_bot](https://t.me/icc_sports_support_bot)
- **Email**: innovacion.fundacion@udlaspalmas.es

## 🏆 Créditos

Desarrollado por el equipo de Innovación de la Fundación UD Las Palmas en colaboración con ICC Sports.

---

**Versión**: 7.0
**Última actualización**: Diciembre 2024

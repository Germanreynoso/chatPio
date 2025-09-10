import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { API_CONFIG } from '../config/api';
import type { User, UserRole, AuthResponse } from '../types/auth';

// Los tipos ahora se importan desde ../types/auth

// Tiempo de expiración de la sesión en milisegundos (8 horas)
const SESSION_EXPIRATION_TIME = 8 * 60 * 60 * 1000;

type StoredAuthData = {
  user: User;
  token: string;
  timestamp: number;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
  getKnowledgeBaseConfig: () => { id: string; endpoint: string } | null;
};

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isAuthenticated = !!user;

  // Cargar datos de autenticación guardados al iniciar la aplicación
  useEffect(() => {
    const loadAuthData = () => {
      const storedAuth = localStorage.getItem('auth');
      if (!storedAuth) return;

      try {
        const authData: StoredAuthData = JSON.parse(storedAuth);
        const currentTime = new Date().getTime();
        
        // Verificar si la sesión ha expirado
        if (currentTime - authData.timestamp > SESSION_EXPIRATION_TIME) {
          console.log('La sesión ha expirado');
          localStorage.removeItem('auth');
          return;
        }

        // Actualizar el timestamp de la sesión
        authData.timestamp = currentTime;
        localStorage.setItem('auth', JSON.stringify(authData));
        
        setUser(authData.user);
      } catch (error) {
        console.error('Error al cargar datos de autenticación:', error);
        localStorage.removeItem('auth');
      }
    };

    loadAuthData();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseData: AuthResponse = await response.json();

      if (!response.ok || !responseData.ok) {
        throw new Error(responseData.message || 'Error en la autenticación');
      }

      // Mapear la respuesta del servidor al formato de usuario
      const areaName = responseData.data.area || 'default';
      const userData: User = {
        id: responseData.data.id,
        name: responseData.data.email.split('@')[0],
        email: responseData.data.email,
        role: 'user', // Por defecto, ajustar según la respuesta del servidor si es necesario
        areas: [{
          id: 1, // Este ID podría venir del servidor
          name: areaName,
          description: `Área de ${areaName}`,
          knowledgeBaseId: `kb_${areaName.toLowerCase().replace(/\s+/g, '_')}`
        }]
      };

      // Guardar en localStorage
      const authData = {
        user: userData,
        token: responseData.token || 'dummy-token',
        timestamp: new Date().getTime()
      };
      
      localStorage.setItem('auth', JSON.stringify(authData));
      setUser(userData);
      return true;

    } catch (error) {
      console.error('Error en login:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('La solicitud está tardando demasiado. Por favor, verifica tu conexión e inténtalo de nuevo.');
        }
        throw error;
      }
      throw new Error('Ocurrió un error inesperado al intentar iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth');
  }, []);

  const hasPermission = useCallback((requiredRole: UserRole): boolean => {
    if (!user) return false;
    
    const roleHierarchy: Record<UserRole, number> = {
      superadmin: 3,
      admin: 2,
      user: 1
    };
    
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }, [user]);

  const getKnowledgeBaseConfig = useCallback(() => {
    if (!user || user.areas.length === 0) return null;
    
    // Por simplicidad, tomamos la primera área del usuario
    const area = user.areas[0];
    
    return {
      id: area.knowledgeBaseId,
      endpoint: `https://api.ejemplo.com/kb/${area.knowledgeBaseId}`
    };
  }, [user]);

  return (
    <AuthContext.Provider 
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        hasPermission,
        getKnowledgeBaseConfig
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

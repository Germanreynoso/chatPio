import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { API_CONFIG, ENV } from '../config/api';
import type { User, UserRole, AuthResponse } from '../types/auth';
import { supabase } from '../services/supabaseService';

// Los tipos ahora se importan desde ../types/auth


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
  const [user, setUser] = useState<User | null>(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const authData: StoredAuthData = JSON.parse(storedAuth);
        return authData.user;
      } catch (error) {
        console.error('Error al cargar datos de autenticación:', error);
        localStorage.removeItem('auth');
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isAuthenticated = !!user;

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Hardcoded admin credentials for testing - bypass server
      if (email === 'admin@admin.com' && password === 'admin123') {
        const userData: User = {
          id: 'admin-1',
          name: 'Admin',
          email: 'admin@admin.com',
          role: 'admin',
          areas: [{
            id: 1,
            name: 'Admin Area',
            description: 'Área de administración',
            knowledgeBaseId: 'kb_admin'
          }]
        };

        const authData = {
          user: userData,
          token: 'admin-token',
          timestamp: new Date().getTime()
        };

        localStorage.setItem('auth', JSON.stringify(authData));
        setUser(userData);
        return true;
      }

      // Usar Supabase para autenticación
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('No se pudo obtener la información del usuario');
      }

      // Mapear el usuario de Supabase al formato de usuario personalizado
      const userData: User = {
        id: data.user.id,
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Usuario',
        email: data.user.email || '',
        role: (data.user.user_metadata?.role as UserRole) || 'user',
        areas: data.user.user_metadata?.areas || [{
          id: 1,
          name: 'Default',
          description: 'Área por defecto',
          knowledgeBaseId: 'kb_default'
        }]
      };

      // Guardar en localStorage
      const authData = {
        user: userData,
        token: data.session?.access_token || 'token',
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

  const logout = useCallback(async () => {
    setUser(null);
    localStorage.removeItem('auth');
    await supabase.auth.signOut();
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

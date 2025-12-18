import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { XCircleIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica del formulario
    if (!email || !password) {
      setError('Por favor, ingresa tu correo y contraseña');
      return;
    }

    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        // Navegar a la página solicitada o a la página por defecto
        navigate(from, { replace: true });
      }
    } catch (err) {
      let errorMessage = 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';

      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión a Internet.';
        } else if (err.message.includes('timed out')) {
          errorMessage = 'La solicitud está tardando demasiado. Por favor, inténtalo de nuevo más tarde.';
        } else {
          errorMessage = err.message || errorMessage;
        }
      }

      setError(errorMessage);
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-udlp-blue/10 to-transparent -z-10"></div>

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-udlp-yellow rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-yellow-200">
            <span className="text-3xl font-bold text-udlp-blue">P</span>
          </div>
          <h2 className="text-3xl font-bold text-udlp-dark tracking-tight">
            Bienvenido a PioChat
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-100 animate-fade-in">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-udlp-blue/20 focus:border-udlp-blue transition-all sm:text-sm"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-udlp-blue/20 focus:border-udlp-blue transition-all sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-udlp-blue hover:text-blue-700 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-udlp-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-udlp-blue disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 transition-all hover:shadow-blue-300 hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" color="text-white" className="mr-2" />
                  Iniciando sesión...
                </div>
              ) : 'Iniciar sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

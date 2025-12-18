import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import FormExamplesModal from '../components/FormExamplesModal';
import { FileText, Eye, BarChart3 } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [showExamplesModal, setShowExamplesModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-udlp-dark tracking-tight">
            Panel de Usuario
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Bienvenido, <span className="font-semibold text-udlp-blue">{user?.name}</span>. Aquí puedes acceder a tus herramientas principales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="bg-white overflow-hidden shadow-sm border border-gray-100 rounded-2xl hover:shadow-md transition-all duration-300 group">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-udlp-blue/10 rounded-xl flex items-center justify-center group-hover:bg-udlp-blue/20 transition-colors">
                    <svg className="w-6 h-6 text-udlp-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-udlp-dark group-hover:text-udlp-blue transition-colors">
                    Chat Interactivo
                  </h3>
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-6">
                Conversa con el asistente para generar contenido, ideas y más.
              </p>
              <Link
                to="/chat"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl text-white bg-udlp-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-udlp-blue transition-all shadow-sm hover:shadow-md"
              >
                Ir al Chat
              </Link>
            </div>
          </div>

          {/* Form Examples */}
          <div className="bg-white overflow-hidden shadow-sm border border-gray-100 rounded-2xl hover:shadow-md transition-all duration-300 group">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <FileText className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-udlp-dark group-hover:text-emerald-600 transition-colors">
                    Ejemplos
                  </h3>
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-6">
                Explora ejemplos de formularios y contenido para inspirarte.
              </p>
              <button
                onClick={() => setShowExamplesModal(true)}
                className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver Ejemplos
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div className="bg-white overflow-hidden shadow-sm border border-gray-100 rounded-2xl hover:shadow-md transition-all duration-300 group">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-udlp-yellow/20 rounded-xl flex items-center justify-center group-hover:bg-udlp-yellow/30 transition-colors">
                    <BarChart3 className="w-6 h-6 text-yellow-700" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-udlp-dark group-hover:text-yellow-700 transition-colors">
                    Métricas
                  </h3>
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-6">
                Visualiza el rendimiento y estadísticas de uso del sistema.
              </p>
              <button
                onClick={() => navigate("/metrics")}
                className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl text-yellow-800 bg-udlp-yellow/20 hover:bg-udlp-yellow/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-udlp-yellow transition-colors"
              >
                Ir a Métricas
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Examples Modal */}
      {showExamplesModal && (
        <FormExamplesModal onClose={() => setShowExamplesModal(false)} />
      )}
    </div>
  );
};

export default UserDashboard;
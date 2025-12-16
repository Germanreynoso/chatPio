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
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-b border-gray-200 pb-5">
            <h1 className="text-3xl font-bold text-gray-900">
              Panel de Usuario
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Bienvenido, {user?.name}. Aquí puedes acceder a tus herramientas principales.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Chat Interactivo
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Conversa con el asistente
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-5">
                  <Link
                    to="/chat"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Ir al Chat
                  </Link>
                </div>
              </div>
            </div>

            {/* Form Examples */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Ejemplos de Formularios
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Aprende con ejemplos
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-5">
                  <button
                    onClick={() => setShowExamplesModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Ejemplos
                  </button>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Métricas
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Dashboard de métricas
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-5">
                  <button
                    onClick={() => navigate("/metrics")}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ir a Métricas
                  </button>
                </div>
              </div>
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
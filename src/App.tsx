// Importaciones de React y rutas
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ServiceStatusProvider } from './contexts/ServiceStatusContext';
import { GlobalErrorProvider, useGlobalError } from './contexts/GlobalErrorContext';
import { setGlobalErrorNotifier } from './utils/errorLogger';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorNotification from './components/ErrorNotification';
import UDLPChatInterface from './UDLPChatInterface';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ServiceStatusPage from './pages/ServiceStatusPage';
import MetricsDashboard from './pages/MetricsDashboard';
import './App.css';

// Componente de ruta raíz que redirige según la autenticación y rol
const RootRedirect = () => {
  const { isAuthenticated, user, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirigir según el rol del usuario
  if (hasPermission('admin')) {
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    return <Navigate to="/user/dashboard" replace />;
  }
};

// Componente de navegación de ejemplo
const Navbar = () => {
  const { user, logout } = useAuth();
  const { showError } = useGlobalError();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">PioChat</span>
            </div>
          </div>
          {user && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate("/metrics")}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Métricas
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const { isErrorVisible, errorMessage, hideError, showError } = useGlobalError();

  // Initialize global error notifier
  React.useEffect(() => {
    setGlobalErrorNotifier(showError);
  }, [showError]);

  // Test button - remove this after testing
  const testError = () => {
    showError("Servicio momentáneamente no disponible");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Navbar />}
      <ErrorNotification
        message={errorMessage}
        isVisible={isErrorVisible}
        onClose={hideError}
      />
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Rutas protegidas */}
            <Route path="/chat" element={
              <ProtectedRoute>
                <UDLPChatInterface />
              </ProtectedRoute>
            } />

            <Route path="/metrics" element={
              <ProtectedRoute>
                <MetricsDashboard />
              </ProtectedRoute>
            } />

            {/* Rutas de dashboard por rol */}
            <Route path="/user/dashboard" element={
              <ProtectedRoute requiredRole="user">
                <UserDashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/status" element={
              <ProtectedRoute>
                <ServiceStatusPage />
              </ProtectedRoute>
            } />

            {/* Ruta de redirección para rutas no encontradas */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <GlobalErrorProvider>
        <AuthProvider>
          <ServiceStatusProvider>
            <AppContent />
          </ServiceStatusProvider>
        </AuthProvider>
      </GlobalErrorProvider>
    </Router>
  );
}

export default App;
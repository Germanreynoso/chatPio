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
  const { isAuthenticated, hasPermission } = useAuth();

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

// Componente de navegación
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-udlp-yellow rounded-lg flex items-center justify-center mr-2.5 shadow-sm">
                <span className="text-udlp-blue font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-udlp-dark tracking-tight">PioChat</span>
            </div>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/metrics")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-udlp-blue bg-blue-50 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-udlp-blue"
              >
                Métricas
              </button>
              <div className="h-6 w-px bg-gray-200 mx-1"></div>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg text-slate-600 bg-white hover:bg-gray-50 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
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
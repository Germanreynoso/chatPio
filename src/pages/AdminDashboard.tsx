import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_CONFIG } from '../config/api';
import LoadingSpinner from '../components/LoadingSpinner';
import type { User } from '../types/auth';

interface UserFormData {
  name: string;
  email: string;
  password: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([
    // Usuarios hardcodeados para demo
    {
      id: 'admin-001',
      name: 'Admin Demo',
      email: 'admin@piodemo.com',
      role: 'admin',
      areas: [{
        id: 1,
        name: 'Administración',
        description: 'Panel de administración',
        knowledgeBaseId: 'kb_admin'
      }]
    },
    {
      id: 'user-001',
      name: 'Juan Pérez',
      email: 'juan@piodemo.com',
      role: 'user',
      areas: [{
        id: 2,
        name: 'Ventas',
        description: 'Área de ventas',
        knowledgeBaseId: 'kb_ventas'
      }]
    },
    {
      id: 'user-002',
      name: 'María García',
      email: 'maria@piodemo.com',
      role: 'user',
      areas: [{
        id: 3,
        name: 'Soporte',
        description: 'Área de soporte técnico',
        knowledgeBaseId: 'kb_soporte'
      }]
    }
  ]);
  const [loading, setLoading] = useState(false); // Cambiado a false ya que tenemos datos hardcodeados
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // Cargar lista de usuarios (comentado ya que usamos datos hardcodeados)
  // useEffect(() => {
  //   loadUsers();
  // }, []);

  // const loadUsers = async () => {
  //   try {
  //     const response = await fetch(`${API_CONFIG.BASE_URL}/webhook/users`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')!).token : ''}`
  //       }
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setUsers(data.users || []);
  //     }
  //   } catch (error) {
  //     console.error('Error loading users:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Simular creación de usuario (hardcodeado)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay de API

      // Crear nuevo usuario con ID único
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: 'user',
        areas: [{
          id: Math.floor(Math.random() * 1000),
          name: 'Nuevo Usuario',
          description: `Usuario creado por ${user?.name}`,
          knowledgeBaseId: `kb_${formData.name.toLowerCase().replace(/\s+/g, '_')}`
        }]
      };

      // Agregar usuario a la lista
      setUsers(prevUsers => [...prevUsers, newUser]);

      // Limpiar formulario
      setFormData({ name: '', email: '', password: '' });
      setShowCreateForm(false);

      // Mostrar mensaje de éxito (temporal)
      alert(`Usuario ${formData.name} creado exitosamente!`);

    } catch (error) {
      setError('Error al crear usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    // Prevenir eliminación del propio admin
    if (userId === 'admin-001') {
      alert('No puedes eliminar tu propio usuario administrador');
      return;
    }

    if (!confirm(`¿Estás seguro de que quieres eliminar al usuario "${userName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setDeletingUserId(userId);

    try {
      // Simular eliminación (delay de API)
      await new Promise(resolve => setTimeout(resolve, 800));

      // Eliminar usuario de la lista
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));

      alert(`Usuario "${userName}" eliminado exitosamente`);

    } catch (error) {
      alert('Error al eliminar usuario');
    } finally {
      setDeletingUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-b border-gray-200 pb-5">
            <h1 className="text-3xl font-bold text-gray-900">
              Panel de Administrador
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Bienvenido, {user?.name}. Gestiona usuarios y configura el sistema.
            </p>
          </div>

          {/* Create User Button */}
          <div className="mt-8">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {showCreateForm ? 'Cancelar' : 'Crear Nuevo Usuario'}
            </button>
          </div>

          {/* Create User Form */}
          {showCreateForm && (
            <div className="mt-6 bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Crear Nuevo Usuario
                </h3>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  {error && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="text-sm text-red-800">{error}</div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      id="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {submitting ? <LoadingSpinner size="sm" color="text-white" className="mr-2" /> : null}
                      Crear Usuario
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Users List */}
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Usuarios del Sistema
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Lista de todos los usuarios registrados
              </p>
            </div>
            <ul className="divide-y divide-gray-200">
              {users.map((userItem) => (
                <li key={userItem.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {userItem.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{userItem.name}</div>
                          <div className="text-sm text-gray-500">{userItem.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          userItem.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          userItem.role === 'superadmin' ? 'bg-red-100 text-red-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {userItem.role}
                        </span>
                        <span className="text-sm text-gray-500">
                          {userItem.areas[0]?.name || 'Sin área'}
                        </span>
                        {/* Botón de eliminar - solo para usuarios que no sean el admin actual */}
                        {userItem.id !== 'admin-001' && (
                          <button
                            onClick={() => handleDeleteUser(String(userItem.id), userItem.name)}
                            disabled={deletingUserId === userItem.id}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingUserId === userItem.id ? (
                              <LoadingSpinner size="sm" color="text-red-700" className="mr-1" />
                            ) : (
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                            {deletingUserId === userItem.id ? 'Eliminando...' : 'Eliminar'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {users.length === 0 && (
                <li>
                  <div className="px-4 py-8 text-center text-gray-500">
                    No hay usuarios registrados
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
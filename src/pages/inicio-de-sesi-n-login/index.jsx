import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import LoginForm from './components/LoginForm';
import AuthHeader from './components/AuthHeader';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock credentials for different user types
  const mockCredentials = {
    teacher: {
      email: 'profesor@mathtest.com',
      password: 'profesor123'
    },
    student: {
      email: 'estudiante@mathtest.com',
      password: 'estudiante123'
    }
  };

  const handleLogin = async (formData) => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const { email, password } = formData;

      // Check teacher credentials
      if (email === mockCredentials.teacher.email && password === mockCredentials.teacher.password) {
        // Store user session (in real app, this would be handled by auth service)
        localStorage.setItem('userRole', 'teacher');
        localStorage.setItem('userEmail', email);
        navigate('/panel-del-profesor');
        return;
      }

      // Check student credentials
      if (email === mockCredentials.student.email && password === mockCredentials.student.password) {
        localStorage.setItem('userRole', 'student');
        localStorage.setItem('userEmail', email);
        navigate('/dashboard-del-estudiante');
        return;
      }

      // Invalid credentials
      setError('Credenciales incorrectas. Verifica tu alias y contraseña.');
    } catch (err) {
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <AuthHeader />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Bienvenido
            </h1>
            <p className="text-text-secondary">
              Inicia sesión para acceder a tu cuenta
            </p>
          </div>

          {/* Login Form */}
          <div className="card">
            <LoginForm 
              onSubmit={handleLogin}
              isLoading={isLoading}
              error={error}
            />
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-secondary-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <h4 className="font-medium text-text-primary mb-2">
                  Credenciales de demostración:
                </h4>
                <div className="space-y-2 text-text-secondary">
                  <div>
                    <strong>Profesor:</strong> profesor@mathtest.com / profesor123
                  </div>
                  <div>
                    <strong>Estudiante:</strong> estudiante@mathtest.com / estudiante123
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-border bg-surface">
        <div className="max-w-md mx-auto text-center">
          <p className="text-sm text-text-secondary">
            © {new Date().getFullYear()} MathPractice Pro. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
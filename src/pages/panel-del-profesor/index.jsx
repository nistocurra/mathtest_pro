import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RoleBasedHeader from 'components/ui/RoleBasedHeader';
import BreadcrumbNavigation from 'components/ui/BreadcrumbNavigation';

import Icon from 'components/AppIcon';
import RecentActivity from './components/RecentActivity';
import MetricsCard from './components/MetricsCard';

const TeacherPanel = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock data for teacher dashboard
  const teacherData = {
    name: "Prof. María González",
    email: "maria.gonzalez@mathtest.edu"
  };

  const dashboardMetrics = [
    {
      id: 1,
      title: "Exámenes Activos",
      value: 8,
      icon: "FileText",
      color: "primary",
      change: "+2 esta semana",
      changeType: "positive"
    },
    {
      id: 2,
      title: "Estudiantes Registrados",
      value: 142,
      icon: "Users",
      color: "accent",
      change: "+5 este mes",
      changeType: "positive"
    },
    {
      id: 3,
      title: "Exámenes Completados Hoy",
      value: 23,
      icon: "CheckCircle",
      color: "success",
      change: "↑ 15% vs ayer",
      changeType: "positive"
    },
    {
      id: 4,
      title: "Promedio General",
      value: "7.8",
      icon: "TrendingUp",
      color: "warning",
      change: "↑ 0.3 este mes",
      changeType: "positive",
      suffix: "/10"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      studentName: "Ana Martínez",
      examTitle: "Álgebra Básica - Unidad 3",
      score: 8.5,
      maxScore: 10,
      completedAt: new Date(Date.now() - 1800000), // 30 minutes ago
      duration: "25 min",
      status: "completed"
    },
    {
      id: 2,
      studentName: "Carlos Rodríguez",
      examTitle: "Geometría - Teorema de Pitágoras",
      score: 9.2,
      maxScore: 10,
      completedAt: new Date(Date.now() - 3600000), // 1 hour ago
      duration: "18 min",
      status: "completed"
    },
    {
      id: 3,
      studentName: "Lucía Fernández",
      examTitle: "Cálculo Diferencial - Límites",
      score: 7.1,
      maxScore: 10,
      completedAt: new Date(Date.now() - 5400000), // 1.5 hours ago
      duration: "32 min",
      status: "completed"
    },
    {
      id: 4,
      studentName: "Diego Morales",
      examTitle: "Estadística - Probabilidad",
      score: 6.8,
      maxScore: 10,
      completedAt: new Date(Date.now() - 7200000), // 2 hours ago
      duration: "28 min",
      status: "completed"
    },
    {
      id: 5,
      studentName: "Isabella Torres",
      examTitle: "Álgebra Lineal - Matrices",
      score: 9.5,
      maxScore: 10,
      completedAt: new Date(Date.now() - 10800000), // 3 hours ago
      duration: "22 min",
      status: "completed"
    }
  ];

  const quickActions = [
    {
      title: "Crear Nuevo Examen",
      description: "Diseña un examen desde cero con preguntas personalizadas",
      icon: "Plus",
      path: "/gesti-n-de-ex-menes",
      color: "primary",
      featured: true
    },
    {
      title: "Subir Archivo de Examen",
      description: "Importa exámenes desde archivos de texto estructurados",
      icon: "Upload",
      path: "/gesti-n-de-ex-menes",
      color: "secondary"
    },
    {
      title: "Gestionar Estudiantes",
      description: "Administra cuentas y permisos de estudiantes",
      icon: "Users",
      path: "/gesti-n-de-estudiantes",
      color: "accent"
    },
    {
      title: "Ver Todos los Resultados",
      description: "Analiza el rendimiento detallado de todos los exámenes",
      icon: "BarChart3",
      path: "/panel-del-profesor",
      color: "success"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader userRole="teacher" userName={teacherData.name} />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation />
          
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  ¡Bienvenido, {teacherData.name.split(' ')[1]}!
                </h1>
                <p className="text-text-secondary">
                  {formatDate(currentTime)} • {formatTime(currentTime)}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link
                  to="/gesti-n-de-ex-menes"
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Icon name="Plus" size={20} />
                  <span>Crear Examen</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardMetrics.map((metric) => (
              <MetricsCard key={metric.id} metric={metric} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions - Mobile: Full width, Desktop: 2 columns */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-text-primary">
                    Acciones Rápidas
                  </h2>
                  <Icon name="Zap" size={20} className="text-primary" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      to={action.path}
                      className={`
                        group p-4 rounded-lg border transition-all duration-200 ease-in-out
                        ${action.featured 
                          ? 'bg-primary text-white border-primary hover:bg-primary-700' :'bg-surface border-border hover:border-primary hover:bg-primary-50'
                        }
                        hover:shadow-md hover:scale-105 active:scale-98
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                      `}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`
                          p-2 rounded-md transition-colors duration-200 ease-in-out
                          ${action.featured 
                            ? 'bg-white bg-opacity-20' :'bg-primary-100 group-hover:bg-primary'
                          }
                        `}>
                          <Icon 
                            name={action.icon} 
                            size={20} 
                            className={action.featured ? 'text-white' : 'text-primary group-hover:text-white'}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`
                            font-medium mb-1 truncate
                            ${action.featured ? 'text-white' : 'text-text-primary'}
                          `}>
                            {action.title}
                          </h3>
                          <p className={`
                            text-sm
                            ${action.featured ? 'text-white text-opacity-90' : 'text-text-secondary'}
                          `}>
                            {action.description}
                          </p>
                        </div>
                        <Icon 
                          name="ArrowRight" 
                          size={16} 
                          className={`
                            transition-transform duration-200 ease-in-out group-hover:translate-x-1
                            ${action.featured ? 'text-white' : 'text-primary'}
                          `}
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity - Mobile: Full width, Desktop: 1 column */}
            <div className="lg:col-span-1">
              <RecentActivity activities={recentActivities} />
            </div>
          </div>

          {/* Additional Statistics Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performance Overview */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  Rendimiento Semanal
                </h3>
                <Icon name="TrendingUp" size={20} className="text-success" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Exámenes completados</span>
                  <span className="font-medium text-text-primary">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Promedio de calificación</span>
                  <span className="font-medium text-success">7.8/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Tiempo promedio</span>
                  <span className="font-medium text-text-primary">24 min</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2 mt-4">
                  <div className="bg-success h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  Estado del Sistema
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm text-success font-medium">Operativo</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Servidor</span>
                  <span className="text-success font-medium">En línea</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Base de datos</span>
                  <span className="text-success font-medium">Conectada</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Última actualización</span>
                  <span className="text-text-secondary text-sm">Hace 2 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherPanel;
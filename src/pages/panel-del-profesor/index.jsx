import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RoleBasedHeader from 'components/ui/RoleBasedHeader';
import BreadcrumbNavigation from 'components/ui/BreadcrumbNavigation';
import { useAuth } from 'context/AuthContext';
import practiceService from 'services/practiceService';
import studentService from 'services/studentService';

import Icon from 'components/AppIcon';
import RecentActivity from './components/RecentActivity';
import MetricsCard from './components/MetricsCard';

const TeacherPanel = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState({
    activePractices: 0,
    totalStudents: 0,
    completedToday: 0,
    averageScore: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userProfile, updateLastAccess } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        updateLastAccess();
        
        // Load practices and students in parallel
        const [practices, students] = await Promise.all([
          practiceService.getPractices(),
          studentService.getStudents()
        ]);

        // Calculate metrics
        const activePractices = practices.filter(p => p.is_active).length;
        const totalStudents = students.length;
        
        // Get recent practice attempts
        let allAttempts = [];
        for (const practice of practices) {
          try {
            const attempts = await practiceService.getPracticeAttempts(practice.id);
            allAttempts = [...allAttempts, ...attempts];
          } catch (err) {
            console.log('Error loading attempts for practice:', practice.id);
          }
        }

        // Filter today's completed attempts
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const completedToday = allAttempts.filter(attempt => {
          const completedDate = new Date(attempt.completed_at);
          return completedDate >= today && attempt.status === 'completed';
        }).length;

        // Calculate average score
        const completedAttempts = allAttempts.filter(a => a.status === 'completed');
        const averageScore = completedAttempts.length > 0 ?
          Math.round(completedAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / completedAttempts.length * 10) / 10 :
          0;

        setDashboardData({
          activePractices,
          totalStudents,
          completedToday,
          averageScore
        });

        // Set recent activities (last 5 completed attempts)
        const sortedAttempts = allAttempts
          .filter(a => a.status === 'completed')
          .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
          .slice(0, 5)
          .map(attempt => ({
            id: attempt.id,
            studentName: attempt.student?.full_name || attempt.student?.alias || 'Estudiante',
            examTitle: attempt.practice?.title || 'Práctica',
            score: attempt.score || 0,
            maxScore: 100,
            completedAt: new Date(attempt.completed_at),
            duration: `${attempt.time_spent_minutes || 0} min`,
            status: 'completed'
          }));

        setRecentActivities(sortedAttempts);
      } catch (error) {
        console.log('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [updateLastAccess]);

  const dashboardMetrics = [
    {
      id: 1,
      title: "Prácticas Activas",
      value: dashboardData.activePractices,
      icon: "FileText",
      color: "primary",
      change: "+2 esta semana",
      changeType: "positive"
    },
    {
      id: 2,
      title: "Estudiantes Registrados",
      value: dashboardData.totalStudents,
      icon: "Users",
      color: "accent",
      change: "+5 este mes",
      changeType: "positive"
    },
    {
      id: 3,
      title: "Prácticas Completadas Hoy",
      value: dashboardData.completedToday,
      icon: "CheckCircle",
      color: "success",
      change: "↑ 15% vs ayer",
      changeType: "positive"
    },
    {
      id: 4,
      title: "Promedio General",
      value: dashboardData.averageScore.toString(),
      icon: "TrendingUp",
      color: "warning",
      change: "↑ 0.3 este mes",
      changeType: "positive",
      suffix: "/100"
    }
  ];

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <RoleBasedHeader userRole="teacher" userName={userProfile?.full_name || 'Profesor'} />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="text-text-secondary">Cargando panel del profesor...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader userRole="teacher" userName={userProfile?.full_name || 'Profesor'} />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation />
          
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  ¡Bienvenido, {userProfile?.full_name?.split(' ')[1] || 'Profesor'}!
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
                  <span>Crear Práctica</span>
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
            {/* Recent Activity - Mobile: Full width, Desktop: 1 column */}
            <div className="lg:col-span-1">
              <RecentActivity activities={recentActivities} />
            </div>

            {/* Additional Statistics Section */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <span className="text-text-secondary">Prácticas completadas</span>
                      <span className="font-medium text-text-primary">{dashboardData.completedToday * 7}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Promedio de calificación</span>
                      <span className="font-medium text-success">{dashboardData.averageScore}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Estudiantes activos</span>
                      <span className="font-medium text-text-primary">{dashboardData.totalStudents}</span>
                    </div>
                    <div className="w-full bg-secondary-200 rounded-full h-2 mt-4">
                      <div className="bg-success h-2 rounded-full" style={{ width: `${Math.min(dashboardData.averageScore, 100)}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">
                      Acceso Rápido
                    </h3>
                    <Icon name="Zap" size={20} className="text-primary" />
                  </div>
                  <div className="space-y-3">
                    <Link
                      to="/gesti-n-de-ex-menes"
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary hover:bg-primary-50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon name="FileText" size={16} className="text-primary" />
                        <span className="text-text-primary">Gestión de Prácticas</span>
                      </div>
                      <Icon name="ArrowRight" size={16} className="text-text-secondary" />
                    </Link>
                    <Link
                      to="/gesti-n-de-estudiantes"
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary hover:bg-primary-50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon name="Users" size={16} className="text-primary" />
                        <span className="text-text-primary">Gestión de Estudiantes</span>
                      </div>
                      <Icon name="ArrowRight" size={16} className="text-text-secondary" />
                    </Link>
                    <Link
                      to="/gesti-n-de-grupos"
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary hover:bg-primary-50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon name="UserPlus" size={16} className="text-primary" />
                        <span className="text-text-primary">Gestión de Grupos</span>
                      </div>
                      <Icon name="ArrowRight" size={16} className="text-text-secondary" />
                    </Link>
                  </div>
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
import React, { useState, useEffect } from 'react';

import RoleBasedHeader from 'components/ui/RoleBasedHeader';
import BreadcrumbNavigation from 'components/ui/BreadcrumbNavigation';
import QuickActionMenu from 'components/ui/QuickActionMenu';
import Icon from 'components/AppIcon';
import { useAuth } from 'context/AuthContext';

import AvailableExams from './components/AvailableExams';
import ProgressOverview from './components/ProgressOverview';
import RecentActivity from './components/RecentActivity';
import StudentNameEditor from './components/StudentNameEditor';

const StudentDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const { userProfile, updateLastAccess } = useAuth();

  // Mock student data enhanced with real profile data
  const studentData = {
    id: userProfile?.id || 1,
    name: userProfile?.full_name || "Estudiante",
    email: userProfile?.email || "estudiante@ejemplo.com",
    grade: userProfile?.grade_level || "Sin asignar",
    overallAverage: 87.5,
    completedExams: 12,
    totalExams: 15,
    streak: 5
  };

  // Mock notifications
  const mockNotifications = [
    {
      id: 1,
      type: "new_exam",
      title: "Nueva Práctica Disponible",
      message: "Álgebra Lineal - Sistemas de Ecuaciones está disponible",
      timestamp: new Date(Date.now() - 3600000),
      isRead: false
    },
    {
      id: 2,
      type: "deadline",
      title: "Fecha Límite Próxima",
      message: "La práctica de Geometría vence en 2 días",
      timestamp: new Date(Date.now() - 7200000),
      isRead: false
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    setNotifications(mockNotifications);

    // Update last access when component mounts
    if (updateLastAccess) {
      updateLastAccess();
    }

    return () => clearInterval(timer);
  }, [updateLastAccess]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleNameUpdate = (newName) => {
    // This will be handled by the AuthContext and will update userProfile automatically
    console.log('Name updated to:', newName);
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader userRole="student" userName={studentData.name} />
      
      <main className="pt-16 lg:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation />
          
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-primary to-primary-700 rounded-lg p-6 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-xl sm:text-2xl font-medium">
                      {getGreeting()},
                    </h1>
                  </div>
                  <StudentNameEditor 
                    currentName={studentData.name}
                    onNameUpdate={handleNameUpdate}
                  />
                  <p className="text-primary-100 text-sm sm:text-base mt-2">
                    {formatDate(currentTime)}
                  </p>
                  <p className="text-primary-100 text-sm mt-1">
                    {studentData.grade} • Promedio General: {studentData.overallAverage}%
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{studentData.completedExams}</div>
                    <div className="text-primary-100 text-sm">Completados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{studentData.streak}</div>
                    <div className="text-primary-100 text-sm">Racha</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          {unreadNotifications.length > 0 && (
            <div className="mb-8">
              <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Bell" size={20} className="text-warning-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-warning-800 mb-2">
                      Notificaciones ({unreadNotifications.length})
                    </h3>
                    <div className="space-y-2">
                      {unreadNotifications.slice(0, 2).map((notification) => (
                        <div key={notification.id} className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-warning-800">
                              {notification.title}
                            </p>
                            <p className="text-sm text-warning-700">
                              {notification.message}
                            </p>
                          </div>
                          <button
                            onClick={() => markNotificationAsRead(notification.id)}
                            className="ml-2 text-warning-600 hover:text-warning-800 transition-colors duration-200 ease-in-out"
                          >
                            <Icon name="X" size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Available Practices */}
            <div className="lg:col-span-2">
              <AvailableExams />
            </div>

            {/* Right Column - Progress & Stats */}
            <div className="space-y-8">
              <ProgressOverview studentData={studentData} />
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mt-8">
            <RecentActivity />
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <QuickActionMenu userRole="student" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
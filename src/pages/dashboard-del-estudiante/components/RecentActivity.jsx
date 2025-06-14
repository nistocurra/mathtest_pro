import React from 'react';
import Icon from 'components/AppIcon';

const RecentActivity = () => {
  // Mock recent activity data
  const recentActivities = [
    {
      id: 1,
      type: 'exam_completed',
      title: 'Examen completado',
      description: 'Cálculo Diferencial - Límites',
      score: 92,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success-50'
    },
    {
      id: 2,
      type: 'exam_started',
      title: 'Examen iniciado',
      description: 'Geometría - Teorema de Pitágoras',
      progress: 60,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      icon: 'Play',
      color: 'text-warning-600',
      bgColor: 'bg-warning-50'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Logro desbloqueado',
      description: 'Maestro del Álgebra - 5 exámenes consecutivos con +90%',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      icon: 'Award',
      color: 'text-primary',
      bgColor: 'bg-primary-50'
    },
    {
      id: 4,
      type: 'exam_assigned',
      title: 'Nuevo examen disponible',
      description: 'Estadística - Probabilidad Básica',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      icon: 'FileText',
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100'
    },
    {
      id: 5,
      type: 'study_streak',
      title: 'Racha de estudio',
      description: '5 días consecutivos de actividad',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      icon: 'Flame',
      color: 'text-warning',
      bgColor: 'bg-warning-50'
    }
  ];

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);
    
    if (diffInSeconds < 60) return 'Hace un momento';
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
    return timestamp.toLocaleDateString('es-ES');
  };

  const getActivityDetails = (activity) => {
    switch (activity.type) {
      case 'exam_completed':
        return (
          <div className="flex items-center space-x-2 mt-1">
            <Icon name="Star" size={14} className="text-warning" />
            <span className="text-sm font-medium text-success">
              Calificación: {activity.score}%
            </span>
          </div>
        );
      case 'exam_started':
        return (
          <div className="flex items-center space-x-2 mt-1">
            <div className="w-16 bg-secondary-200 rounded-full h-1.5">
              <div
                className="bg-warning h-1.5 rounded-full transition-all duration-300 ease-smooth"
                style={{ width: `${activity.progress}%` }}
              ></div>
            </div>
            <span className="text-xs text-text-secondary">
              {activity.progress}% completado
            </span>
          </div>
        );
      case 'exam_assigned':
        return (
          <div className="mt-1">
            <span className="text-xs text-text-secondary">
              Vence: {activity.dueDate.toLocaleDateString('es-ES')}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-text-primary">Actividad Reciente</h3>
        <button className="text-sm text-primary hover:text-primary-700 font-medium transition-colors duration-200 ease-in-out">
          Ver todo
        </button>
      </div>

      <div className="bg-surface rounded-lg border border-border">
        <div className="divide-y divide-border">
          {recentActivities.map((activity, index) => (
            <div key={activity.id} className="p-4 hover:bg-secondary-50 transition-colors duration-200 ease-in-out">
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${activity.bgColor}`}>
                  <Icon name={activity.icon} size={16} className={activity.color} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-text-primary truncate">
                      {activity.title}
                    </h4>
                    <span className="text-xs text-text-secondary whitespace-nowrap ml-2">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-text-secondary mt-1 truncate">
                    {activity.description}
                  </p>
                  
                  {getActivityDetails(activity)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Calendar" size={16} className="text-primary" />
            <span className="text-sm text-text-secondary">Esta Semana</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">3</div>
          <div className="text-xs text-text-secondary">Exámenes completados</div>
        </div>
        
        <div className="bg-surface rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Trophy" size={16} className="text-warning" />
            <span className="text-sm text-text-secondary">Logros</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">2</div>
          <div className="text-xs text-text-secondary">Nuevos este mes</div>
        </div>
        
        <div className="bg-surface rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Flame" size={16} className="text-error" />
            <span className="text-sm text-text-secondary">Racha Actual</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">5</div>
          <div className="text-xs text-text-secondary">Días consecutivos</div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg border border-primary-200 p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-primary mb-1">
              ¡Sigue así!
            </h4>
            <p className="text-sm text-text-secondary">
              Has completado 3 exámenes esta semana con un promedio del 89%. 
              Mantén el ritmo para alcanzar tu objetivo mensual.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
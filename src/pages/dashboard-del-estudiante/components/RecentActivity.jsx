import React from 'react';
import Icon from 'components/AppIcon';

const RecentActivity = () => {
  // Mock recent activity data
  const recentActivities = [
    {
      id: 1,
      type: 'practice_completed',
      title: 'Práctica Completada',
      description: 'Álgebra Básica - Ecuaciones Lineales',
      score: 92,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      icon: 'CheckCircle',
      iconColor: 'text-success',
      bgColor: 'bg-success-50',
      borderColor: 'border-success-200'
    },
    {
      id: 2,
      type: 'practice_started',
      title: 'Práctica Iniciada',
      description: 'Geometría - Teorema de Pitágoras',
      progress: 45,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      icon: 'Play',
      iconColor: 'text-primary',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200'
    },
    {
      id: 3,
      type: 'milestone_reached',
      title: 'Meta Alcanzada',
      description: 'Has completado 10 prácticas este mes',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      icon: 'Trophy',
      iconColor: 'text-warning',
      bgColor: 'bg-warning-50',
      borderColor: 'border-warning-200'
    },
    {
      id: 4,
      type: 'practice_assigned',
      title: 'Nueva Práctica Asignada',
      description: 'Estadística - Probabilidad Básica',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      icon: 'BookOpen',
      iconColor: 'text-accent',
      bgColor: 'bg-accent-50',
      borderColor: 'border-accent-200'
    },
    {
      id: 5,
      type: 'points_earned',
      title: 'Puntos Ganados',
      description: 'Has ganado 150 puntos por tu excelente desempeño',
      points: 150,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      icon: 'Star',
      iconColor: 'text-secondary-600',
      bgColor: 'bg-secondary-100',
      borderColor: 'border-secondary-200'
    }
  ];

  const formatTimestamp = (date) => {
    const now = new Date();
    const diffTime = now - date;
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    } else {
      return 'hace unos minutos';
    }
  };

  const getActivityDetails = (activity) => {
    switch (activity.type) {
      case 'practice_completed':
        return (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-success font-medium">
              Puntuación: {activity.score}%
            </span>
          </div>
        );
      case 'practice_started':
        return (
          <div className="flex items-center space-x-2">
            <div className="w-16 bg-secondary-200 rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${activity.progress}%` }}
              ></div>
            </div>
            <span className="text-xs text-text-secondary">
              {activity.progress}%
            </span>
          </div>
        );
      case 'points_earned':
        return (
          <div className="flex items-center space-x-1">
            <Icon name="Coins" size={14} className="text-warning" />
            <span className="text-sm text-warning-600 font-medium">
              +{activity.points} puntos
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-text-primary">
        Actividad Reciente
      </h3>

      <div className="bg-surface rounded-lg border border-border">
        <div className="divide-y divide-border">
          {recentActivities.map((activity, index) => (
            <div
              key={activity.id}
              className="p-4 hover:bg-secondary-50 transition-colors duration-200 ease-in-out"
            >
              <div className="flex items-start space-x-4">
                {/* Activity Icon */}
                <div className={`
                  p-2 rounded-full ${activity.bgColor} border ${activity.borderColor}
                  flex-shrink-0
                `}>
                  <Icon 
                    name={activity.icon} 
                    size={16} 
                    className={activity.iconColor}
                  />
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-text-primary mb-1">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                        {activity.description}
                      </p>
                      {getActivityDetails(activity)}
                    </div>
                    <div className="ml-4 text-xs text-text-secondary flex-shrink-0">
                      {formatTimestamp(activity.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Activities Link */}
        <div className="p-4 bg-secondary-50 border-t border-border">
          <button className="text-sm text-primary hover:text-primary-700 font-medium transition-colors duration-200 ease-in-out w-full text-center">
            Ver toda la actividad
          </button>
        </div>
      </div>

      {/* Activity Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface rounded-lg border border-border p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">5</div>
          <div className="text-xs text-text-secondary">Prácticas esta semana</div>
        </div>
        <div className="bg-surface rounded-lg border border-border p-4 text-center">
          <div className="text-2xl font-bold text-success mb-1">87%</div>
          <div className="text-xs text-text-secondary">Promedio semanal</div>
        </div>
        <div className="bg-surface rounded-lg border border-border p-4 text-center">
          <div className="text-2xl font-bold text-warning mb-1">350</div>
          <div className="text-xs text-text-secondary">Puntos ganados</div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
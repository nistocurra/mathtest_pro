import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const RecentActivity = ({ activities = [] }) => {
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `Hace ${days} día${days > 1 ? 's' : ''}`;
    }
  };

  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-success';
    if (percentage >= 70) return 'text-warning';
    return 'text-error';
  };

  const getScoreBadgeColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'bg-success-100 text-success border-success-200';
    if (percentage >= 70) return 'bg-warning-100 text-warning border-warning-200';
    return 'bg-error-100 text-error border-error-200';
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">
            Actividad Reciente
          </h2>
          <Icon name="Clock" size={20} className="text-secondary" />
        </div>
        <div className="text-center py-8">
          <Icon name="FileX" size={48} className="text-secondary-600 mx-auto mb-4" />
          <p className="text-text-secondary">No hay actividad reciente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">
          Actividad Reciente
        </h2>
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={20} className="text-primary" />
          <Link
            to="/panel-del-profesor"
            className="text-sm text-primary hover:text-primary-700 font-medium transition-colors duration-200 ease-in-out"
          >
            Ver todo
          </Link>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="group p-4 rounded-lg border border-border hover:border-primary-200 hover:bg-primary-50 transition-all duration-200 ease-in-out"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-secondary-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="User" size={16} className="text-secondary-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-medium text-text-primary truncate">
                      {activity.studentName}
                    </h4>
                    <p className="text-xs text-text-secondary">
                      {formatTimeAgo(activity.completedAt)}
                    </p>
                  </div>
                </div>
                
                <div className="ml-10">
                  <p className="text-sm text-text-primary mb-2 line-clamp-2">
                    {activity.examTitle}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`
                        inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                        ${getScoreBadgeColor(activity.score, activity.maxScore)}
                      `}>
                        {activity.score}/{activity.maxScore}
                      </span>
                      
                      <div className="flex items-center space-x-1 text-xs text-text-secondary">
                        <Icon name="Clock" size={12} />
                        <span>{activity.duration}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
                      <button
                        className="p-1 text-text-secondary hover:text-primary transition-colors duration-200 ease-in-out"
                        title="Ver detalles"
                      >
                        <Icon name="Eye" size={14} />
                      </button>
                      <button
                        className="p-1 text-text-secondary hover:text-primary transition-colors duration-200 ease-in-out"
                        title="Ver resultados"
                      >
                        <Icon name="BarChart3" size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length > 5 && (
        <div className="mt-4 pt-4 border-t border-border">
          <Link
            to="/panel-del-profesor"
            className="w-full btn-secondary text-center inline-flex items-center justify-center space-x-2"
          >
            <span>Ver todas las actividades</span>
            <Icon name="ArrowRight" size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
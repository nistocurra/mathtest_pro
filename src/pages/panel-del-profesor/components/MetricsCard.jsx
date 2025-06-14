import React from 'react';
import Icon from 'components/AppIcon';

const MetricsCard = ({ metric }) => {
  const getColorClasses = (color) => {
    const colorMap = {
      primary: {
        bg: 'bg-primary-50',
        icon: 'text-primary',
        iconBg: 'bg-primary-100'
      },
      secondary: {
        bg: 'bg-secondary-100',
        icon: 'text-secondary-600',
        iconBg: 'bg-secondary-200'
      },
      accent: {
        bg: 'bg-accent-50',
        icon: 'text-accent',
        iconBg: 'bg-accent-100'
      },
      success: {
        bg: 'bg-success-50',
        icon: 'text-success',
        iconBg: 'bg-success-100'
      },
      warning: {
        bg: 'bg-warning-50',
        icon: 'text-warning',
        iconBg: 'bg-warning-100'
      },
      error: {
        bg: 'bg-error-50',
        icon: 'text-error',
        iconBg: 'bg-error-100'
      }
    };
    return colorMap[color] || colorMap.primary;
  };

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const colors = getColorClasses(metric.color);

  return (
    <div className={`
      card hover:shadow-md transition-all duration-200 ease-in-out
      hover:scale-105 active:scale-98 cursor-pointer
      ${colors.bg} border-l-4 border-l-${metric.color}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`p-2 rounded-lg ${colors.iconBg}`}>
              <Icon 
                name={metric.icon} 
                size={24} 
                className={colors.icon}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">
                {metric.title}
              </p>
            </div>
          </div>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-text-primary">
              {metric.value}
            </span>
            {metric.suffix && (
              <span className="text-lg text-text-secondary">
                {metric.suffix}
              </span>
            )}
          </div>
          
          {metric.change && (
            <div className="mt-2 flex items-center space-x-1">
              <Icon 
                name={metric.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                size={14} 
                className={getChangeColor(metric.changeType)}
              />
              <span className={`text-xs font-medium ${getChangeColor(metric.changeType)}`}>
                {metric.change}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;
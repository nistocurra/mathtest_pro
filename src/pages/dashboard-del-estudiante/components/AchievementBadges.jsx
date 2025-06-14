import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const AchievementBadges = () => {
  const [showAllBadges, setShowAllBadges] = useState(false);

  // Mock achievement badges data
  const achievements = [
    {
      id: 1,
      title: "Maestro del Álgebra",
      description: "Completa 5 exámenes de álgebra con calificación superior al 90%",
      icon: "Calculator",
      color: "bg-primary",
      textColor: "text-primary",
      bgColor: "bg-primary-50",
      borderColor: "border-primary-200",
      earned: true,
      earnedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      progress: 5,
      maxProgress: 5,
      rarity: "legendary"
    },
    {
      id: 2,
      title: "Velocista",
      description: "Completa un examen en menos del 50% del tiempo estimado",
      icon: "Zap",
      color: "bg-warning",
      textColor: "text-warning-600",
      bgColor: "bg-warning-50",
      borderColor: "border-warning-200",
      earned: true,
      earnedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      progress: 1,
      maxProgress: 1,
      rarity: "rare"
    },
    {
      id: 3,
      title: "Perfeccionista",
      description: "Obtén una calificación del 100% en cualquier examen",
      icon: "Star",
      color: "bg-warning",
      textColor: "text-warning",
      bgColor: "bg-warning-50",
      borderColor: "border-warning-200",
      earned: false,
      progress: 0,
      maxProgress: 1,
      rarity: "epic"
    },
    {
      id: 4,
      title: "Estudiante Constante",
      description: "Mantén una racha de 7 días consecutivos de actividad",
      icon: "Flame",
      color: "bg-error",
      textColor: "text-error",
      bgColor: "bg-error-50",
      borderColor: "border-error-200",
      earned: false,
      progress: 5,
      maxProgress: 7,
      rarity: "common"
    },
    {
      id: 5,
      title: "Explorador Matemático",
      description: "Completa al menos un examen de cada materia disponible",
      icon: "Compass",
      color: "bg-accent",
      textColor: "text-accent",
      bgColor: "bg-accent-50",
      borderColor: "border-accent-200",
      earned: false,
      progress: 3,
      maxProgress: 4,
      rarity: "uncommon"
    },
    {
      id: 6,
      title: "Analista Experto",
      description: "Completa 10 exámenes de estadística con promedio superior al 85%",
      icon: "BarChart3",
      color: "bg-secondary-600",
      textColor: "text-secondary-600",
      bgColor: "bg-secondary-100",
      borderColor: "border-secondary-200",
      earned: false,
      progress: 2,
      maxProgress: 10,
      rarity: "rare"
    }
  ];

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return 'text-purple-600';
      case 'epic':
        return 'text-purple-500';
      case 'rare':
        return 'text-blue-500';
      case 'uncommon':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getRarityLabel = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return 'Legendario';
      case 'epic':
        return 'Épico';
      case 'rare':
        return 'Raro';
      case 'uncommon':
        return 'Poco Común';
      default:
        return 'Común';
    }
  };

  const formatEarnedDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  const earnedAchievements = achievements.filter(a => a.earned);
  const inProgressAchievements = achievements.filter(a => !a.earned && a.progress > 0);
  const lockedAchievements = achievements.filter(a => !a.earned && a.progress === 0);

  const displayedAchievements = showAllBadges ? achievements : achievements.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-text-primary">Logros</h3>
        <div className="text-sm text-text-secondary">
          {earnedAchievements.length} de {achievements.length}
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-success-50 rounded-lg p-3 border border-success-200">
          <div className="text-lg font-bold text-success">{earnedAchievements.length}</div>
          <div className="text-xs text-success-600">Obtenidos</div>
        </div>
        <div className="bg-warning-50 rounded-lg p-3 border border-warning-200">
          <div className="text-lg font-bold text-warning-600">{inProgressAchievements.length}</div>
          <div className="text-xs text-warning-600">En Progreso</div>
        </div>
        <div className="bg-secondary-100 rounded-lg p-3 border border-secondary-200">
          <div className="text-lg font-bold text-secondary-600">{lockedAchievements.length}</div>
          <div className="text-xs text-secondary-600">Bloqueados</div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="space-y-3">
        {displayedAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`
              relative rounded-lg border p-4 transition-all duration-200 ease-in-out
              ${achievement.earned 
                ? `${achievement.bgColor} ${achievement.borderColor} hover:shadow-md` 
                : 'bg-secondary-50 border-secondary-200 opacity-75'
              }
            `}
          >
            <div className="flex items-start space-x-4">
              {/* Badge Icon */}
              <div className={`
                relative p-3 rounded-full transition-all duration-200 ease-in-out
                ${achievement.earned 
                  ? achievement.color 
                  : 'bg-secondary-200'
                }
              `}>
                <Icon 
                  name={achievement.icon} 
                  size={20} 
                  color={achievement.earned ? "white" : "#64748B"} 
                />
                {achievement.earned && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center">
                    <Icon name="Check" size={10} color="white" />
                  </div>
                )}
              </div>

              {/* Badge Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`
                    text-sm font-semibold truncate
                    ${achievement.earned ? achievement.textColor : 'text-secondary-600'}
                  `}>
                    {achievement.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    {achievement.earned && (
                      <span className="text-xs text-text-secondary">
                        {formatEarnedDate(achievement.earnedDate)}
                      </span>
                    )}
                    <span className={`text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                      {getRarityLabel(achievement.rarity)}
                    </span>
                  </div>
                </div>
                
                <p className={`
                  text-xs mb-3 line-clamp-2
                  ${achievement.earned ? 'text-text-secondary' : 'text-secondary-500'}
                `}>
                  {achievement.description}
                </p>

                {/* Progress Bar */}
                {!achievement.earned && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-secondary-600">Progreso</span>
                      <span className="text-secondary-600">
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <div className="w-full bg-secondary-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ease-out ${achievement.color}`}
                        style={{ 
                          width: `${(achievement.progress / achievement.maxProgress) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {achievements.length > 4 && (
        <div className="text-center">
          <button
            onClick={() => setShowAllBadges(!showAllBadges)}
            className="text-sm text-primary hover:text-primary-700 font-medium transition-colors duration-200 ease-in-out inline-flex items-center space-x-1"
          >
            <span>{showAllBadges ? 'Ver menos' : 'Ver todos los logros'}</span>
            <Icon 
              name={showAllBadges ? "ChevronUp" : "ChevronDown"} 
              size={16} 
            />
          </button>
        </div>
      )}

      {/* Next Achievement Hint */}
      {inProgressAchievements.length > 0 && (
        <div className="bg-primary-50 rounded-lg border border-primary-200 p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Target" size={20} className="text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-primary mb-1">
                Próximo Logro
              </h4>
              <p className="text-sm text-text-secondary">
                Estás cerca de obtener "{inProgressAchievements[0].title}". 
                ¡Solo te faltan {inProgressAchievements[0].maxProgress - inProgressAchievements[0].progress} más!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementBadges;
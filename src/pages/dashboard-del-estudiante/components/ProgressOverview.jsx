import React from 'react';
import Icon from 'components/AppIcon';

const ProgressOverview = ({ studentData }) => {
  // Mock progress data
  const progressData = {
    subjects: [
      { name: 'Álgebra', score: 92, color: 'bg-primary', textColor: 'text-primary' },
      { name: 'Geometría', score: 85, color: 'bg-accent', textColor: 'text-accent' },
      { name: 'Cálculo', score: 78, color: 'bg-warning', textColor: 'text-warning-600' },
      { name: 'Estadística', score: 90, color: 'bg-secondary-600', textColor: 'text-secondary-600' }
    ],
    weeklyProgress: [
      { week: 'Sem 1', score: 82 },
      { week: 'Sem 2', score: 85 },
      { week: 'Sem 3', score: 87 },
      { week: 'Sem 4', score: 88 }
    ],
    totalStudyTime: 45, // hours
    completionRate: (studentData.completedExams / studentData.totalExams) * 100
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-warning-600';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  const getScoreBackground = (score) => {
    if (score >= 90) return 'bg-success-50';
    if (score >= 80) return 'bg-warning-50';
    if (score >= 70) return 'bg-warning-50';
    return 'bg-error-50';
  };

  // Calculate circumference for circular progress
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (studentData.overallAverage / 100) * circumference;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-text-primary">Mi Progreso</h3>
      
      {/* Overall Progress Circle */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-secondary-200"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="text-primary transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">
                  {studentData.overallAverage}%
                </div>
                <div className="text-xs text-text-secondary">Promedio</div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h4 className="text-lg font-semibold text-text-primary mb-1">Promedio General</h4>
            <p className="text-sm text-text-secondary">
              {studentData.completedExams} de {studentData.totalExams} exámenes completados
            </p>
          </div>
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h4 className="text-lg font-semibold text-text-primary mb-4">Por Materia</h4>
        <div className="space-y-4">
          {progressData.subjects.map((subject, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${subject.color}`}></div>
                <span className="text-sm font-medium text-text-primary">{subject.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-secondary-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ease-out ${subject.color}`}
                    style={{ width: `${subject.score}%` }}
                  ></div>
                </div>
                <span className={`text-sm font-semibold ${getScoreColor(subject.score)} min-w-[3rem] text-right`}>
                  {subject.score}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Clock" size={16} className="text-primary" />
            <span className="text-sm text-text-secondary">Tiempo de Estudio</span>
          </div>
          <div className="text-xl font-bold text-text-primary">{progressData.totalStudyTime}h</div>
          <div className="text-xs text-text-secondary">Esta semana</div>
        </div>
        
        <div className="bg-surface rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Target" size={16} className="text-accent" />
            <span className="text-sm text-text-secondary">Tasa de Finalización</span>
          </div>
          <div className="text-xl font-bold text-text-primary">{Math.round(progressData.completionRate)}%</div>
          <div className="text-xs text-text-secondary">Exámenes completados</div>
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h4 className="text-lg font-semibold text-text-primary mb-4">Tendencia Semanal</h4>
        <div className="flex items-end justify-between space-x-2 h-24">
          {progressData.weeklyProgress.map((week, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="w-full bg-secondary-200 rounded-t-md relative" style={{ height: '60px' }}>
                <div
                  className="bg-primary rounded-t-md absolute bottom-0 w-full transition-all duration-500 ease-out"
                  style={{ height: `${(week.score / 100) * 60}px` }}
                ></div>
              </div>
              <div className="text-xs text-text-secondary mt-2">{week.week}</div>
              <div className="text-xs font-medium text-text-primary">{week.score}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-accent-50 rounded-lg border border-accent-200 p-4">
        <div className="flex items-start space-x-3">
          <Icon name="TrendingUp" size={20} className="text-accent mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-accent-600 mb-1">
              ¡Excelente progreso!
            </h4>
            <p className="text-sm text-accent-600">
              Has mejorado un 6% en las últimas 4 semanas. Continúa así para alcanzar tus objetivos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressOverview;
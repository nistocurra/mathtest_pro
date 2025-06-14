import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const AvailableExams = () => {
  const [filter, setFilter] = useState('all');

  // Mock available exams data
  const availableExams = [
    {
      id: 1,
      title: "Álgebra Lineal - Sistemas de Ecuaciones",
      description: "Resolución de sistemas de ecuaciones lineales utilizando diferentes métodos: sustitución, eliminación y matrices.",
      subject: "Álgebra",
      questions: 15,
      estimatedTime: 45,
      difficulty: "Intermedio",
      status: "not_started",
      attemptType: "multiple",
      maxAttempts: 3,
      currentAttempts: 0,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      isNew: true,
      points: 100
    },
    {
      id: 2,
      title: "Geometría - Teorema de Pitágoras",
      description: "Aplicación del teorema de Pitágoras en triángulos rectángulos y problemas de la vida real.",
      subject: "Geometría",
      questions: 12,
      estimatedTime: 30,
      difficulty: "Básico",
      status: "in_progress",
      attemptType: "single",
      maxAttempts: 1,
      currentAttempts: 0,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      isNew: false,
      points: 80,
      progress: 60
    },
    {
      id: 3,
      title: "Cálculo Diferencial - Límites",
      description: "Conceptos fundamentales de límites, continuidad y aplicaciones en funciones matemáticas.",
      subject: "Cálculo",
      questions: 20,
      estimatedTime: 60,
      difficulty: "Avanzado",
      status: "completed",
      attemptType: "multiple",
      maxAttempts: 2,
      currentAttempts: 1,
      completedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      score: 92,
      points: 120
    },
    {
      id: 4,
      title: "Estadística - Probabilidad Básica",
      description: "Introducción a conceptos de probabilidad, eventos independientes y distribuciones.",
      subject: "Estadística",
      questions: 18,
      estimatedTime: 40,
      difficulty: "Intermedio",
      status: "not_started",
      attemptType: "single",
      maxAttempts: 1,
      currentAttempts: 0,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isNew: false,
      points: 90
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'Todos', count: availableExams.length },
    { value: 'available', label: 'Disponibles', count: availableExams.filter(e => e.status === 'not_started').length },
    { value: 'in_progress', label: 'En Progreso', count: availableExams.filter(e => e.status === 'in_progress').length },
    { value: 'completed', label: 'Completados', count: availableExams.filter(e => e.status === 'completed').length }
  ];

  const filteredExams = availableExams.filter(exam => {
    if (filter === 'all') return true;
    if (filter === 'available') return exam.status === 'not_started';
    if (filter === 'in_progress') return exam.status === 'in_progress';
    if (filter === 'completed') return exam.status === 'completed';
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'not_started':
        return 'bg-primary-50 text-primary border-primary-200';
      case 'in_progress':
        return 'bg-warning-50 text-warning-600 border-warning-200';
      case 'completed':
        return 'bg-success-50 text-success-600 border-success-200';
      default:
        return 'bg-secondary-50 text-secondary-600 border-secondary-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'not_started':
        return 'No Iniciado';
      case 'in_progress':
        return 'En Progreso';
      case 'completed':
        return 'Completado';
      default:
        return 'Desconocido';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Básico':
        return 'text-success';
      case 'Intermedio':
        return 'text-warning-600';
      case 'Avanzado':
        return 'text-error';
      default:
        return 'text-secondary-600';
    }
  };

  const formatDueDate = (date) => {
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Vence hoy';
    if (diffDays === 1) return 'Vence mañana';
    if (diffDays > 1) return `Vence en ${diffDays} días`;
    return 'Vencido';
  };

  const getActionButton = (exam) => {
    switch (exam.status) {
      case 'not_started':
        return (
          <Link
            to="/interfaz-de-examen"
            className="btn-primary w-full sm:w-auto inline-flex items-center justify-center space-x-2"
          >
            <Icon name="Play" size={16} />
            <span>Iniciar Examen</span>
          </Link>
        );
      case 'in_progress':
        return (
          <Link
            to="/interfaz-de-examen"
            className="bg-warning text-white px-4 py-2 rounded-md font-medium transition-all duration-200 ease-in-out hover:bg-warning-600 w-full sm:w-auto inline-flex items-center justify-center space-x-2"
          >
            <Icon name="RotateCcw" size={16} />
            <span>Continuar</span>
          </Link>
        );
      case 'completed':
        if (exam.attemptType === 'multiple' && exam.currentAttempts < exam.maxAttempts) {
          return (
            <Link
              to="/interfaz-de-examen"
              className="btn-secondary w-full sm:w-auto inline-flex items-center justify-center space-x-2"
            >
              <Icon name="RefreshCw" size={16} />
              <span>Reintentar</span>
            </Link>
          );
        }
        return (
          <button
            disabled
            className="bg-secondary-200 text-secondary-600 px-4 py-2 rounded-md font-medium cursor-not-allowed w-full sm:w-auto inline-flex items-center justify-center space-x-2"
          >
            <Icon name="CheckCircle" size={16} />
            <span>Completado</span>
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-text-primary mb-4 sm:mb-0">
          Exámenes Disponibles
        </h2>
        
        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-secondary-100 rounded-lg p-1">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`
                px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out
                ${filter === option.value
                  ? 'bg-surface text-primary shadow-sm'
                  : 'text-text-secondary hover:text-primary'
                }
              `}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-surface rounded-lg border border-border p-6 hover:shadow-md transition-shadow duration-200 ease-in-out"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-text-primary line-clamp-2">
                    {exam.title}
                  </h3>
                  {exam.isNew && (
                    <span className="px-2 py-1 text-xs font-medium bg-primary text-white rounded-full">
                      Nuevo
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                  {exam.description}
                </p>
              </div>
            </div>

            {/* Status and Progress */}
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(exam.status)}`}>
                {getStatusText(exam.status)}
              </span>
              {exam.status === 'in_progress' && exam.progress && (
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-secondary-200 rounded-full h-2">
                    <div
                      className="bg-warning h-2 rounded-full transition-all duration-300 ease-smooth"
                      style={{ width: `${exam.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-text-secondary">{exam.progress}%</span>
                </div>
              )}
              {exam.status === 'completed' && exam.score && (
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={16} className="text-warning" />
                  <span className="text-sm font-medium text-text-primary">{exam.score}%</span>
                </div>
              )}
            </div>

            {/* Exam Details */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="flex items-center space-x-2">
                <Icon name="FileText" size={16} className="text-secondary-600" />
                <span className="text-text-secondary">{exam.questions} preguntas</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-secondary-600" />
                <span className="text-text-secondary">{exam.estimatedTime} min</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="TrendingUp" size={16} className={getDifficultyColor(exam.difficulty)} />
                <span className={getDifficultyColor(exam.difficulty)}>{exam.difficulty}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Award" size={16} className="text-secondary-600" />
                <span className="text-text-secondary">{exam.points} pts</span>
              </div>
            </div>

            {/* Attempt Info */}
            <div className="flex items-center justify-between mb-4 text-xs text-text-secondary">
              <span>
                {exam.attemptType === 'single' ? 'Intento único' : `${exam.currentAttempts}/${exam.maxAttempts} intentos`}
              </span>
              {exam.status !== 'completed' && exam.dueDate && (
                <span className={`${formatDueDate(exam.dueDate).includes('Vence hoy') || formatDueDate(exam.dueDate).includes('Vencido') ? 'text-error font-medium' : ''}`}>
                  {formatDueDate(exam.dueDate)}
                </span>
              )}
              {exam.status === 'completed' && exam.completedDate && (
                <span>
                  Completado el {exam.completedDate.toLocaleDateString('es-ES')}
                </span>
              )}
            </div>

            {/* Action Button */}
            <div className="flex justify-end">
              {getActionButton(exam)}
            </div>
          </div>
        ))}
      </div>

      {filteredExams.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileX" size={48} className="text-secondary-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No hay exámenes {filter === 'all' ? '' : filterOptions.find(f => f.value === filter)?.label.toLowerCase()}
          </h3>
          <p className="text-text-secondary">
            {filter === 'all' ?'No tienes exámenes disponibles en este momento.'
              : `No tienes exámenes ${filterOptions.find(f => f.value === filter)?.label.toLowerCase()} actualmente.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailableExams;
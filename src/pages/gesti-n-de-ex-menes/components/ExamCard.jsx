import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const ExamCard = ({ 
  exam, 
  isSelected, 
  onSelect, 
  onToggleStatus, 
  onDelete, 
  onDuplicate 
}) => {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  const getStatusColor = (status) => {
    return status === 'active' ?'bg-success-100 text-success-600 border-success-200' :'bg-secondary-100 text-secondary-600 border-secondary-200';
  };

  const getStatusIcon = (status) => {
    return status === 'active' ? 'CheckCircle' : 'Clock';
  };

  return (
    <div className={`card relative transition-all duration-200 ease-in-out hover:shadow-md ${
      isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
    }`}>
      {/* Selection Checkbox */}
      <div className="absolute top-4 left-4 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary focus:ring-2"
        />
      </div>

      {/* Actions Menu */}
      <div className="absolute top-4 right-4 z-10">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-text-secondary hover:text-primary hover:bg-secondary-100 rounded-md transition-colors duration-200 ease-in-out"
          >
            <Icon name="MoreVertical" size={16} />
          </button>

          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-lg border border-border z-20">
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowActions(false);
                    // Handle edit action
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-text-secondary hover:bg-secondary-100 hover:text-primary transition-colors duration-200 ease-in-out"
                >
                  <Icon name="Edit" size={16} />
                  <span>Editar</span>
                </button>
                
                <button
                  onClick={() => {
                    setShowActions(false);
                    onDuplicate();
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-text-secondary hover:bg-secondary-100 hover:text-primary transition-colors duration-200 ease-in-out"
                >
                  <Icon name="Copy" size={16} />
                  <span>Duplicar</span>
                </button>
                
                <Link
                  to="/panel-del-profesor"
                  onClick={() => setShowActions(false)}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-text-secondary hover:bg-secondary-100 hover:text-primary transition-colors duration-200 ease-in-out"
                >
                  <Icon name="BarChart3" size={16} />
                  <span>Ver Resultados</span>
                </Link>
                
                <div className="border-t border-border my-1"></div>
                
                <button
                  onClick={() => {
                    setShowActions(false);
                    onDelete();
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-error hover:bg-error-50 transition-colors duration-200 ease-in-out"
                >
                  <Icon name="Trash2" size={16} />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="pt-8">
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(exam.status)}`}>
            <Icon name={getStatusIcon(exam.status)} size={12} />
            <span>{exam.status === 'active' ? 'Activo' : 'Inactivo'}</span>
          </span>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-text-secondary">
              {exam.attemptsAllowed === 'single' ? 'Único intento' : `${exam.maxAttempts} intentos`}
            </span>
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2">
          {exam.title}
        </h3>
        <p className="text-sm text-text-secondary mb-4 line-clamp-2">
          {exam.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-secondary-50 rounded-md">
            <div className="text-lg font-semibold text-text-primary">
              {exam.questionsCount}
            </div>
            <div className="text-xs text-text-secondary">Preguntas</div>
          </div>
          
          <div className="text-center p-3 bg-secondary-50 rounded-md">
            <div className="text-lg font-semibold text-text-primary">
              {exam.timeLimit}min
            </div>
            <div className="text-xs text-text-secondary">Duración</div>
          </div>
        </div>

        {/* Performance Stats */}
        {exam.studentsCompleted > 0 && (
          <div className="mb-4 p-3 bg-accent-50 rounded-md">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Completado por:</span>
              <span className="font-medium text-text-primary">{exam.studentsCompleted} estudiantes</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-text-secondary">Promedio:</span>
              <span className="font-medium text-accent">{exam.averageScore.toFixed(1)}%</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-xs text-text-secondary">
            Creado: {formatDate(exam.createdDate)}
          </div>
          
          {/* Status Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-text-secondary">
              {exam.status === 'active' ? 'Desactivar' : 'Activar'}
            </span>
            <button
              onClick={onToggleStatus}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                exam.status === 'active' ? 'bg-success' : 'bg-secondary-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                  exam.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
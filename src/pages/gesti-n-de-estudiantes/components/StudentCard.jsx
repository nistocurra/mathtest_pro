import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const StudentCard = ({ 
  student, 
  onViewProfile, 
  onEdit, 
  onResetPassword, 
  onToggleStatus 
}) => {
  const [showActions, setShowActions] = useState(false);

  const formatLastAccess = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semana(s)`;
    return `Hace ${Math.ceil(diffDays / 30)} mes(es)`;
  };

  const getProgressColor = (completed, total) => {
    const percentage = (completed / total) * 100;
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 60) return 'bg-warning';
    return 'bg-error';
  };

  const getStatusColor = (status) => {
    return status === 'active' ?'bg-success-100 text-success border-success-200' :'bg-error-100 text-error border-error-200';
  };

  return (
    <div className="card hover:shadow-md transition-all duration-200 ease-in-out relative">
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(student.status)}`}>
          {student.status === 'active' ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      {/* Student Info */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary-100">
            <Image
              src={student.avatar}
              alt={student.name}
              className="w-full h-full object-cover"
            />
          </div>
          {student.status === 'active' && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-surface"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-text-primary truncate">
            {student.name}
          </h3>
          <p className="text-sm text-text-secondary truncate">
            {student.email}
          </p>
          <p className="text-xs text-text-secondary mt-1">
            {student.grade}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-text-primary">
            {student.completedExams}
          </div>
          <div className="text-xs text-text-secondary">
            Exámenes completados
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-text-primary">
            {student.averageScore.toFixed(1)}
          </div>
          <div className="text-xs text-text-secondary">
            Promedio
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-text-secondary mb-1">
          <span>Progreso</span>
          <span>{student.completedExams}/{student.totalExams}</span>
        </div>
        <div className="w-full bg-secondary-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ease-smooth ${getProgressColor(student.completedExams, student.totalExams)}`}
            style={{ width: `${(student.completedExams / student.totalExams) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Last Access */}
      <div className="flex items-center space-x-2 mb-4 text-sm text-text-secondary">
        <Icon name="Clock" size={14} />
        <span>Último acceso: {formatLastAccess(student.lastAccess)}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onViewProfile(student)}
          className="text-sm text-primary hover:text-primary-700 font-medium transition-colors duration-200 ease-in-out"
        >
          Ver perfil completo
        </button>
        
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-text-secondary hover:text-primary hover:bg-secondary-100 rounded-md transition-all duration-200 ease-in-out"
          >
            <Icon name="MoreVertical" size={16} />
          </button>
          
          {showActions && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowActions(false)}
              ></div>
              <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-border rounded-md shadow-lg z-20">
                <button
                  onClick={() => {
                    onEdit(student);
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-secondary-100 transition-colors duration-200 ease-in-out flex items-center space-x-2"
                >
                  <Icon name="Edit" size={14} />
                  <span>Editar información</span>
                </button>
                
                <button
                  onClick={() => {
                    onResetPassword(student);
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-secondary-100 transition-colors duration-200 ease-in-out flex items-center space-x-2"
                >
                  <Icon name="Key" size={14} />
                  <span>Restablecer contraseña</span>
                </button>
                
                <button
                  onClick={() => {
                    onToggleStatus(student);
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-secondary-100 transition-colors duration-200 ease-in-out flex items-center space-x-2"
                >
                  <Icon name={student.status === 'active' ? 'UserX' : 'UserCheck'} size={14} />
                  <span>{student.status === 'active' ? 'Desactivar cuenta' : 'Activar cuenta'}</span>
                </button>
                
                <div className="border-t border-border">
                  <button
                    onClick={() => {
                      alert(`Ver historial de exámenes de ${student.name}`);
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-secondary-100 transition-colors duration-200 ease-in-out flex items-center space-x-2"
                  >
                    <Icon name="History" size={14} />
                    <span>Ver historial de exámenes</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
// src/pages/gesti-n-de-grupos/components/GroupCard.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const GroupCard = ({ 
  group, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete, 
  onAddStudent, 
  onExport 
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(group.name);

  const handleSaveEdit = () => {
    if (editName.trim() && editName !== group.name) {
      onEdit({ name: editName.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(group.name);
    setIsEditing(false);
  };

  const getCourseLabel = (course) => {
    const courseMap = {
      '1ESO': '1º ESO',
      '2ESO': '2º ESO', 
      '3ESO': '3º ESO',
      '4ESO': '4º ESO'
    };
    return courseMap[course] || course;
  };

  return (
    <div 
      className={`card hover:shadow-lg transition-all duration-200 ease-in-out ${
        isSelected ? 'ring-2 ring-primary bg-primary-50' : 'hover:border-primary'
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Header with selection and actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-4 h-4 text-primary border-2 border-border rounded focus:ring-primary focus:ring-offset-2"
          />
          
          <div className="flex-1">
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="text-lg font-semibold text-text-primary bg-transparent border-b border-primary focus:outline-none focus:border-primary-700"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  autoFocus
                />
                <button
                  onClick={handleSaveEdit}
                  className="text-success hover:text-success-700"
                >
                  <Icon name="Check" size={16} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="text-danger hover:text-danger-700"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            ) : (
              <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors duration-200">
                {group.name}
              </h3>
            )}
          </div>
        </div>

        {/* Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className={`p-2 rounded-lg transition-all duration-200 ease-in-out ${
              showActions ? 'bg-secondary-100 text-primary' : 'text-text-secondary hover:bg-secondary-100 hover:text-primary'
            }`}
          >
            <Icon name="MoreVertical" size={16} />
          </button>
          
          {showActions && (
            <div className="absolute right-0 top-10 w-48 bg-surface border border-border rounded-lg shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-secondary-100 flex items-center space-x-2"
                >
                  <Icon name="Edit2" size={14} />
                  <span>Editar nombre</span>
                </button>
                <button
                  onClick={() => {
                    onAddStudent();
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-secondary-100 flex items-center space-x-2"
                >
                  <Icon name="UserPlus" size={14} />
                  <span>Agregar estudiante</span>
                </button>
                <button
                  onClick={() => {
                    onExport();
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-secondary-100 flex items-center space-x-2"
                >
                  <Icon name="Download" size={14} />
                  <span>Exportar CSV</span>
                </button>
                <hr className="my-1" />
                <button
                  onClick={() => {
                    onDelete();
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-danger hover:bg-red-50 flex items-center space-x-2"
                >
                  <Icon name="Trash2" size={14} />
                  <span>Eliminar grupo</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Course Badge */}
      <div className="mb-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary">
          <Icon name="GraduationCap" size={12} className="mr-1" />
          {getCourseLabel(group.course)}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {group.student_count || 0}
          </div>
          <div className="text-xs text-text-secondary">Estudiantes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-success">
            {group.students?.filter(s => {
              const lastAccess = new Date(s.last_access || 0);
              const daysSince = (Date.now() - lastAccess.getTime()) / (1000 * 60 * 60 * 24);
              return daysSince <= 7;
            }).length || 0}
          </div>
          <div className="text-xs text-text-secondary">Activos</div>
        </div>
      </div>

      {/* Students Preview */}
      {group.students && group.students.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-text-secondary mb-2">Estudiantes recientes:</div>
          <div className="space-y-1">
            {group.students.slice(0, 3).map((student, index) => (
              <div key={student.id || index} className="flex items-center space-x-2 text-sm">
                <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {(student.full_name || student.alias || 'E')[0].toUpperCase()}
                </div>
                <span className="text-text-primary truncate">
                  {student.alias || student.full_name || 'Estudiante'}
                </span>
                <span className="text-accent font-medium text-xs">
                  {student.total_points || 0}pts
                </span>
              </div>
            ))}
            {group.students.length > 3 && (
              <div className="text-xs text-text-secondary pl-8">
                +{group.students.length - 3} más
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>Creado {new Date(group.created_at).toLocaleDateString()}</span>
          <span className="text-primary font-medium">
            {group.teacher?.full_name || 'Profesor'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
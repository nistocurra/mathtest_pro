// src/pages/gesti-n-de-grupos/components/AddStudentToGroupModal.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const AddStudentToGroupModal = ({ isOpen, onClose, group, onAddStudent }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!group) {
      setError('No se ha seleccionado un grupo válido');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      await onAddStudent(group.id);
      
      onClose();
    } catch (err) {
      setError('Error al agregar el estudiante. Inténtalo de nuevo.');
      console.log('Error adding student:', err);
    } finally {
      setIsSubmitting(false);
    }
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

  if (!isOpen || !group) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-surface rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-surface px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">
                Agregar Estudiante al Grupo
              </h3>
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertCircle" size={16} className="text-red-600" />
                  <span className="text-red-800 text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Group Info */}
            <div className="mb-6 p-4 bg-secondary-50 border border-border rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                  {group.name[0].toUpperCase()}
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">{group.name}</h4>
                  <p className="text-sm text-text-secondary">
                    {getCourseLabel(group.course)} • {group.student_count || 0} estudiantes
                  </p>
                </div>
              </div>
            </div>

            {/* Generation Info */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 text-sm mb-2">Datos del Nuevo Estudiante</h4>
                  <div className="text-blue-800 text-xs space-y-1">
                    <p><strong>Alias:</strong> Se generará automáticamente (Ej: RedDragonSky)</p>
                    <p><strong>Contraseña:</strong> Se generará automáticamente (Ej: VenusJazz)</p>
                    <p><strong>Nombre:</strong> "Estudiante" por defecto</p>
                    <p><strong>Curso:</strong> {getCourseLabel(group.course)}</p>
                    <p><strong>Grupo:</strong> {group.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation */}
            <div className="mb-6">
              <p className="text-text-primary text-sm">
                ¿Deseas agregar un nuevo estudiante al grupo <strong>{group.name}</strong>?
              </p>
              <p className="text-text-secondary text-xs mt-2">
                Se generarán automáticamente las credenciales de acceso y el estudiante será asignado al curso {getCourseLabel(group.course)}.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="btn-primary flex items-center space-x-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Agregando...</span>
                  </>
                ) : (
                  <>
                    <Icon name="UserPlus" size={16} />
                    <span>Agregar Estudiante</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentToGroupModal;
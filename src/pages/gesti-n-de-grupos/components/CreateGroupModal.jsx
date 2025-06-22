// src/pages/gesti-n-de-grupos/components/CreateGroupModal.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const CreateGroupModal = ({ isOpen, onClose, onSubmit, courseOptions }) => {
  const [formData, setFormData] = useState({
    name: '',
    course: '1ESO',
    student_count: 25
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('El nombre del grupo es obligatorio');
      return;
    }
    
    if (formData.student_count < 1 || formData.student_count > 50) {
      setError('El número de estudiantes debe estar entre 1 y 50');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      await onSubmit({
        name: formData.name.trim(),
        course: formData.course,
        student_count: parseInt(formData.student_count)
      });
      
      // Reset form
      setFormData({
        name: '',
        course: '1ESO',
        student_count: 25
      });
      
      onClose();
    } catch (err) {
      setError('Error al crear el grupo. Inténtalo de nuevo.');
      console.log('Error creating group:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  if (!isOpen) return null;

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
                Crear Nuevo Grupo
              </h3>
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertCircle" size={16} className="text-red-600" />
                  <span className="text-red-800 text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Group Name */}
            <div className="mb-4">
              <label htmlFor="groupName" className="block text-sm font-medium text-text-primary mb-2">
                Nombre del Grupo *
              </label>
              <input
                id="groupName"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: Grupo Matemáticas A"
                className="input-field"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Course */}
            <div className="mb-4">
              <label htmlFor="course" className="block text-sm font-medium text-text-primary mb-2">
                Curso *
              </label>
              <select
                id="course"
                value={formData.course}
                onChange={(e) => handleInputChange('course', e.target.value)}
                className="input-field"
                required
                disabled={isSubmitting}
              >
                {courseOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Student Count */}
            <div className="mb-6">
              <label htmlFor="studentCount" className="block text-sm font-medium text-text-primary mb-2">
                Número de Estudiantes *
              </label>
              <input
                id="studentCount"
                type="number"
                min="1"
                max="50"
                value={formData.student_count}
                onChange={(e) => handleInputChange('student_count', e.target.value)}
                className="input-field"
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-text-secondary mt-1">
                Se generarán automáticamente las cuentas y credenciales para cada estudiante.
              </p>
            </div>

            {/* Generation Info */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 text-sm mb-1">Generación Automática</h4>
                  <div className="text-blue-800 text-xs space-y-1">
                    <p><strong>Alias:</strong> Formato: ColorAnimalElemento (Ej: SilverFoxSky)</p>
                    <p><strong>Contraseña:</strong> Formato: AstronomíaGeneroMusical (Ej: MercuryDisco)</p>
                    <p><strong>Nombre:</strong> "Estudiante" por defecto</p>
                  </div>
                </div>
              </div>
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
                type="submit"
                className="btn-primary flex items-center space-x-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creando...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Plus" size={16} />
                    <span>Crear Grupo</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
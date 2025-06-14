import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const AddStudentModal = ({ isOpen, onClose, student = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    grade: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const grades = [
    '6º Grado', '7º Grado', '8º Grado', '9º Grado', 
    '10º Grado', '11º Grado', '12º Grado'
  ];

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        grade: student.grade || '',
        password: '',
        confirmPassword: ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        grade: '',
        password: '',
        confirmPassword: ''
      });
    }
    setErrors({});
  }, [student, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (!/^(\+34|0034|34)?[6789]\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'El formato del teléfono no es válido';
    }

    if (!formData.grade) {
      newErrors.grade = 'El grado es obligatorio';
    }

    if (!student) { // Only validate password for new students
      if (!formData.password) {
        newErrors.password = 'La contraseña es obligatoria';
      } else if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirma la contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const action = student ? 'actualizado' : 'creado';
      alert(`Estudiante ${action} exitosamente: ${formData.name}`);
      
      onClose();
    } catch (error) {
      alert('Error al procesar la solicitud. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({
      ...prev,
      password,
      confirmPassword: password
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-1020 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-primary">
              {student ? 'Editar Estudiante' : 'Agregar Nuevo Estudiante'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-primary transition-colors duration-200 ease-in-out"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input-field ${errors.name ? 'border-error focus:ring-error' : ''}`}
              placeholder="Ej: Ana García López"
            />
            {errors.name && (
              <p className="text-sm text-error mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input-field ${errors.email ? 'border-error focus:ring-error' : ''}`}
              placeholder="ana.garcia@estudiante.edu"
            />
            {errors.email && (
              <p className="text-sm text-error mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-1">
              Teléfono *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`input-field ${errors.phone ? 'border-error focus:ring-error' : ''}`}
              placeholder="+34 612 345 678"
            />
            {errors.phone && (
              <p className="text-sm text-error mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Grade */}
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-text-primary mb-1">
              Grado *
            </label>
            <select
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className={`input-field ${errors.grade ? 'border-error focus:ring-error' : ''}`}
            >
              <option value="">Seleccionar grado</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
            {errors.grade && (
              <p className="text-sm text-error mt-1">{errors.grade}</p>
            )}
          </div>

          {/* Password (only for new students) */}
          {!student && (
            <>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                    Contraseña Temporal *
                  </label>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-xs text-primary hover:text-primary-700 transition-colors duration-200 ease-in-out"
                  >
                    Generar automáticamente
                  </button>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field ${errors.password ? 'border-error focus:ring-error' : ''}`}
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.password && (
                  <p className="text-sm text-error mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-1">
                  Confirmar Contraseña *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input-field ${errors.confirmPassword ? 'border-error focus:ring-error' : ''}`}
                  placeholder="Repetir contraseña"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-error mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </>
          )}

          {/* Info Note */}
          <div className="bg-secondary-50 p-3 rounded-md">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} className="text-secondary-600 mt-0.5" />
              <div className="text-sm text-text-secondary">
                {student 
                  ? 'Los cambios se aplicarán inmediatamente. El estudiante será notificado por email.'
                  : 'Se enviará un email al estudiante con sus credenciales de acceso y la contraseña temporal.'
                }
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Icon name={student ? "Save" : "UserPlus"} size={16} />
                  <span>{student ? 'Actualizar' : 'Crear Estudiante'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
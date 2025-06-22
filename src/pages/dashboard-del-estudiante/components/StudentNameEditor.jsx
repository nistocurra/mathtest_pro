// src/pages/dashboard-del-estudiante/components/StudentNameEditor.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import { useAuth } from 'context/AuthContext';

const StudentNameEditor = ({ currentName, onNameUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(currentName || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { updateUserProfile } = useAuth();

  const handleStartEdit = () => {
    setIsEditing(true);
    setNewName(currentName || '');
    setError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewName(currentName || '');
    setError(null);
  };

  const handleSaveName = async () => {
    if (!newName.trim()) {
      setError('El nombre no puede estar vacío');
      return;
    }

    if (newName.trim() === currentName) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await updateUserProfile({ full_name: newName.trim() });
      
      if (result.success) {
        setIsEditing(false);
        if (onNameUpdate) {
          onNameUpdate(newName.trim());
        }
      } else {
        setError(result.error || 'Error al actualizar el nombre');
      }
    } catch (err) {
      setError('Error inesperado al actualizar el nombre');
      console.log('Error updating name:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  if (!isEditing) {
    return (
      <div className="flex items-center space-x-2 group">
        <span className="text-2xl sm:text-3xl font-bold text-white">
          {currentName?.split(' ')[0] || 'Estudiante'}
        </span>
        <button
          onClick={handleStartEdit}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded hover:bg-primary-600 text-primary-100 hover:text-white"
          title="Cambiar nombre"
        >
          <Icon name="Edit2" size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={handleKeyPress}
          className="bg-white bg-opacity-20 text-white placeholder-primary-200 border border-primary-300 rounded px-3 py-2 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
          placeholder="Ingresa tu nombre"
          disabled={isLoading}
          autoFocus
        />
        <div className="flex items-center space-x-1">
          <button
            onClick={handleSaveName}
            disabled={isLoading}
            className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Guardar"
          >
            {isLoading ? (
              <Icon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <Icon name="Check" size={16} />
            )}
          </button>
          <button
            onClick={handleCancelEdit}
            disabled={isLoading}
            className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Cancelar"
          >
            <Icon name="X" size={16} />
          </button>
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-200 bg-red-500 bg-opacity-20 px-3 py-1 rounded">
          {error}
        </p>
      )}
      <p className="text-xs text-primary-200">
        Presiona Enter para guardar o Escape para cancelar
      </p>
    </div>
  );
};

export default StudentNameEditor;
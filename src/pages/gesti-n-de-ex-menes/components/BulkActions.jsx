import React from 'react';
import Icon from 'components/AppIcon';

const BulkActions = ({
  selectedCount,
  onActivateAll,
  onDeactivateAll,
  onDeleteAll,
  onClearSelection
}) => {
  return (
    <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              {selectedCount} examen{selectedCount !== 1 ? 'es' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}
            </span>
          </div>
          
          <button
            onClick={onClearSelection}
            className="text-sm text-text-secondary hover:text-primary transition-colors duration-200 ease-in-out"
          >
            Limpiar selección
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onActivateAll}
            className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-success bg-success-50 border border-success-200 rounded-md hover:bg-success-100 transition-colors duration-200 ease-in-out"
          >
            <Icon name="Play" size={16} />
            <span>Activar</span>
          </button>

          <button
            onClick={onDeactivateAll}
            className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-warning bg-warning-50 border border-warning-200 rounded-md hover:bg-warning-100 transition-colors duration-200 ease-in-out"
          >
            <Icon name="Pause" size={16} />
            <span>Desactivar</span>
          </button>

          <button
            onClick={onDeleteAll}
            className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-error bg-error-50 border border-error-200 rounded-md hover:bg-error-100 transition-colors duration-200 ease-in-out"
          >
            <Icon name="Trash2" size={16} />
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;
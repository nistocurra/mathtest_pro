import React from 'react';
import Icon from 'components/AppIcon';

const FilterBar = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  sortBy,
  onSortChange,
  totalExams
}) => {
  return (
    <div className="mb-6 space-y-4">
      {/* Search and Filters Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Search" size={16} className="text-text-secondary" />
          </div>
          <input
            type="text"
            placeholder="Buscar exámenes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field pl-10"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <Icon name="X" size={16} className="text-text-secondary hover:text-primary" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-text-secondary">
              Estado:
            </label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => onFilterStatusChange(e.target.value)}
              className="input-field min-w-0 w-auto"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <label htmlFor="sort-by" className="text-sm font-medium text-text-secondary">
              Ordenar:
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="input-field min-w-0 w-auto"
            >
              <option value="date">Fecha</option>
              <option value="name">Nombre</option>
              <option value="status">Estado</option>
              <option value="questions">Preguntas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <div className="flex items-center space-x-4">
          <span>
            {totalExams === 0 
              ? 'No hay exámenes' 
              : `${totalExams} examen${totalExams !== 1 ? 'es' : ''} encontrado${totalExams !== 1 ? 's' : ''}`
            }
          </span>
          
          {(searchTerm || filterStatus !== 'all') && (
            <div className="flex items-center space-x-2">
              <span>Filtros activos:</span>
              <div className="flex items-center space-x-1">
                {searchTerm && (
                  <span className="inline-flex items-center space-x-1 px-2 py-1 bg-primary-100 text-primary text-xs rounded-full">
                    <span>"{searchTerm}"</span>
                    <button
                      onClick={() => onSearchChange('')}
                      className="hover:text-primary-700"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                )}
                
                {filterStatus !== 'all' && (
                  <span className="inline-flex items-center space-x-1 px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full">
                    <span>{filterStatus === 'active' ? 'Activos' : 'Inactivos'}</span>
                    <button
                      onClick={() => onFilterStatusChange('all')}
                      className="hover:text-secondary-800"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Clear All Filters */}
        {(searchTerm || filterStatus !== 'all') && (
          <button
            onClick={() => {
              onSearchChange('');
              onFilterStatusChange('all');
            }}
            className="text-primary hover:text-primary-700 font-medium transition-colors duration-200 ease-in-out"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
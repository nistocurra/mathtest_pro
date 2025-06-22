// src/pages/gesti-n-de-grupos/components/GroupTable.jsx
import React from 'react';
import Icon from 'components/AppIcon';

const GroupTable = ({ 
  groups, 
  selectedGroups, 
  onSelectGroup, 
  onSelectAll, 
  onEdit, 
  onDelete, 
  onAddStudent, 
  onExport 
}) => {
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
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedGroups.length === groups.length && groups.length > 0}
                  onChange={onSelectAll}
                  className="w-4 h-4 text-primary border-2 border-border rounded focus:ring-primary focus:ring-offset-2"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Grupo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Curso
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Estudiantes
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Activos
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Fecha Creación
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {groups.map((group) => {
              const activeStudents = group.students?.filter(s => {
                const lastAccess = new Date(s.last_access || 0);
                const daysSince = (Date.now() - lastAccess.getTime()) / (1000 * 60 * 60 * 24);
                return daysSince <= 7;
              }).length || 0;

              return (
                <tr
                  key={group.id}
                  className={`hover:bg-secondary-50 transition-colors duration-200 ease-in-out ${
                    selectedGroups.includes(group.id) ? 'bg-primary-50' : ''
                  }`}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(group.id)}
                      onChange={() => onSelectGroup(group.id)}
                      className="w-4 h-4 text-primary border-2 border-border rounded focus:ring-primary focus:ring-offset-2"
                    />
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                        {group.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">
                          {group.name}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {group.teacher?.full_name || 'Profesor'}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary">
                      <Icon name="GraduationCap" size={12} className="mr-1" />
                      {getCourseLabel(group.course)}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <Icon name="Users" size={16} className="text-text-secondary" />
                      <span className="font-medium text-text-primary">
                        {group.student_count || 0}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-success font-medium">
                        {activeStudents}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 text-sm text-text-secondary">
                    {new Date(group.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => onAddStudent(group)}
                        className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-colors duration-200 ease-in-out"
                        title="Agregar estudiante"
                      >
                        <Icon name="UserPlus" size={16} />
                      </button>
                      
                      <button
                        onClick={() => onExport(group.id)}
                        className="p-2 text-text-secondary hover:text-accent hover:bg-accent-50 rounded-lg transition-colors duration-200 ease-in-out"
                        title="Exportar CSV"
                      >
                        <Icon name="Download" size={16} />
                      </button>
                      
                      <button
                        onClick={() => onEdit(group.id, { name: prompt('Nuevo nombre:', group.name) })}
                        className="p-2 text-text-secondary hover:text-warning hover:bg-warning-50 rounded-lg transition-colors duration-200 ease-in-out"
                        title="Editar grupo"
                      >
                        <Icon name="Edit2" size={16} />
                      </button>
                      
                      <button
                        onClick={() => onDelete(group.id)}
                        className="p-2 text-text-secondary hover:text-danger hover:bg-red-50 rounded-lg transition-colors duration-200 ease-in-out"
                        title="Eliminar grupo"
                      >
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {groups.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Users" size={48} className="mx-auto text-secondary-400 mb-4" />
          <p className="text-text-secondary">No hay grupos para mostrar</p>
        </div>
      )}
    </div>
  );
};

export default GroupTable;
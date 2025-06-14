import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const StudentTable = ({ 
  students, 
  selectedStudents, 
  onStudentSelect, 
  onSelectAll, 
  onSort, 
  sortConfig,
  onViewProfile,
  onEdit,
  onResetPassword,
  onToggleStatus
}) => {
  const formatLastAccess = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semana(s)`;
    return `Hace ${Math.ceil(diffDays / 30)} mes(es)`;
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-text-secondary" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  const getStatusColor = (status) => {
    return status === 'active' ?'bg-success-100 text-success border-success-200' :'bg-error-100 text-error border-error-200';
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedStudents.length === students.length && students.length > 0}
                  onChange={onSelectAll}
                  className="rounded border-border text-primary focus:ring-primary"
                />
              </th>
              
              <th 
                className="px-4 py-3 text-left text-sm font-medium text-text-primary cursor-pointer hover:bg-secondary-100 transition-colors duration-200 ease-in-out"
                onClick={() => onSort('name')}
              >
                <div className="flex items-center space-x-2">
                  <span>Estudiante</span>
                  {getSortIcon('name')}
                </div>
              </th>
              
              <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                Estado
              </th>
              
              <th 
                className="px-4 py-3 text-left text-sm font-medium text-text-primary cursor-pointer hover:bg-secondary-100 transition-colors duration-200 ease-in-out"
                onClick={() => onSort('lastAccess')}
              >
                <div className="flex items-center space-x-2">
                  <span>Último Acceso</span>
                  {getSortIcon('lastAccess')}
                </div>
              </th>
              
              <th 
                className="px-4 py-3 text-left text-sm font-medium text-text-primary cursor-pointer hover:bg-secondary-100 transition-colors duration-200 ease-in-out"
                onClick={() => onSort('completedExams')}
              >
                <div className="flex items-center space-x-2">
                  <span>Exámenes</span>
                  {getSortIcon('completedExams')}
                </div>
              </th>
              
              <th 
                className="px-4 py-3 text-left text-sm font-medium text-text-primary cursor-pointer hover:bg-secondary-100 transition-colors duration-200 ease-in-out"
                onClick={() => onSort('averageScore')}
              >
                <div className="flex items-center space-x-2">
                  <span>Promedio</span>
                  {getSortIcon('averageScore')}
                </div>
              </th>
              
              <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                Acciones
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-border">
            {students.map((student) => (
              <tr 
                key={student.id}
                className={`hover:bg-secondary-50 transition-colors duration-200 ease-in-out ${
                  selectedStudents.includes(student.id) ? 'bg-primary-50' : ''
                }`}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => onStudentSelect(student.id)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                </td>
                
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary-100">
                        <Image
                          src={student.avatar}
                          alt={student.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {student.status === 'active' && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border border-surface"></div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {student.name}
                      </p>
                      <p className="text-sm text-text-secondary truncate">
                        {student.email}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {student.grade}
                      </p>
                    </div>
                  </div>
                </td>
                
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(student.status)}`}>
                    {student.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <Icon name="Clock" size={14} />
                    <span>{formatLastAccess(student.lastAccess)}</span>
                  </div>
                </td>
                
                <td className="px-4 py-4">
                  <div className="text-sm">
                    <div className="font-medium text-text-primary">
                      {student.completedExams}/{student.totalExams}
                    </div>
                    <div className="w-16 bg-secondary-200 rounded-full h-1 mt-1">
                      <div
                        className="bg-success h-1 rounded-full transition-all duration-300 ease-smooth"
                        style={{ width: `${(student.completedExams / student.totalExams) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-text-primary">
                    {student.averageScore.toFixed(1)}%
                  </div>
                </td>
                
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewProfile(student)}
                      className="p-1 text-text-secondary hover:text-primary transition-colors duration-200 ease-in-out"
                      title="Ver perfil"
                    >
                      <Icon name="Eye" size={16} />
                    </button>
                    
                    <button
                      onClick={() => onEdit(student)}
                      className="p-1 text-text-secondary hover:text-primary transition-colors duration-200 ease-in-out"
                      title="Editar"
                    >
                      <Icon name="Edit" size={16} />
                    </button>
                    
                    <button
                      onClick={() => onResetPassword(student)}
                      className="p-1 text-text-secondary hover:text-warning transition-colors duration-200 ease-in-out"
                      title="Restablecer contraseña"
                    >
                      <Icon name="Key" size={16} />
                    </button>
                    
                    <button
                      onClick={() => onToggleStatus(student)}
                      className={`p-1 transition-colors duration-200 ease-in-out ${
                        student.status === 'active' ?'text-text-secondary hover:text-error' :'text-text-secondary hover:text-success'
                      }`}
                      title={student.status === 'active' ? 'Desactivar' : 'Activar'}
                    >
                      <Icon name={student.status === 'active' ? 'UserX' : 'UserCheck'} size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
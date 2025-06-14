import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const ExamTable = ({ 
  exams, 
  selectedExams, 
  onSelectExam, 
  onSelectAll, 
  onToggleStatus, 
  onDelete, 
  onDuplicate 
}) => {
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  const getStatusBadge = (status) => {
    const isActive = status === 'active';
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
        isActive 
          ? 'bg-success-100 text-success-600' :'bg-secondary-100 text-secondary-600'
      }`}>
        <Icon name={isActive ? 'CheckCircle' : 'Clock'} size={12} />
        <span>{isActive ? 'Activo' : 'Inactivo'}</span>
      </span>
    );
  };

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-secondary-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedExams.length === exams.length && exams.length > 0}
                  onChange={onSelectAll}
                  className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary focus:ring-2"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Examen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Preguntas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Intentos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Duración
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Completado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Promedio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-border">
            {exams.map((exam) => (
              <tr 
                key={exam.id} 
                className={`hover:bg-secondary-50 transition-colors duration-150 ease-in-out ${
                  selectedExams.includes(exam.id) ? 'bg-primary-50' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedExams.includes(exam.id)}
                    onChange={() => onSelectExam(exam.id)}
                    className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary focus:ring-2"
                  />
                </td>
                
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <div className="text-sm font-medium text-text-primary truncate">
                      {exam.title}
                    </div>
                    <div className="text-sm text-text-secondary truncate">
                      {exam.description}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(exam.status)}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                  {exam.questionsCount}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                  {exam.attemptsAllowed === 'single' ? 'Único' : exam.maxAttempts}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                  {exam.timeLimit} min
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                  {exam.studentsCompleted}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                  {exam.studentsCompleted > 0 ? `${exam.averageScore.toFixed(1)}%` : '-'}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  {formatDate(exam.createdDate)}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {/* Status Toggle */}
                    <button
                      onClick={() => onToggleStatus(exam.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        exam.status === 'active' ? 'bg-success' : 'bg-secondary-300'
                      }`}
                      title={exam.status === 'active' ? 'Desactivar' : 'Activar'}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                          exam.status === 'active' ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    
                    {/* Action Buttons */}
                    <button
                      onClick={() => onDuplicate(exam.id)}
                      className="p-1 text-text-secondary hover:text-primary transition-colors duration-200 ease-in-out"
                      title="Duplicar"
                    >
                      <Icon name="Copy" size={16} />
                    </button>
                    
                    <Link
                      to="/panel-del-profesor"
                      className="p-1 text-text-secondary hover:text-primary transition-colors duration-200 ease-in-out"
                      title="Ver Resultados"
                    >
                      <Icon name="BarChart3" size={16} />
                    </Link>
                    
                    <button
                      onClick={() => onDelete(exam.id)}
                      className="p-1 text-text-secondary hover:text-error transition-colors duration-200 ease-in-out"
                      title="Eliminar"
                    >
                      <Icon name="Trash2" size={16} />
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

export default ExamTable;
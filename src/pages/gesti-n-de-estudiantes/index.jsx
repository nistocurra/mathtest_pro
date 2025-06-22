import React, { useState, useMemo, useEffect } from 'react';
import RoleBasedHeader from 'components/ui/RoleBasedHeader';
import BreadcrumbNavigation from 'components/ui/BreadcrumbNavigation';
import Icon from 'components/AppIcon';
import { useAuth } from 'context/AuthContext';
import studentService from 'services/studentService';
import groupService from 'services/groupService';

import StudentCard from './components/StudentCard';
import StudentTable from './components/StudentTable';
import AddStudentModal from './components/AddStudentModal';
import ImportStudentsModal from './components/ImportStudentsModal';
import StudentProfileModal from './components/StudentProfileModal';

const StudentManagement = () => {
  const [viewMode, setViewMode] = useState('table'); // Default to table view
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [activityFilter, setActivityFilter] = useState('all'); // 'all', 'recent', 'inactive'
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userProfile, updateLastAccess } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        updateLastAccess();
        
        const [studentsData, groupsData] = await Promise.all([
          studentService.getStudents(),
          groupService.getGroups()
        ]);
        
        setStudents(studentsData);
        setGroups(groupsData);
      } catch (err) {
        setError('Error al cargar los datos');
        console.log('Error loading student data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [updateLastAccess]);

  // Filter and sort students
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter(student => {
      const matchesSearch = student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.alias?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Note: We don't have a direct status field, so we'll use a different approach
      const matchesStatus = statusFilter === 'all'; // For now, show all students
      
      const daysSinceLastAccess = student.last_access ? 
        (Date.now() - new Date(student.last_access).getTime()) / (1000 * 60 * 60 * 24) : 
        999; // Default to high number if no last access
      const matchesActivity = activityFilter === 'all' ||
                             (activityFilter === 'recent' && daysSinceLastAccess <= 7) ||
                             (activityFilter === 'inactive' && daysSinceLastAccess > 7);
      
      return matchesSearch && matchesStatus && matchesActivity;
    });

    // Sort students
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      if (sortConfig.key === 'name') {
        aValue = a.full_name || '';
        bValue = b.full_name || '';
      } else if (sortConfig.key === 'lastAccess') {
        aValue = a.last_access ? new Date(a.last_access).getTime() : 0;
        bValue = b.last_access ? new Date(b.last_access).getTime() : 0;
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [students, searchTerm, statusFilter, activityFilter, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredAndSortedStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredAndSortedStudents.map(student => student.id));
    }
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setShowProfileModal(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowAddModal(true);
  };

  const handleResetPassword = async (student) => {
    try {
      const newPassword = 'NuevaContraseña123'; // Generate a proper password
      await studentService.resetStudentPassword(student.id, newPassword);
      alert(`Contraseña restablecida para ${student.full_name}. Nueva contraseña: ${newPassword}`);
    } catch (err) {
      setError('Error al restablecer la contraseña');
      console.log('Error resetting password:', err);
    }
  };

  const handleToggleStatus = (student) => {
    // This would require implementing a status field in the database
    alert(`Funcionalidad de cambio de estado pendiente de implementar para ${student.full_name}.`);
  };

  const handleBulkAction = (action) => {
    const selectedCount = selectedStudents.length;
    if (selectedCount === 0) {
      alert('Por favor selecciona al menos un estudiante.');
      return;
    }

    switch (action) {
      case 'activate':
        alert(`${selectedCount} estudiante(s) activado(s).`);
        break;
      case 'deactivate':
        alert(`${selectedCount} estudiante(s) desactivado(s).`);
        break;
      case 'sendCredentials':
        alert(`Credenciales enviadas a ${selectedCount} estudiante(s).`);
        break;
      case 'resetPasswords':
        alert(`Contraseñas restablecidas para ${selectedCount} estudiante(s).`);
        break;
      default:
        break;
    }
    setSelectedStudents([]);
  };

  const getActivityFilterCount = (filter) => {
    return students.filter(student => {
      const daysSinceLastAccess = student.last_access ? 
        (Date.now() - new Date(student.last_access).getTime()) / (1000 * 60 * 60 * 24) : 
        999;
      switch (filter) {
        case 'recent':
          return daysSinceLastAccess <= 7;
        case 'inactive':
          return daysSinceLastAccess > 7;
        default:
          return true;
      }
    }).length;
  };

  // Transform students data for components
  const transformedStudents = filteredAndSortedStudents.map(student => ({
    id: student.id,
    name: student.full_name || 'Estudiante',
    email: `${student.alias || 'estudiante'}@student.local`, // Constructed email
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(student.full_name || 'E')}&background=random`,
    status: 'active', // Default status
    lastAccess: student.last_access ? new Date(student.last_access) : new Date(),
    completedExams: 0, // Would come from practice_attempts
    totalExams: 0, // Would come from available practices
    averageScore: 0, // Would be calculated from attempts
    registrationDate: new Date(student.created_at),
    phone: 'N/A', // Not stored for privacy
    grade: student.grade_level || 'Sin asignar',
    alias: student.alias,
    totalPoints: student.total_points || 0,
    group: student.group
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <RoleBasedHeader userRole="teacher" userName={userProfile?.full_name || 'Profesor'} />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="text-text-secondary">Cargando estudiantes...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader userRole="teacher" userName={userProfile?.full_name || 'Profesor'} />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation />
          
          {/* Privacy Notice */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Nota informativa</h4>
                <p className="text-blue-800 text-sm">
                  La dirección de correo electrónico de los alumnos no puede ser almacenada por el sistema ya que vulneraría posibles leyes de protección de datos del menor.
                </p>
              </div>
            </div>
          </div>
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Gestión de Estudiantes</h1>
                <p className="text-text-secondary mt-2">
                  Administra cuentas de estudiantes y monitorea su progreso
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowImportModal(true)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Icon name="Upload" size={16} />
                  <span className="hidden sm:inline">Importar CSV</span>
                </button>
                
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Icon name="Plus" size={16} />
                  <span>Agregar Estudiante</span>
                </button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="AlertCircle" size={20} className="text-red-600" />
                <span className="text-red-800">{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-600 hover:text-red-800"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Total Estudiantes</p>
                  <p className="text-2xl font-semibold text-text-primary">{students.length}</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                  <Icon name="UserCheck" size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Activos</p>
                  <p className="text-2xl font-semibold text-text-primary">
                    {students.length} {/* All students are considered active for now */}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                  <Icon name="Activity" size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Activos Recientes</p>
                  <p className="text-2xl font-semibold text-text-primary">
                    {getActivityFilterCount('recent')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={20} className="text-warning" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Promedio Puntos</p>
                  <p className="text-2xl font-semibold text-text-primary">
                    {students.length > 0 ? Math.round(students.reduce((acc, s) => acc + (s.total_points || 0), 0) / students.length) : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="card mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o alias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input-field min-w-32"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="active">Activos</option>
                    <option value="inactive">Inactivos</option>
                  </select>

                  <select
                    value={activityFilter}
                    onChange={(e) => setActivityFilter(e.target.value)}
                    className="input-field min-w-36"
                  >
                    <option value="all">Toda actividad</option>
                    <option value="recent">Recientes (7 días)</option>
                    <option value="inactive">Inactivos (&gt;7 días)</option>
                  </select>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text-secondary">Vista:</span>
                <div className="flex bg-secondary-100 rounded-md p-1">
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`p-2 rounded transition-colors duration-200 ease-in-out ${
                      viewMode === 'cards' ?'bg-surface text-primary shadow-sm' :'text-text-secondary hover:text-primary'
                    }`}
                  >
                    <Icon name="Grid3X3" size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded transition-colors duration-200 ease-in-out ${
                      viewMode === 'table' ?'bg-surface text-primary shadow-sm' :'text-text-secondary hover:text-primary'
                    }`}
                  >
                    <Icon name="List" size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedStudents.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <span className="text-sm text-text-secondary">
                    {selectedStudents.length} estudiante(s) seleccionado(s)
                  </span>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleBulkAction('activate')}
                      className="btn-secondary text-sm"
                    >
                      <Icon name="UserCheck" size={14} className="mr-1" />
                      Activar
                    </button>
                    <button
                      onClick={() => handleBulkAction('deactivate')}
                      className="btn-secondary text-sm"
                    >
                      <Icon name="UserX" size={14} className="mr-1" />
                      Desactivar
                    </button>
                    <button
                      onClick={() => handleBulkAction('sendCredentials')}
                      className="btn-secondary text-sm"
                    >
                      <Icon name="Mail" size={14} className="mr-1" />
                      Enviar Credenciales
                    </button>
                    <button
                      onClick={() => handleBulkAction('resetPasswords')}
                      className="btn-secondary text-sm"
                    >
                      <Icon name="Key" size={14} className="mr-1" />
                      Restablecer Contraseñas
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-text-secondary">
              Mostrando {filteredAndSortedStudents.length} de {students.length} estudiantes
            </p>
            
            {viewMode === 'table' && (
              <button
                onClick={handleSelectAll}
                className="text-sm text-primary hover:text-primary-700 transition-colors duration-200 ease-in-out"
              >
                {selectedStudents.length === filteredAndSortedStudents.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
              </button>
            )}
          </div>

          {/* Students Display */}
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {transformedStudents.map(student => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onViewProfile={handleViewProfile}
                  onEdit={handleEditStudent}
                  onResetPassword={handleResetPassword}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          ) : (
            <StudentTable
              students={transformedStudents}
              selectedStudents={selectedStudents}
              onStudentSelect={handleStudentSelect}
              onSelectAll={handleSelectAll}
              onSort={handleSort}
              sortConfig={sortConfig}
              onViewProfile={handleViewProfile}
              onEdit={handleEditStudent}
              onResetPassword={handleResetPassword}
              onToggleStatus={handleToggleStatus}
            />
          )}

          {/* Empty State */}
          {filteredAndSortedStudents.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Users" size={32} className="text-secondary-600" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">
                No se encontraron estudiantes
              </h3>
              <p className="text-text-secondary mb-4">
                {searchTerm || statusFilter !== 'all' || activityFilter !== 'all' ? 'Intenta ajustar los filtros de búsqueda.': 'Comienza agregando tu primer estudiante.'
                }
              </p>
              {(!searchTerm && statusFilter === 'all' && activityFilter === 'all') && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-primary"
                >
                  <Icon name="Plus" size={16} className="mr-2" />
                  Agregar Primer Estudiante
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddStudentModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        groups={groups}
        onStudentCreated={(newStudent) => {
          setStudents(prev => [newStudent, ...prev]);
          setShowAddModal(false);
          setSelectedStudent(null);
        }}
      />

      <ImportStudentsModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

      <StudentProfileModal
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
      />

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary-700 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 z-1000 md:hidden"
      >
        <Icon name="Plus" size={24} />
      </button>
    </div>
  );
};

export default StudentManagement;
import React, { useState, useMemo } from 'react';
import RoleBasedHeader from 'components/ui/RoleBasedHeader';
import BreadcrumbNavigation from 'components/ui/BreadcrumbNavigation';
import Icon from 'components/AppIcon';

import StudentCard from './components/StudentCard';
import StudentTable from './components/StudentTable';
import AddStudentModal from './components/AddStudentModal';
import ImportStudentsModal from './components/ImportStudentsModal';
import StudentProfileModal from './components/StudentProfileModal';

const StudentManagement = () => {
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [activityFilter, setActivityFilter] = useState('all'); // 'all', 'recent', 'inactive'
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Mock data for students
  const mockStudents = [
    {
      id: 1,
      name: "Ana García López",
      email: "ana.garcia@estudiante.edu",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      status: "active",
      lastAccess: new Date(Date.now() - 86400000), // 1 day ago
      completedExams: 8,
      totalExams: 12,
      averageScore: 85.5,
      registrationDate: new Date(2024, 0, 15),
      phone: "+34 612 345 678",
      grade: "10º Grado"
    },
    {
      id: 2,
      name: "Carlos Rodríguez Martín",
      email: "carlos.rodriguez@estudiante.edu",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      status: "active",
      lastAccess: new Date(Date.now() - 172800000), // 2 days ago
      completedExams: 15,
      totalExams: 18,
      averageScore: 92.3,
      registrationDate: new Date(2024, 0, 10),
      phone: "+34 623 456 789",
      grade: "11º Grado"
    },
    {
      id: 3,
      name: "María Fernández Silva",
      email: "maria.fernandez@estudiante.edu",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      status: "active",
      lastAccess: new Date(Date.now() - 3600000), // 1 hour ago
      completedExams: 6,
      totalExams: 10,
      averageScore: 78.2,
      registrationDate: new Date(2024, 1, 5),
      phone: "+34 634 567 890",
      grade: "9º Grado"
    },
    {
      id: 4,
      name: "David González Ruiz",
      email: "david.gonzalez@estudiante.edu",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      status: "inactive",
      lastAccess: new Date(Date.now() - 1209600000), // 2 weeks ago
      completedExams: 3,
      totalExams: 8,
      averageScore: 65.8,
      registrationDate: new Date(2023, 11, 20),
      phone: "+34 645 678 901",
      grade: "10º Grado"
    },
    {
      id: 5,
      name: "Laura Martínez Pérez",
      email: "laura.martinez@estudiante.edu",
      avatar: "https://randomuser.me/api/portraits/women/5.jpg",
      status: "active",
      lastAccess: new Date(Date.now() - 7200000), // 2 hours ago
      completedExams: 12,
      totalExams: 14,
      averageScore: 88.7,
      registrationDate: new Date(2024, 1, 12),
      phone: "+34 656 789 012",
      grade: "11º Grado"
    },
    {
      id: 6,
      name: "Javier López Torres",
      email: "javier.lopez@estudiante.edu",
      avatar: "https://randomuser.me/api/portraits/men/6.jpg",
      status: "active",
      lastAccess: new Date(Date.now() - 259200000), // 3 days ago
      completedExams: 9,
      totalExams: 11,
      averageScore: 81.4,
      registrationDate: new Date(2024, 0, 25),
      phone: "+34 667 890 123",
      grade: "10º Grado"
    }
  ];

  // Filter and sort students
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = mockStudents.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
      
      const daysSinceLastAccess = (Date.now() - student.lastAccess.getTime()) / (1000 * 60 * 60 * 24);
      const matchesActivity = activityFilter === 'all' ||
                             (activityFilter === 'recent' && daysSinceLastAccess <= 7) ||
                             (activityFilter === 'inactive' && daysSinceLastAccess > 7);
      
      return matchesSearch && matchesStatus && matchesActivity;
    });

    // Sort students
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      if (sortConfig.key === 'lastAccess') {
        aValue = aValue.getTime();
        bValue = bValue.getTime();
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
  }, [mockStudents, searchTerm, statusFilter, activityFilter, sortConfig]);

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

  const handleResetPassword = (student) => {
    alert(`Contraseña restablecida para ${student.name}. Nueva contraseña temporal enviada por email.`);
  };

  const handleToggleStatus = (student) => {
    const newStatus = student.status === 'active' ? 'inactive' : 'active';
    alert(`Estado de ${student.name} cambiado a ${newStatus === 'active' ? 'activo' : 'inactivo'}.`);
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
    return mockStudents.filter(student => {
      const daysSinceLastAccess = (Date.now() - student.lastAccess.getTime()) / (1000 * 60 * 60 * 24);
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

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader userRole="teacher" userName="Prof. García" />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation />
          
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Total Estudiantes</p>
                  <p className="text-2xl font-semibold text-text-primary">{mockStudents.length}</p>
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
                    {mockStudents.filter(s => s.status === 'active').length}
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
                  <p className="text-sm text-text-secondary">Promedio Exámenes</p>
                  <p className="text-2xl font-semibold text-text-primary">
                    {Math.round(mockStudents.reduce((acc, s) => acc + s.completedExams, 0) / mockStudents.length)}
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
                    placeholder="Buscar por nombre o email..."
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
              Mostrando {filteredAndSortedStudents.length} de {mockStudents.length} estudiantes
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
              {filteredAndSortedStudents.map(student => (
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
              students={filteredAndSortedStudents}
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
                {searchTerm || statusFilter !== 'all' || activityFilter !== 'all' ?'Intenta ajustar los filtros de búsqueda.' :'Comienza agregando tu primer estudiante.'}
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
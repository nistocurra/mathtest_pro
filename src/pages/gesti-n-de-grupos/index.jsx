// src/pages/gesti-n-de-grupos/index.jsx
import React, { useState, useEffect } from 'react';
import RoleBasedHeader from 'components/ui/RoleBasedHeader';
import BreadcrumbNavigation from 'components/ui/BreadcrumbNavigation';
import Icon from 'components/AppIcon';
import { useAuth } from 'context/AuthContext';
import groupService from 'services/groupService';
import studentService from 'services/studentService';

import GroupCard from './components/GroupCard';
import GroupTable from './components/GroupTable';
import CreateGroupModal from './components/CreateGroupModal';
import AddStudentToGroupModal from './components/AddStudentToGroupModal';

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userProfile, updateLastAccess } = useAuth();

  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        updateLastAccess();
        
        const data = await groupService.getGroups();
        setGroups(data);
        setFilteredGroups(data);
      } catch (err) {
        setError('Error al cargar los grupos');
        console.log('Error loading groups:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, [updateLastAccess]);

  useEffect(() => {
    let filtered = [...groups];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply course filter
    if (courseFilter !== 'all') {
      filtered = filtered.filter(group => group.course === courseFilter);
    }

    setFilteredGroups(filtered);
  }, [groups, searchTerm, courseFilter]);

  const handleCreateGroup = async (groupData) => {
    try {
      const newGroup = await groupService.createGroup(groupData);
      setGroups(prevGroups => [newGroup, ...prevGroups]);
      setShowCreateModal(false);
    } catch (err) {
      setError('Error al crear el grupo');
      console.log('Error creating group:', err);
    }
  };

  const handleEditGroup = async (groupId, updates) => {
    try {
      const updatedGroup = await groupService.updateGroup(groupId, updates);
      setGroups(prevGroups =>
        prevGroups.map(group =>
          group.id === groupId ? updatedGroup : group
        )
      );
    } catch (err) {
      setError('Error al actualizar el grupo');
      console.log('Error updating group:', err);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este grupo? Los estudiantes no serán eliminados, solo se removerán del grupo.')) {
      try {
        await groupService.deleteGroup(groupId);
        setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
        setSelectedGroups(prevSelected => prevSelected.filter(id => id !== groupId));
      } catch (err) {
        setError('Error al eliminar el grupo');
        console.log('Error deleting group:', err);
      }
    }
  };

  const handleAddStudentToGroup = async (groupId) => {
    try {
      const newStudent = await groupService.addStudentToGroup(groupId);
      
      // Update the group's student count and students array
      setGroups(prevGroups =>
        prevGroups.map(group =>
          group.id === groupId
            ? {
                ...group,
                student_count: group.student_count + 1,
                students: [...(group.students || []), newStudent]
              }
            : group
        )
      );
      
      setShowAddStudentModal(false);
      setSelectedGroup(null);
    } catch (err) {
      setError('Error al agregar estudiante al grupo');
      console.log('Error adding student to group:', err);
    }
  };

  const handleExportGroup = async (groupId) => {
    try {
      await groupService.exportGroupToCSV(groupId);
    } catch (err) {
      setError('Error al exportar el grupo');
      console.log('Error exporting group:', err);
    }
  };

  const handleSelectGroup = (groupId) => {
    setSelectedGroups(prevSelected =>
      prevSelected.includes(groupId)
        ? prevSelected.filter(id => id !== groupId)
        : [...prevSelected, groupId]
    );
  };

  const handleSelectAll = () => {
    if (selectedGroups.length === filteredGroups.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(filteredGroups.map(group => group.id));
    }
  };

  const courseOptions = [
    { value: 'all', label: 'Todos los cursos' },
    { value: '1ESO', label: '1º ESO' },
    { value: '2ESO', label: '2º ESO' },
    { value: '3ESO', label: '3º ESO' },
    { value: '4ESO', label: '4º ESO' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <RoleBasedHeader userRole="teacher" userName={userProfile?.full_name || 'Profesor'} />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="text-text-secondary">Cargando grupos...</span>
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
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Gestión de Grupos</h1>
                <p className="text-text-secondary mt-2">
                  Crea y administra grupos de estudiantes por curso
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* View Mode Toggle */}
                <div className="hidden lg:flex bg-secondary-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out ${
                      viewMode === 'cards' ?'bg-surface text-primary shadow-sm' :'text-text-secondary hover:text-primary'
                    }`}
                  >
                    <Icon name="Grid3X3" size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out ${
                      viewMode === 'table' ?'bg-surface text-primary shadow-sm' :'text-text-secondary hover:text-primary'
                    }`}
                  >
                    <Icon name="List" size={16} />
                  </button>
                </div>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Icon name="Plus" size={20} />
                  <span className="hidden sm:inline">Crear Grupo</span>
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
                  <p className="text-sm text-text-secondary">Total Grupos</p>
                  <p className="text-2xl font-semibold text-text-primary">{groups.length}</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                  <Icon name="UserCheck" size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Total Estudiantes</p>
                  <p className="text-2xl font-semibold text-text-primary">
                    {groups.reduce((sum, group) => sum + (group.student_count || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                  <Icon name="GraduationCap" size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Cursos Activos</p>
                  <p className="text-2xl font-semibold text-text-primary">
                    {new Set(groups.map(g => g.course)).size}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={20} className="text-warning" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Promedio por Grupo</p>
                  <p className="text-2xl font-semibold text-text-primary">
                    {groups.length > 0 ? Math.round(groups.reduce((sum, g) => sum + (g.student_count || 0), 0) / groups.length) : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="card mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                  <input
                    type="text"
                    placeholder="Buscar grupos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>

                {/* Course Filter */}
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="input-field min-w-40"
                >
                  {courseOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-text-secondary">
              Mostrando {filteredGroups.length} de {groups.length} grupos
            </p>
            
            {viewMode === 'table' && filteredGroups.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="text-sm text-primary hover:text-primary-700 transition-colors duration-200 ease-in-out"
              >
                {selectedGroups.length === filteredGroups.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
              </button>
            )}
          </div>

          {/* Groups Display */}
          {filteredGroups.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Users" size={32} className="text-secondary-600" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">
                {searchTerm || courseFilter !== 'all' ? 'No se encontraron grupos' : 'No hay grupos creados'}
              </h3>
              <p className="text-text-secondary mb-4">
                {searchTerm || courseFilter !== 'all' ? 'Intenta ajustar los filtros de búsqueda.': 'Comienza creando tu primer grupo de estudiantes.'
                }
              </p>
              {(!searchTerm && courseFilter === 'all') && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary"
                >
                  <Icon name="Plus" size={16} className="mr-2" />
                  Crear Primer Grupo
                </button>
              )}
            </div>
          ) : (
            <>
              {viewMode === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredGroups.map(group => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      isSelected={selectedGroups.includes(group.id)}
                      onSelect={() => handleSelectGroup(group.id)}
                      onEdit={(updates) => handleEditGroup(group.id, updates)}
                      onDelete={() => handleDeleteGroup(group.id)}
                      onAddStudent={() => {
                        setSelectedGroup(group);
                        setShowAddStudentModal(true);
                      }}
                      onExport={() => handleExportGroup(group.id)}
                    />
                  ))}
                </div>
              ) : (
                <GroupTable
                  groups={filteredGroups}
                  selectedGroups={selectedGroups}
                  onSelectGroup={handleSelectGroup}
                  onSelectAll={handleSelectAll}
                  onEdit={handleEditGroup}
                  onDelete={handleDeleteGroup}
                  onAddStudent={(group) => {
                    setSelectedGroup(group);
                    setShowAddStudentModal(true);
                  }}
                  onExport={handleExportGroup}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateGroup}
        courseOptions={courseOptions.filter(opt => opt.value !== 'all')}
      />

      <AddStudentToGroupModal
        isOpen={showAddStudentModal}
        onClose={() => {
          setShowAddStudentModal(false);
          setSelectedGroup(null);
        }}
        group={selectedGroup}
        onAddStudent={handleAddStudentToGroup}
      />

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary-700 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 z-1000 md:hidden"
      >
        <Icon name="Plus" size={24} />
      </button>
    </div>
  );
};

export default GroupManagement;
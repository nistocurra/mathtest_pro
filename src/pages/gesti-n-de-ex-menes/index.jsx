import React, { useState, useEffect } from 'react';

import Icon from 'components/AppIcon';
import RoleBasedHeader from 'components/ui/RoleBasedHeader';
import BreadcrumbNavigation from 'components/ui/BreadcrumbNavigation';
import { useAuth } from 'context/AuthContext';
import practiceService from 'services/practiceService';
import ExamCard from './components/ExamCard';
import ExamTable from './components/ExamTable';
import CreateExamModal from './components/CreateExamModal';
import FilterBar from './components/FilterBar';
import BulkActions from './components/BulkActions';

const PracticeManagement = () => {
  const [practices, setPractices] = useState([]);
  const [filteredPractices, setFilteredPractices] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // Default to table view
  const [selectedPractices, setSelectedPractices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userProfile, updateLastAccess } = useAuth();

  useEffect(() => {
    const loadPractices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        updateLastAccess();
        
        const data = await practiceService.getPractices();
        setPractices(data);
        setFilteredPractices(data);
      } catch (err) {
        setError('Error al cargar las prácticas');
        console.log('Error loading practices:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPractices();
  }, [updateLastAccess]);

  useEffect(() => {
    let filtered = [...practices];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(practice =>
        practice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        practice.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      const isActive = filterStatus === 'active';
      filtered = filtered.filter(practice => practice.is_active === isActive);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'name':
          return a.title.localeCompare(b.title);
        case 'status':
          return (b.is_active ? 1 : 0) - (a.is_active ? 1 : 0);
        case 'questions':
          const aQuestions = Array.isArray(a.questions) ? a.questions.length : 0;
          const bQuestions = Array.isArray(b.questions) ? b.questions.length : 0;
          return bQuestions - aQuestions;
        default:
          return 0;
      }
    });

    setFilteredPractices(filtered);
  }, [practices, searchTerm, filterStatus, sortBy]);

  const handleToggleStatus = async (practiceId) => {
    try {
      const practice = practices.find(p => p.id === practiceId);
      if (!practice) return;

      const updatedPractice = await practiceService.togglePracticeStatus(practiceId, practice.is_active ? 'active' : 'inactive');
      
      setPractices(prevPractices =>
        prevPractices.map(p =>
          p.id === practiceId ? { ...p, is_active: updatedPractice.is_active } : p
        )
      );
    } catch (err) {
      setError('Error al cambiar el estado de la práctica');
      console.log('Error toggling practice status:', err);
    }
  };

  const handleDeletePractice = async (practiceId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta práctica? Esta acción no se puede deshacer.')) {
      try {
        await practiceService.deletePractice(practiceId);
        setPractices(prevPractices => prevPractices.filter(practice => practice.id !== practiceId));
        setSelectedPractices(prevSelected => prevSelected.filter(id => id !== practiceId));
      } catch (err) {
        setError('Error al eliminar la práctica');
        console.log('Error deleting practice:', err);
      }
    }
  };

  const handleDuplicatePractice = async (practiceId) => {
    try {
      const duplicatedPractice = await practiceService.duplicatePractice(practiceId);
      setPractices(prevPractices => [duplicatedPractice, ...prevPractices]);
    } catch (err) {
      setError('Error al duplicar la práctica');
      console.log('Error duplicating practice:', err);
    }
  };

  const handleCreatePractice = async (practiceData) => {
    try {
      const newPractice = await practiceService.createPractice(practiceData);
      setPractices(prevPractices => [newPractice, ...prevPractices]);
      setIsCreateModalOpen(false);
    } catch (err) {
      setError('Error al crear la práctica');
      console.log('Error creating practice:', err);
    }
  };

  const handleBulkStatusChange = async (status) => {
    try {
      const isActive = status === 'active';
      
      // Update all selected practices
      for (const practiceId of selectedPractices) {
        await practiceService.togglePracticeStatus(practiceId, status);
      }
      
      setPractices(prevPractices =>
        prevPractices.map(practice =>
          selectedPractices.includes(practice.id)
            ? { ...practice, is_active: isActive }
            : practice
        )
      );
      setSelectedPractices([]);
    } catch (err) {
      setError('Error al cambiar el estado de las prácticas');
      console.log('Error updating bulk status:', err);
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar ${selectedPractices.length} prácticas? Esta acción no se puede deshacer.`)) {
      try {
        for (const practiceId of selectedPractices) {
          await practiceService.deletePractice(practiceId);
        }
        
        setPractices(prevPractices => prevPractices.filter(practice => !selectedPractices.includes(practice.id)));
        setSelectedPractices([]);
      } catch (err) {
        setError('Error al eliminar las prácticas');
        console.log('Error deleting practices:', err);
      }
    }
  };

  const handleSelectPractice = (practiceId) => {
    setSelectedPractices(prevSelected =>
      prevSelected.includes(practiceId)
        ? prevSelected.filter(id => id !== practiceId)
        : [...prevSelected, practiceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPractices.length === filteredPractices.length) {
      setSelectedPractices([]);
    } else {
      setSelectedPractices(filteredPractices.map(practice => practice.id));
    }
  };

  // Transform practices data for components
  const transformedPractices = filteredPractices.map(practice => ({
    id: practice.id,
    title: practice.title,
    description: practice.description || '',
    createdDate: new Date(practice.created_at),
    status: practice.is_active ? 'active' : 'inactive',
    questionsCount: Array.isArray(practice.questions) ? practice.questions.length : 0,
    attemptsAllowed: practice.attempts_allowed === 1 ? 'single' : 'multiple',
    maxAttempts: practice.attempts_allowed,
    timeLimit: practice.duration_minutes,
    studentsCompleted: 0, // This would come from practice_attempts
    averageScore: 0, // This would come from practice_attempts
    lastModified: new Date(practice.updated_at)
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <RoleBasedHeader userRole="teacher" userName={userProfile?.full_name || 'Profesor'} />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="text-text-secondary">Cargando prácticas...</span>
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  Gestión de Prácticas
                </h1>
                <p className="text-text-secondary">
                  Crea, modifica y administra tus evaluaciones matemáticas
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0 flex items-center space-x-3">
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

                {/* Create Practice Button */}
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Icon name="Plus" size={20} />
                  <span className="hidden sm:inline">Crear Práctica</span>
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

          {/* Filter Bar */}
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalExams={filteredPractices.length}
          />

          {/* Bulk Actions */}
          {selectedPractices.length > 0 && (
            <BulkActions
              selectedCount={selectedPractices.length}
              onActivateAll={() => handleBulkStatusChange('active')}
              onDeactivateAll={() => handleBulkStatusChange('inactive')}
              onDeleteAll={handleBulkDelete}
              onClearSelection={() => setSelectedPractices([])}
            />
          )}

          {/* Content Area */}
          {filteredPractices.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="FileText" size={48} className="text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No se encontraron prácticas' : 'No hay prácticas creadas'}
              </h3>
              <p className="text-text-secondary mb-6">
                {searchTerm || filterStatus !== 'all' ? 'Intenta ajustar los filtros de búsqueda': 'Comienza creando tu primera práctica matemática'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn-primary"
                >
                  Crear Primera Práctica
                </button>
              )}
            </div>
          ) : (
            <>
              {viewMode === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {transformedPractices.map((practice) => (
                    <ExamCard
                      key={practice.id}
                      exam={practice}
                      isSelected={selectedPractices.includes(practice.id)}
                      onSelect={() => handleSelectPractice(practice.id)}
                      onToggleStatus={() => handleToggleStatus(practice.id)}
                      onDelete={() => handleDeletePractice(practice.id)}
                      onDuplicate={() => handleDuplicatePractice(practice.id)}
                    />
                  ))}
                </div>
              ) : (
                <ExamTable
                  exams={transformedPractices}
                  selectedExams={selectedPractices}
                  onSelectExam={handleSelectPractice}
                  onSelectAll={handleSelectAll}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeletePractice}
                  onDuplicate={handleDuplicatePractice}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors duration-200 ease-in-out z-1000 flex items-center justify-center"
      >
        <Icon name="Plus" size={24} />
      </button>

      {/* Create Practice Modal */}
      {isCreateModalOpen && (
        <CreateExamModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreatePractice}
        />
      )}
    </div>
  );
};

export default PracticeManagement;
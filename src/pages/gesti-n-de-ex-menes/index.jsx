import React, { useState, useEffect } from 'react';

import Icon from 'components/AppIcon';
import RoleBasedHeader from 'components/ui/RoleBasedHeader';
import BreadcrumbNavigation from 'components/ui/BreadcrumbNavigation';
import ExamCard from './components/ExamCard';
import ExamTable from './components/ExamTable';
import CreateExamModal from './components/CreateExamModal';
import FilterBar from './components/FilterBar';
import BulkActions from './components/BulkActions';

const ExamManagement = () => {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [selectedExams, setSelectedExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for exams
  const mockExams = [
    {
      id: 1,
      title: "Álgebra Básica - Ecuaciones Lineales",
      description: "Examen sobre resolución de ecuaciones lineales de primer grado y sistemas de ecuaciones.",
      createdDate: new Date('2024-01-15'),
      status: 'active',
      questionsCount: 25,
      attemptsAllowed: 'multiple',
      maxAttempts: 3,
      timeLimit: 60,
      studentsCompleted: 18,
      averageScore: 78.5,
      lastModified: new Date('2024-01-20')
    },
    {
      id: 2,
      title: "Geometría - Triángulos y Cuadriláteros",
      description: "Evaluación de conceptos fundamentales sobre propiedades de triángulos y cuadriláteros.",
      createdDate: new Date('2024-01-10'),
      status: 'inactive',
      questionsCount: 20,
      attemptsAllowed: 'single',
      maxAttempts: 1,
      timeLimit: 45,
      studentsCompleted: 0,
      averageScore: 0,
      lastModified: new Date('2024-01-12')
    },
    {
      id: 3,
      title: "Cálculo Diferencial - Límites",
      description: "Examen avanzado sobre cálculo de límites y continuidad de funciones.",
      createdDate: new Date('2024-01-08'),
      status: 'active',
      questionsCount: 30,
      attemptsAllowed: 'multiple',
      maxAttempts: 2,
      timeLimit: 90,
      studentsCompleted: 12,
      averageScore: 82.3,
      lastModified: new Date('2024-01-18')
    },
    {
      id: 4,
      title: "Estadística - Probabilidad Básica",
      description: "Conceptos fundamentales de probabilidad y distribuciones estadísticas.",
      createdDate: new Date('2024-01-05'),
      status: 'active',
      questionsCount: 15,
      attemptsAllowed: 'single',
      maxAttempts: 1,
      timeLimit: 30,
      studentsCompleted: 25,
      averageScore: 75.8,
      lastModified: new Date('2024-01-15')
    },
    {
      id: 5,
      title: "Trigonometría - Funciones Básicas",
      description: "Evaluación sobre seno, coseno, tangente y sus aplicaciones.",
      createdDate: new Date('2024-01-03'),
      status: 'inactive',
      questionsCount: 22,
      attemptsAllowed: 'multiple',
      maxAttempts: 3,
      timeLimit: 50,
      studentsCompleted: 8,
      averageScore: 68.2,
      lastModified: new Date('2024-01-10')
    }
  ];

  useEffect(() => {
    // Simulate loading
    const loadExams = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setExams(mockExams);
      setFilteredExams(mockExams);
      setIsLoading(false);
    };

    loadExams();
  }, []);

  useEffect(() => {
    let filtered = [...exams];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(exam =>
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(exam => exam.status === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdDate) - new Date(a.createdDate);
        case 'name':
          return a.title.localeCompare(b.title);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'questions':
          return b.questionsCount - a.questionsCount;
        default:
          return 0;
      }
    });

    setFilteredExams(filtered);
  }, [exams, searchTerm, filterStatus, sortBy]);

  const handleToggleStatus = (examId) => {
    setExams(prevExams =>
      prevExams.map(exam =>
        exam.id === examId
          ? { ...exam, status: exam.status === 'active' ? 'inactive' : 'active' }
          : exam
      )
    );
  };

  const handleDeleteExam = (examId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este examen? Esta acción no se puede deshacer.')) {
      setExams(prevExams => prevExams.filter(exam => exam.id !== examId));
      setSelectedExams(prevSelected => prevSelected.filter(id => id !== examId));
    }
  };

  const handleDuplicateExam = (examId) => {
    const examToDuplicate = exams.find(exam => exam.id === examId);
    if (examToDuplicate) {
      const newExam = {
        ...examToDuplicate,
        id: Math.max(...exams.map(e => e.id)) + 1,
        title: `${examToDuplicate.title} (Copia)`,
        createdDate: new Date(),
        status: 'inactive',
        studentsCompleted: 0,
        averageScore: 0,
        lastModified: new Date()
      };
      setExams(prevExams => [newExam, ...prevExams]);
    }
  };

  const handleCreateExam = (examData) => {
    const newExam = {
      id: Math.max(...exams.map(e => e.id)) + 1,
      ...examData,
      createdDate: new Date(),
      status: 'inactive',
      studentsCompleted: 0,
      averageScore: 0,
      lastModified: new Date()
    };
    setExams(prevExams => [newExam, ...prevExams]);
    setIsCreateModalOpen(false);
  };

  const handleBulkStatusChange = (status) => {
    setExams(prevExams =>
      prevExams.map(exam =>
        selectedExams.includes(exam.id)
          ? { ...exam, status }
          : exam
      )
    );
    setSelectedExams([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar ${selectedExams.length} exámenes? Esta acción no se puede deshacer.`)) {
      setExams(prevExams => prevExams.filter(exam => !selectedExams.includes(exam.id)));
      setSelectedExams([]);
    }
  };

  const handleSelectExam = (examId) => {
    setSelectedExams(prevSelected =>
      prevSelected.includes(examId)
        ? prevSelected.filter(id => id !== examId)
        : [...prevSelected, examId]
    );
  };

  const handleSelectAll = () => {
    if (selectedExams.length === filteredExams.length) {
      setSelectedExams([]);
    } else {
      setSelectedExams(filteredExams.map(exam => exam.id));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <RoleBasedHeader userRole="teacher" userName="Prof. García" />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="text-text-secondary">Cargando exámenes...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader userRole="teacher" userName="Prof. García" />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation />
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  Gestión de Exámenes
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

                {/* Create Exam Button */}
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Icon name="Plus" size={20} />
                  <span className="hidden sm:inline">Crear Examen</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalExams={filteredExams.length}
          />

          {/* Bulk Actions */}
          {selectedExams.length > 0 && (
            <BulkActions
              selectedCount={selectedExams.length}
              onActivateAll={() => handleBulkStatusChange('active')}
              onDeactivateAll={() => handleBulkStatusChange('inactive')}
              onDeleteAll={handleBulkDelete}
              onClearSelection={() => setSelectedExams([])}
            />
          )}

          {/* Content Area */}
          {filteredExams.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="FileText" size={48} className="text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No se encontraron exámenes' : 'No hay exámenes creados'}
              </h3>
              <p className="text-text-secondary mb-6">
                {searchTerm || filterStatus !== 'all' ?'Intenta ajustar los filtros de búsqueda' :'Comienza creando tu primer examen matemático'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn-primary"
                >
                  Crear Primer Examen
                </button>
              )}
            </div>
          ) : (
            <>
              {viewMode === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredExams.map((exam) => (
                    <ExamCard
                      key={exam.id}
                      exam={exam}
                      isSelected={selectedExams.includes(exam.id)}
                      onSelect={() => handleSelectExam(exam.id)}
                      onToggleStatus={() => handleToggleStatus(exam.id)}
                      onDelete={() => handleDeleteExam(exam.id)}
                      onDuplicate={() => handleDuplicateExam(exam.id)}
                    />
                  ))}
                </div>
              ) : (
                <ExamTable
                  exams={filteredExams}
                  selectedExams={selectedExams}
                  onSelectExam={handleSelectExam}
                  onSelectAll={handleSelectAll}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteExam}
                  onDuplicate={handleDuplicateExam}
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

      {/* Create Exam Modal */}
      {isCreateModalOpen && (
        <CreateExamModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateExam}
        />
      )}
    </div>
  );
};

export default ExamManagement;
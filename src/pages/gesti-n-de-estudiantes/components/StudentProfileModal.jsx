import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const StudentProfileModal = ({ isOpen, onClose, student }) => {
  const [activeTab, setActiveTab] = useState('profile');

  if (!isOpen || !student) return null;

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatLastAccess = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semana(s)`;
    return `Hace ${Math.ceil(diffDays / 30)} mes(es)`;
  };

  // Mock exam history data
  const examHistory = [
    {
      id: 1,
      name: "Álgebra Básica - Ecuaciones Lineales",
      date: new Date(2024, 2, 15),
      score: 85,
      totalQuestions: 20,
      correctAnswers: 17,
      timeSpent: "25 min",
      status: "completed"
    },
    {
      id: 2,
      name: "Geometría - Triángulos y Ángulos",
      date: new Date(2024, 2, 10),
      score: 92,
      totalQuestions: 15,
      correctAnswers: 14,
      timeSpent: "18 min",
      status: "completed"
    },
    {
      id: 3,
      name: "Aritmética - Fracciones",
      date: new Date(2024, 2, 5),
      score: 78,
      totalQuestions: 25,
      correctAnswers: 19,
      timeSpent: "32 min",
      status: "completed"
    },
    {
      id: 4,
      name: "Estadística Básica",
      date: new Date(2024, 1, 28),
      score: 88,
      totalQuestions: 18,
      correctAnswers: 16,
      timeSpent: "22 min",
      status: "completed"
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return 'bg-success-100';
    if (score >= 70) return 'bg-warning-100';
    return 'bg-error-100';
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: 'User' },
    { id: 'exams', label: 'Historial de Exámenes', icon: 'FileText' },
    { id: 'stats', label: 'Estadísticas', icon: 'BarChart3' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-1020 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg max-w-4xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary-100">
                  <Image
                    src={student.avatar}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {student.status === 'active' && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-surface"></div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-text-primary">
                  {student.name}
                </h2>
                <p className="text-text-secondary">{student.email}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-text-secondary">{student.grade}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                    student.status === 'active' ?'bg-success-100 text-success border-success-200' :'bg-error-100 text-error border-error-200'
                  }`}>
                    {student.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-primary transition-colors duration-200 ease-in-out"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ease-in-out ${
                  activeTab === tab.id
                    ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-primary hover:border-secondary-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Información Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-text-secondary">Nombre Completo</label>
                      <p className="text-text-primary">{student.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-secondary">Email</label>
                      <p className="text-text-primary">{student.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-secondary">Teléfono</label>
                      <p className="text-text-primary">{student.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-text-secondary">Grado</label>
                      <p className="text-text-primary">{student.grade}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-secondary">Fecha de Registro</label>
                      <p className="text-text-primary">{formatDate(student.registrationDate)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-secondary">Último Acceso</label>
                      <p className="text-text-primary">{formatLastAccess(student.lastAccess)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Resumen de Actividad
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="card text-center">
                    <div className="text-2xl font-bold text-text-primary mb-1">
                      {student.completedExams}
                    </div>
                    <div className="text-sm text-text-secondary">Exámenes Completados</div>
                  </div>
                  <div className="card text-center">
                    <div className="text-2xl font-bold text-text-primary mb-1">
                      {student.averageScore.toFixed(1)}%
                    </div>
                    <div className="text-sm text-text-secondary">Promedio General</div>
                  </div>
                  <div className="card text-center">
                    <div className="text-2xl font-bold text-text-primary mb-1">
                      {Math.round((student.completedExams / student.totalExams) * 100)}%
                    </div>
                    <div className="text-sm text-text-secondary">Progreso</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">
                  Historial de Exámenes
                </h3>
                <span className="text-sm text-text-secondary">
                  {examHistory.length} exámenes completados
                </span>
              </div>

              <div className="space-y-3">
                {examHistory.map(exam => (
                  <div key={exam.id} className="card hover:shadow-md transition-shadow duration-200 ease-in-out">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-text-primary mb-1">
                          {exam.name}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-text-secondary">
                          <div className="flex items-center space-x-1">
                            <Icon name="Calendar" size={14} />
                            <span>{formatDate(exam.date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Icon name="Clock" size={14} />
                            <span>{exam.timeSpent}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Icon name="CheckCircle" size={14} />
                            <span>{exam.correctAnswers}/{exam.totalQuestions} correctas</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(exam.score)}`}>
                          {exam.score}%
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBgColor(exam.score)} ${getScoreColor(exam.score)}`}>
                          {exam.score >= 90 ? 'Excelente' : exam.score >= 70 ? 'Bueno' : 'Necesita Mejora'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text-primary">
                Estadísticas Detalladas
              </h3>

              {/* Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <h4 className="font-medium text-text-primary mb-3">Rendimiento por Materia</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Álgebra</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-secondary-200 rounded-full h-2">
                          <div className="bg-success h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <span className="text-sm font-medium text-text-primary">85%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Geometría</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-secondary-200 rounded-full h-2">
                          <div className="bg-success h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                        <span className="text-sm font-medium text-text-primary">92%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Aritmética</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-secondary-200 rounded-full h-2">
                          <div className="bg-warning h-2 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                        <span className="text-sm font-medium text-text-primary">78%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Estadística</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-secondary-200 rounded-full h-2">
                          <div className="bg-success h-2 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                        <span className="text-sm font-medium text-text-primary">88%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h4 className="font-medium text-text-primary mb-3">Tendencia de Rendimiento</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Último mes</span>
                      <div className="flex items-center space-x-2">
                        <Icon name="TrendingUp" size={16} className="text-success" />
                        <span className="text-sm font-medium text-success">+5.2%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Últimos 3 meses</span>
                      <div className="flex items-center space-x-2">
                        <Icon name="TrendingUp" size={16} className="text-success" />
                        <span className="text-sm font-medium text-success">+12.8%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Tiempo promedio</span>
                      <span className="text-sm font-medium text-text-primary">24 min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Mejor racha</span>
                      <span className="text-sm font-medium text-text-primary">5 exámenes</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card text-center">
                  <div className="text-xl font-bold text-text-primary mb-1">24</div>
                  <div className="text-xs text-text-secondary">Tiempo Promedio (min)</div>
                </div>
                <div className="card text-center">
                  <div className="text-xl font-bold text-text-primary mb-1">95%</div>
                  <div className="text-xs text-text-secondary">Tasa de Finalización</div>
                </div>
                <div className="card text-center">
                  <div className="text-xl font-bold text-text-primary mb-1">3</div>
                  <div className="text-xs text-text-secondary">Intentos Promedio</div>
                </div>
                <div className="card text-center">
                  <div className="text-xl font-bold text-text-primary mb-1">18</div>
                  <div className="text-xs text-text-secondary">Días Activo</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cerrar
            </button>
            <button
              onClick={() => alert(`Editando perfil de ${student.name}`)}
              className="btn-primary flex items-center space-x-2"
            >
              <Icon name="Edit" size={16} />
              <span>Editar Estudiante</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileModal;
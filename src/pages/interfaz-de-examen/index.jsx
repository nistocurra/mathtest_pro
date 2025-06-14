import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import RoleBasedHeader from 'components/ui/RoleBasedHeader';
import ExamProgressIndicator from 'components/ui/ExamProgressIndicator';
import QuestionDisplay from './components/QuestionDisplay';
import NavigationControls from './components/NavigationControls';
import ExamSummary from './components/ExamSummary';
import ExamResults from './components/ExamResults';

const ExamInterface = () => {
  const navigate = useNavigate();
  
  // Mock exam data
  const mockExam = {
    id: 1,
    title: "Álgebra Básica - Evaluación Trimestral",
    description: "Examen de álgebra que cubre ecuaciones lineales, sistemas de ecuaciones y factorización",
    timeLimit: 90, // minutes
    totalQuestions: 20,
    allowReview: true,
    multipleAttempts: false,
    questions: [
      {
        id: 1,
        question: "Resuelve la ecuación: 2x + 5 = 13",
        type: "multiple_choice",
        options: [
          { id: "a", text: "x = 3", isCorrect: false },
          { id: "b", text: "x = 4", isCorrect: true },
          { id: "c", text: "x = 5", isCorrect: false },
          { id: "d", text: "x = 6", isCorrect: false }
        ]
      },
      {
        id: 2,
        question: "¿Cuál es el resultado de (x + 3)(x - 2)?",
        type: "multiple_choice",
        options: [
          { id: "a", text: "x² + x - 6", isCorrect: true },
          { id: "b", text: "x² - x - 6", isCorrect: false },
          { id: "c", text: "x² + x + 6", isCorrect: false },
          { id: "d", text: "x² - x + 6", isCorrect: false }
        ]
      },
      {
        id: 3,
        question: "Si 3x - 7 = 2x + 1, entonces x es igual a:",
        type: "multiple_choice",
        options: [
          { id: "a", text: "6", isCorrect: false },
          { id: "b", text: "7", isCorrect: false },
          { id: "c", text: "8", isCorrect: true },
          { id: "d", text: "9", isCorrect: false }
        ]
      },
      {
        id: 4,
        question: "Factoriza completamente: x² - 9",
        type: "multiple_choice",
        options: [
          { id: "a", text: "(x - 3)(x - 3)", isCorrect: false },
          { id: "b", text: "(x + 3)(x - 3)", isCorrect: true },
          { id: "c", text: "(x + 3)(x + 3)", isCorrect: false },
          { id: "d", text: "No se puede factorizar", isCorrect: false }
        ]
      },
      {
        id: 5,
        question: "Resuelve el sistema de ecuaciones:\nx + y = 7\n2x - y = 2",
        type: "multiple_choice",
        options: [
          { id: "a", text: "x = 3, y = 4", isCorrect: true },
          { id: "b", text: "x = 4, y = 3", isCorrect: false },
          { id: "c", text: "x = 2, y = 5", isCorrect: false },
          { id: "d", text: "x = 5, y = 2", isCorrect: false }
        ]
      },
      {
        id: 6,
        question: "¿Cuál es la pendiente de la recta que pasa por los puntos (2, 3) y (4, 7)?",
        type: "multiple_choice",
        options: [
          { id: "a", text: "1", isCorrect: false },
          { id: "b", text: "2", isCorrect: true },
          { id: "c", text: "3", isCorrect: false },
          { id: "d", text: "4", isCorrect: false }
        ]
      },
      {
        id: 7,
        question: "Simplifica: (2x³y²)(3xy⁴)",
        type: "multiple_choice",
        options: [
          { id: "a", text: "5x⁴y⁶", isCorrect: false },
          { id: "b", text: "6x⁴y⁶", isCorrect: true },
          { id: "c", text: "6x³y⁶", isCorrect: false },
          { id: "d", text: "5x³y⁶", isCorrect: false }
        ]
      },
      {
        id: 8,
        question: "Si f(x) = 2x + 1, ¿cuál es f(3)?",
        type: "multiple_choice",
        options: [
          { id: "a", text: "5", isCorrect: false },
          { id: "b", text: "6", isCorrect: false },
          { id: "c", text: "7", isCorrect: true },
          { id: "d", text: "8", isCorrect: false }
        ]
      },
      {
        id: 9,
        question: "Resuelve para x: x² - 5x + 6 = 0",
        type: "multiple_choice",
        options: [
          { id: "a", text: "x = 1, x = 6", isCorrect: false },
          { id: "b", text: "x = 2, x = 3", isCorrect: true },
          { id: "c", text: "x = -2, x = -3", isCorrect: false },
          { id: "d", text: "x = 0, x = 5", isCorrect: false }
        ]
      },
      {
        id: 10,
        question: "¿Cuál es el valor de x en la ecuación: log₂(x) = 3?",
        type: "multiple_choice",
        options: [
          { id: "a", text: "6", isCorrect: false },
          { id: "b", text: "8", isCorrect: true },
          { id: "c", text: "9", isCorrect: false },
          { id: "d", text: "12", isCorrect: false }
        ]
      },
      {
        id: 11,
        question: "Encuentra la ecuación de la recta que pasa por (1, 2) con pendiente m = 3",
        type: "multiple_choice",
        options: [
          { id: "a", text: "y = 3x - 1", isCorrect: true },
          { id: "b", text: "y = 3x + 1", isCorrect: false },
          { id: "c", text: "y = 3x - 2", isCorrect: false },
          { id: "d", text: "y = 3x + 2", isCorrect: false }
        ]
      },
      {
        id: 12,
        question: "Simplifica: √(16x⁴y²)",
        type: "multiple_choice",
        options: [
          { id: "a", text: "4x²y", isCorrect: true },
          { id: "b", text: "4xy²", isCorrect: false },
          { id: "c", text: "16x²y", isCorrect: false },
          { id: "d", text: "8x²y", isCorrect: false }
        ]
      },
      {
        id: 13,
        question: "¿Cuál es el dominio de f(x) = 1/(x - 2)?",
        type: "multiple_choice",
        options: [
          { id: "a", text: "Todos los números reales", isCorrect: false },
          { id: "b", text: "x ≠ 2", isCorrect: true },
          { id: "c", text: "x > 2", isCorrect: false },
          { id: "d", text: "x < 2", isCorrect: false }
        ]
      },
      {
        id: 14,
        question: "Resuelve: |2x - 4| = 6",
        type: "multiple_choice",
        options: [
          { id: "a", text: "x = 1, x = 5", isCorrect: false },
          { id: "b", text: "x = -1, x = 5", isCorrect: true },
          { id: "c", text: "x = 2, x = 4", isCorrect: false },
          { id: "d", text: "x = -2, x = 4", isCorrect: false }
        ]
      },
      {
        id: 15,
        question: "¿Cuál es el vértice de la parábola y = x² - 4x + 3?",
        type: "multiple_choice",
        options: [
          { id: "a", text: "(2, -1)", isCorrect: true },
          { id: "b", text: "(2, 1)", isCorrect: false },
          { id: "c", text: "(-2, -1)", isCorrect: false },
          { id: "d", text: "(-2, 1)", isCorrect: false }
        ]
      },
      {
        id: 16,
        question: "Calcula: (3x + 2)²",
        type: "multiple_choice",
        options: [
          { id: "a", text: "9x² + 4", isCorrect: false },
          { id: "b", text: "9x² + 6x + 4", isCorrect: false },
          { id: "c", text: "9x² + 12x + 4", isCorrect: true },
          { id: "d", text: "9x² + 12x + 2", isCorrect: false }
        ]
      },
      {
        id: 17,
        question: "Si log(x) = 2, entonces x es igual a:",
        type: "multiple_choice",
        options: [
          { id: "a", text: "10", isCorrect: false },
          { id: "b", text: "20", isCorrect: false },
          { id: "c", text: "100", isCorrect: true },
          { id: "d", text: "200", isCorrect: false }
        ]
      },
      {
        id: 18,
        question: "Encuentra las raíces de x² + 6x + 9 = 0",
        type: "multiple_choice",
        options: [
          { id: "a", text: "x = -3 (doble)", isCorrect: true },
          { id: "b", text: "x = 3 (doble)", isCorrect: false },
          { id: "c", text: "x = -3, x = 3", isCorrect: false },
          { id: "d", text: "No tiene raíces reales", isCorrect: false }
        ]
      },
      {
        id: 19,
        question: "¿Cuál es la inversa de f(x) = 2x + 3?",
        type: "multiple_choice",
        options: [
          { id: "a", text: "f⁻¹(x) = (x - 3)/2", isCorrect: true },
          { id: "b", text: "f⁻¹(x) = (x + 3)/2", isCorrect: false },
          { id: "c", text: "f⁻¹(x) = 2x - 3", isCorrect: false },
          { id: "d", text: "f⁻¹(x) = x/2 - 3", isCorrect: false }
        ]
      },
      {
        id: 20,
        question: "Evalúa: lim(x→2) (x² - 4)/(x - 2)",
        type: "multiple_choice",
        options: [
          { id: "a", text: "2", isCorrect: false },
          { id: "b", text: "4", isCorrect: true },
          { id: "c", text: "0", isCorrect: false },
          { id: "d", text: "∞", isCorrect: false }
        ]
      }
    ]
  };

  // Exam state
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(mockExam.timeLimit * 60); // in seconds
  const [examPhase, setExamPhase] = useState('taking'); // 'taking', 'summary', 'results'
  const [isProgressCollapsed, setIsProgressCollapsed] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');

  // Timer effect
  useEffect(() => {
    if (examPhase === 'taking' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [examPhase, timeRemaining]);

  // Auto-save effect
  useEffect(() => {
    if (examPhase === 'taking') {
      setAutoSaveStatus('saving');
      const saveTimer = setTimeout(() => {
        // Simulate auto-save
        setAutoSaveStatus('saved');
      }, 1000);

      return () => clearTimeout(saveTimer);
    }
  }, [answers, markedForReview, examPhase]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (examPhase !== 'taking') return;

      switch (e.key) {
        case '1': case'2': case'3': case'4':
          e.preventDefault();
          const optionIndex = parseInt(e.key) - 1;
          const currentQ = mockExam.questions[currentQuestion - 1];
          if (currentQ && currentQ.options[optionIndex]) {
            handleAnswerSelect(currentQ.options[optionIndex].id);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePreviousQuestion();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNextQuestion();
          break;
        case 'r': case'R':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleMarkForReview();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestion, examPhase]);

  // Prevent navigation during exam
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (examPhase === 'taking') {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [examPhase]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionId) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: optionId
    }));
  };

  const handleMarkForReview = () => {
    setMarkedForReview(prev => {
      if (prev.includes(currentQuestion)) {
        return prev.filter(q => q !== currentQuestion);
      } else {
        return [...prev, currentQuestion];
      }
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < mockExam.totalQuestions) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleQuestionSelect = (questionNumber) => {
    setCurrentQuestion(questionNumber);
  };

  const handleShowSummary = () => {
    setExamPhase('summary');
  };

  const handleBackToExam = () => {
    setExamPhase('taking');
  };

  const handleSubmitExam = useCallback(() => {
    setExamPhase('results');
  }, []);

  const handleConfirmSubmit = () => {
    setShowConfirmDialog(false);
    handleSubmitExam();
  };

  const calculateScore = () => {
    let correct = 0;
    Object.entries(answers).forEach(([questionNum, selectedOption]) => {
      const question = mockExam.questions[parseInt(questionNum) - 1];
      const correctOption = question.options.find(opt => opt.isCorrect);
      if (correctOption && correctOption.id === selectedOption) {
        correct++;
      }
    });
    return {
      correct,
      total: mockExam.totalQuestions,
      percentage: Math.round((correct / mockExam.totalQuestions) * 100)
    };
  };

  const getAnsweredQuestions = () => {
    return Object.keys(answers).map(q => parseInt(q));
  };

  if (examPhase === 'results') {
    return (
      <div className="min-h-screen bg-background">
        <RoleBasedHeader userRole="student" userName="Ana García" />
        <div className="pt-16">
          <ExamResults 
            exam={mockExam}
            answers={answers}
            score={calculateScore()}
            onReturnToDashboard={() => navigate('/dashboard-del-estudiante')}
          />
        </div>
      </div>
    );
  }

  if (examPhase === 'summary') {
    return (
      <div className="min-h-screen bg-background">
        <RoleBasedHeader userRole="student" userName="Ana García" />
        <div className="pt-16">
          <ExamSummary
            exam={mockExam}
            answers={answers}
            markedForReview={markedForReview}
            onBackToExam={handleBackToExam}
            onSubmitExam={handleSubmitExam}
            onQuestionSelect={handleQuestionSelect}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader userRole="student" userName="Ana García" />
      
      {/* Mobile Progress Bar */}
      <div className="lg:hidden fixed top-16 left-0 right-0 bg-surface border-b border-border z-1000 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-text-primary">
              Pregunta {currentQuestion} de {mockExam.totalQuestions}
            </span>
            {mockExam.timeLimit && (
              <div className={`text-sm font-medium ${timeRemaining < 300 ? 'text-error' : 'text-text-secondary'}`}>
                <Icon name="Clock" size={16} className="inline mr-1" />
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className={`text-xs ${autoSaveStatus === 'saved' ? 'text-success' : 'text-warning'}`}>
              <Icon name={autoSaveStatus === 'saved' ? 'Check' : 'Loader'} size={12} className="inline mr-1" />
              {autoSaveStatus === 'saved' ? 'Guardado' : 'Guardando...'}
            </div>
          </div>
        </div>
        <div className="w-full bg-secondary-200 rounded-full h-2">
          <div
            className="bg-success h-2 rounded-full transition-all duration-300 ease-smooth"
            style={{ width: `${(getAnsweredQuestions().length / mockExam.totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block fixed top-16 left-0 right-0 bg-surface border-b border-border z-1000 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-semibold text-text-primary">{mockExam.title}</h1>
            <span className="text-sm text-text-secondary">
              Pregunta {currentQuestion} de {mockExam.totalQuestions}
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <div className={`text-xs ${autoSaveStatus === 'saved' ? 'text-success' : 'text-warning'}`}>
              <Icon name={autoSaveStatus === 'saved' ? 'Check' : 'Loader'} size={14} className="inline mr-1" />
              {autoSaveStatus === 'saved' ? 'Guardado automáticamente' : 'Guardando...'}
            </div>
            {mockExam.timeLimit && (
              <div className={`text-lg font-medium ${timeRemaining < 300 ? 'text-error' : 'text-text-primary'}`}>
                <Icon name="Clock" size={20} className="inline mr-2" />
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 lg:pt-28 pb-20 lg:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:pr-80">
            <QuestionDisplay
              question={mockExam.questions[currentQuestion - 1]}
              selectedAnswer={answers[currentQuestion]}
              isMarkedForReview={markedForReview.includes(currentQuestion)}
              onAnswerSelect={handleAnswerSelect}
              onMarkForReview={handleMarkForReview}
            />
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <NavigationControls
        currentQuestion={currentQuestion}
        totalQuestions={mockExam.totalQuestions}
        hasAnswer={!!answers[currentQuestion]}
        onPrevious={handlePreviousQuestion}
        onNext={handleNextQuestion}
        onShowSummary={handleShowSummary}
        onSubmit={() => setShowConfirmDialog(true)}
      />

      {/* Progress Indicator */}
      <ExamProgressIndicator
        totalQuestions={mockExam.totalQuestions}
        currentQuestion={currentQuestion}
        answeredQuestions={getAnsweredQuestions()}
        markedForReview={markedForReview}
        onQuestionSelect={handleQuestionSelect}
        isCollapsed={isProgressCollapsed}
        onToggleCollapse={() => setIsProgressCollapsed(!isProgressCollapsed)}
      />

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-1030 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="AlertTriangle" size={24} className="text-warning" />
              <h3 className="text-lg font-semibold text-text-primary">Confirmar Envío</h3>
            </div>
            <p className="text-text-secondary mb-6">
              ¿Estás seguro de que quieres enviar el examen? Una vez enviado, no podrás realizar cambios.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="btn-primary flex-1"
              >
                Enviar Examen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamInterface;
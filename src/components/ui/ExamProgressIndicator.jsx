import React, { useState } from 'react';
import Icon from '../AppIcon';

const ExamProgressIndicator = ({ 
  totalQuestions = 20, 
  currentQuestion = 1, 
  answeredQuestions = [], 
  markedForReview = [],
  onQuestionSelect = () => {},
  isCollapsed = false,
  onToggleCollapse = () => {}
}) => {
  const [showQuestionGrid, setShowQuestionGrid] = useState(false);

  const getQuestionStatus = (questionNumber) => {
    if (answeredQuestions.includes(questionNumber)) {
      return markedForReview.includes(questionNumber) ? 'answered-marked' : 'answered';
    }
    if (markedForReview.includes(questionNumber)) {
      return 'marked';
    }
    return 'unanswered';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered':
        return 'bg-success text-white';
      case 'answered-marked':
        return 'bg-warning text-white';
      case 'marked':
        return 'bg-warning-100 text-warning border-warning';
      default:
        return 'bg-surface text-text-secondary border-border hover:bg-secondary-100';
    }
  };

  const progressPercentage = (answeredQuestions.length / totalQuestions) * 100;

  const toggleQuestionGrid = () => {
    setShowQuestionGrid(!showQuestionGrid);
  };

  if (isCollapsed) {
    return (
      <div className="lg:hidden fixed bottom-4 right-4 z-1010">
        <button
          onClick={onToggleCollapse}
          className="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors duration-200 ease-in-out"
        >
          <Icon name="List" size={20} />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed right-0 top-16 h-full w-80 bg-surface border-l border-border z-1000 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">Progreso del Examen</h3>
            <button
              onClick={onToggleCollapse}
              className="p-2 text-text-secondary hover:text-primary transition-colors duration-200 ease-in-out"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-text-secondary mb-2">
              <span>Progreso</span>
              <span>{answeredQuestions.length}/{totalQuestions}</span>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div
                className="bg-success h-2 rounded-full transition-all duration-300 ease-smooth"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Current Question */}
          <div className="mb-6 p-4 bg-primary-50 rounded-md">
            <div className="text-sm text-text-secondary mb-1">Pregunta Actual</div>
            <div className="text-2xl font-semibold text-primary">{currentQuestion}</div>
          </div>

          {/* Question Grid */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-text-primary mb-3">Navegación de Preguntas</h4>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: totalQuestions }, (_, index) => {
                const questionNumber = index + 1;
                const status = getQuestionStatus(questionNumber);
                const isCurrentQuestion = questionNumber === currentQuestion;
                
                return (
                  <button
                    key={questionNumber}
                    onClick={() => onQuestionSelect(questionNumber)}
                    className={`
                      w-10 h-10 rounded-md text-sm font-medium border transition-all duration-200 ease-in-out
                      ${isCurrentQuestion ? 'ring-2 ring-primary ring-offset-2' : ''}
                      ${getStatusColor(status)}
                      hover:scale-105 active:scale-95
                    `}
                  >
                    {questionNumber}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-success rounded"></div>
              <span className="text-text-secondary">Respondida</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-warning rounded"></div>
              <span className="text-text-secondary">Marcada para revisar</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-surface border border-border rounded"></div>
              <span className="text-text-secondary">Sin responder</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="lg:hidden fixed top-16 left-0 right-0 bg-surface border-b border-border z-1000 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">
            Pregunta {currentQuestion} de {totalQuestions}
          </span>
          <button
            onClick={toggleQuestionGrid}
            className="flex items-center space-x-1 text-sm text-primary hover:text-primary-700 transition-colors duration-200 ease-in-out"
          >
            <Icon name="Grid3X3" size={16} />
            <span>Ver todas</span>
          </button>
        </div>
        <div className="w-full bg-secondary-200 rounded-full h-2">
          <div
            className="bg-success h-2 rounded-full transition-all duration-300 ease-smooth"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Mobile Question Grid Modal */}
      {showQuestionGrid && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-1020 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg max-w-sm w-full max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">Navegación de Preguntas</h3>
                <button
                  onClick={toggleQuestionGrid}
                  className="p-2 text-text-secondary hover:text-primary transition-colors duration-200 ease-in-out"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-5 gap-3 mb-4">
                {Array.from({ length: totalQuestions }, (_, index) => {
                  const questionNumber = index + 1;
                  const status = getQuestionStatus(questionNumber);
                  const isCurrentQuestion = questionNumber === currentQuestion;
                  
                  return (
                    <button
                      key={questionNumber}
                      onClick={() => {
                        onQuestionSelect(questionNumber);
                        toggleQuestionGrid();
                      }}
                      className={`
                        w-12 h-12 rounded-md text-sm font-medium border transition-all duration-200 ease-in-out
                        ${isCurrentQuestion ? 'ring-2 ring-primary ring-offset-2' : ''}
                        ${getStatusColor(status)}
                        hover:scale-105 active:scale-95
                      `}
                    >
                      {questionNumber}
                    </button>
                  );
                })}
              </div>

              {/* Mobile Legend */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-success rounded"></div>
                  <span className="text-text-secondary">Respondida</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-warning rounded"></div>
                  <span className="text-text-secondary">Marcada para revisar</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-surface border border-border rounded"></div>
                  <span className="text-text-secondary">Sin responder</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExamProgressIndicator;
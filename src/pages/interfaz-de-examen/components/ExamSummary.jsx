import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ExamSummary = ({
  exam,
  answers,
  markedForReview,
  onBackToExam,
  onSubmitExam,
  onQuestionSelect
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const getQuestionStatus = (questionNumber) => {
    const hasAnswer = !!answers[questionNumber];
    const isMarked = markedForReview.includes(questionNumber);
    
    if (hasAnswer && isMarked) return 'answered-marked';
    if (hasAnswer) return 'answered';
    if (isMarked) return 'marked';
    return 'unanswered';
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'answered':
        return { color: 'bg-success text-white', label: 'Respondida', icon: 'Check' };
      case 'answered-marked':
        return { color: 'bg-warning text-white', label: 'Respondida y marcada', icon: 'Flag' };
      case 'marked':
        return { color: 'bg-warning-100 text-warning border border-warning', label: 'Marcada para revisión', icon: 'Flag' };
      default:
        return { color: 'bg-surface text-text-secondary border border-border', label: 'Sin responder', icon: 'Circle' };
    }
  };

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = exam.totalQuestions - answeredCount;
  const markedCount = markedForReview.length;

  const handleQuestionClick = (questionNumber) => {
    onQuestionSelect(questionNumber);
    onBackToExam();
  };

  const handleSubmitClick = () => {
    if (unansweredCount > 0) {
      setShowConfirmDialog(true);
    } else {
      onSubmitExam();
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-text-primary">Resumen del Examen</h1>
            <button
              onClick={onBackToExam}
              className="btn-secondary flex items-center space-x-2"
            >
              <Icon name="ArrowLeft" size={16} />
              <span>Volver al Examen</span>
            </button>
          </div>
          
          <h2 className="text-lg text-text-secondary mb-6">{exam.title}</h2>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-success-50 border border-success-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <span className="text-sm font-medium text-success-600">Respondidas</span>
              </div>
              <div className="text-2xl font-bold text-success">{answeredCount}</div>
            </div>

            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Flag" size={20} className="text-warning" />
                <span className="text-sm font-medium text-warning-600">Marcadas</span>
              </div>
              <div className="text-2xl font-bold text-warning">{markedCount}</div>
            </div>

            <div className="bg-error-50 border border-error-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="AlertCircle" size={20} className="text-error" />
                <span className="text-sm font-medium text-error-600">Sin responder</span>
              </div>
              <div className="text-2xl font-bold text-error">{unansweredCount}</div>
            </div>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Estado de las Preguntas</h3>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 mb-6">
            {Array.from({ length: exam.totalQuestions }, (_, index) => {
              const questionNumber = index + 1;
              const status = getQuestionStatus(questionNumber);
              const statusInfo = getStatusInfo(status);
              
              return (
                <button
                  key={questionNumber}
                  onClick={() => handleQuestionClick(questionNumber)}
                  className={`
                    w-12 h-12 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
                    ${statusInfo.color}
                    hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  `}
                  title={`Pregunta ${questionNumber} - ${statusInfo.label}`}
                >
                  {questionNumber}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-success rounded"></div>
              <span className="text-text-secondary">Respondida</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-warning rounded"></div>
              <span className="text-text-secondary">Respondida y marcada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-warning-100 border border-warning rounded"></div>
              <span className="text-text-secondary">Marcada para revisión</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-surface border border-border rounded"></div>
              <span className="text-text-secondary">Sin responder</span>
            </div>
          </div>
        </div>

        {/* Questions with Answers */}
        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Revisión de Respuestas</h3>
          
          <div className="space-y-6 max-h-96 overflow-y-auto">
            {exam.questions.map((question, index) => {
              const questionNumber = index + 1;
              const selectedAnswer = answers[questionNumber];
              const selectedOption = question.options.find(opt => opt.id === selectedAnswer);
              const status = getQuestionStatus(questionNumber);
              const statusInfo = getStatusInfo(status);
              
              return (
                <div key={question.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-primary bg-primary-50 px-2 py-1 rounded">
                        Pregunta {questionNumber}
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded flex items-center ${statusInfo.color}`}>
                        <Icon name={statusInfo.icon} size={12} className="mr-1" />
                        {statusInfo.label}
                      </span>
                    </div>
                    <button
                      onClick={() => handleQuestionClick(questionNumber)}
                      className="text-sm text-primary hover:text-primary-700 font-medium"
                    >
                      Ir a pregunta
                    </button>
                  </div>
                  
                  <p className="text-text-primary mb-3 whitespace-pre-line">{question.question}</p>
                  
                  {selectedOption ? (
                    <div className="bg-primary-50 border border-primary-200 rounded-md p-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium bg-primary text-white px-2 py-1 rounded">
                          {String.fromCharCode(65 + question.options.findIndex(opt => opt.id === selectedAnswer))}
                        </span>
                        <span className="text-text-primary">{selectedOption.text}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-error-50 border border-error-200 rounded-md p-3">
                      <span className="text-error text-sm">Sin respuesta seleccionada</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onBackToExam}
            className="btn-secondary flex items-center justify-center space-x-2 flex-1"
          >
            <Icon name="ArrowLeft" size={16} />
            <span>Continuar Examen</span>
          </button>
          
          <button
            onClick={handleSubmitClick}
            className="bg-success text-white px-6 py-3 rounded-md font-medium transition-all duration-200 ease-in-out hover:bg-success-600 focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2 active:scale-98 flex items-center justify-center space-x-2 flex-1"
          >
            <Icon name="Send" size={16} />
            <span>Enviar Examen</span>
          </button>
        </div>

        {/* Warning for unanswered questions */}
        {unansweredCount > 0 && (
          <div className="mt-6 p-4 bg-warning-50 border border-warning-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-warning-600 mb-1">
                  Preguntas sin responder
                </h4>
                <p className="text-sm text-warning-600">
                  Tienes {unansweredCount} pregunta{unansweredCount !== 1 ? 's' : ''} sin responder. 
                  Puedes enviar el examen ahora o continuar respondiendo.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-1030 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="AlertTriangle" size={24} className="text-warning" />
              <h3 className="text-lg font-semibold text-text-primary">Confirmar Envío</h3>
            </div>
            <p className="text-text-secondary mb-6">
              Tienes {unansweredCount} pregunta{unansweredCount !== 1 ? 's' : ''} sin responder. 
              ¿Estás seguro de que quieres enviar el examen?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  onSubmitExam();
                }}
                className="bg-success text-white px-4 py-2 rounded-md font-medium transition-all duration-200 ease-in-out hover:bg-success-600 focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2 flex-1"
              >
                Enviar de todas formas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamSummary;
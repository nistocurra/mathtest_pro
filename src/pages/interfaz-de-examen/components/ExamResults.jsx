import React, { useState } from 'react';
import Icon from 'components/AppImage';


const ExamResults = ({ exam, answers, score, onReturnToDashboard }) => {
  const [showDetailedResults, setShowDetailedResults] = useState(false);

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'text-success';
    if (percentage >= 70) return 'text-warning';
    return 'text-error';
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 90) return '¡Excelente trabajo!';
    if (percentage >= 80) return '¡Muy bien hecho!';
    if (percentage >= 70) return 'Buen trabajo';
    if (percentage >= 60) return 'Aprobado';
    return 'Necesitas mejorar';
  };

  const getGradeEmoji = (percentage) => {
    if (percentage >= 90) return '🎉';
    if (percentage >= 80) return '😊';
    if (percentage >= 70) return '👍';
    if (percentage >= 60) return '📚';
    return '💪';
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Trophy" size={40} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Examen Completado {getGradeEmoji(score.percentage)}
          </h1>
          <p className="text-lg text-text-secondary">{exam.title}</p>
        </div>

        {/* Score Card */}
        <div className="bg-surface rounded-lg border border-border p-8 mb-6 text-center">
          <div className="mb-6">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(score.percentage)}`}>
              {score.percentage}%
            </div>
            <div className="text-xl text-text-secondary mb-4">
              {score.correct} de {score.total} preguntas correctas
            </div>
            <div className={`text-lg font-medium ${getScoreColor(score.percentage)}`}>
              {getScoreMessage(score.percentage)}
            </div>
          </div>

          {/* Progress Ring */}
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#E2E8F0"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke={score.percentage >= 70 ? '#059669' : score.percentage >= 60 ? '#D97706' : '#DC2626'}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(score.percentage / 100) * 314} 314`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${getScoreColor(score.percentage)}`}>
                  {score.percentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-success-50 border border-success-200 rounded-lg p-4">
              <Icon name="CheckCircle" size={24} className="text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-success">{score.correct}</div>
              <div className="text-sm text-success-600">Correctas</div>
            </div>
            
            <div className="bg-error-50 border border-error-200 rounded-lg p-4">
              <Icon name="XCircle" size={24} className="text-error mx-auto mb-2" />
              <div className="text-2xl font-bold text-error">{score.total - score.correct}</div>
              <div className="text-sm text-error-600">Incorrectas</div>
            </div>
            
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <Icon name="FileText" size={24} className="text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{score.total}</div>
              <div className="text-sm text-primary-600">Total</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={() => setShowDetailedResults(!showDetailedResults)}
            className="btn-secondary flex items-center justify-center space-x-2 flex-1"
          >
            <Icon name={showDetailedResults ? "EyeOff" : "Eye"} size={16} />
            <span>
              {showDetailedResults ? 'Ocultar' : 'Ver'} Respuestas Detalladas
            </span>
          </button>
          
          <button
            onClick={onReturnToDashboard}
            className="btn-primary flex items-center justify-center space-x-2 flex-1"
          >
            <Icon name="Home" size={16} />
            <span>Volver al Dashboard</span>
          </button>
        </div>

        {/* Detailed Results */}
        {showDetailedResults && (
          <div className="bg-surface rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-6">
              Revisión Detallada de Respuestas
            </h3>
            
            <div className="space-y-6">
              {exam.questions.map((question, index) => {
                const questionNumber = index + 1;
                const selectedAnswer = answers[questionNumber];
                const selectedOption = question.options.find(opt => opt.id === selectedAnswer);
                const correctOption = question.options.find(opt => opt.isCorrect);
                const isCorrect = selectedOption && selectedOption.isCorrect;
                
                return (
                  <div key={question.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-primary bg-primary-50 px-2 py-1 rounded">
                          Pregunta {questionNumber}
                        </span>
                        <span className={`text-xs font-medium px-2 py-1 rounded flex items-center ${
                          isCorrect 
                            ? 'bg-success text-white' 
                            : selectedOption 
                              ? 'bg-error text-white' :'bg-secondary-200 text-secondary-700'
                        }`}>
                          <Icon 
                            name={isCorrect ? "Check" : selectedOption ? "X" : "Minus"} 
                            size={12} 
                            className="mr-1" 
                          />
                          {isCorrect ? 'Correcta' : selectedOption ? 'Incorrecta' : 'Sin respuesta'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-text-primary mb-4 whitespace-pre-line">{question.question}</p>
                    
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => {
                        const isSelected = selectedOption && selectedOption.id === option.id;
                        const isCorrectAnswer = option.isCorrect;
                        
                        let optionClass = 'border border-border bg-surface';
                        if (isCorrectAnswer) {
                          optionClass = 'border-success bg-success-50';
                        } else if (isSelected && !isCorrectAnswer) {
                          optionClass = 'border-error bg-error-50';
                        }
                        
                        return (
                          <div key={option.id} className={`p-3 rounded-md ${optionClass}`}>
                            <div className="flex items-center space-x-3">
                              <span className={`
                                text-sm font-medium px-2 py-1 rounded
                                ${isCorrectAnswer 
                                  ? 'bg-success text-white' 
                                  : isSelected && !isCorrectAnswer
                                    ? 'bg-error text-white' :'bg-secondary-200 text-secondary-700'
                                }
                              `}>
                                {String.fromCharCode(65 + optIndex)}
                              </span>
                              <span className="text-text-primary flex-1">{option.text}</span>
                              <div className="flex items-center space-x-2">
                                {isSelected && (
                                  <Icon 
                                    name="User" 
                                    size={16} 
                                    className={isCorrectAnswer ? 'text-success' : 'text-error'} 
                                    title="Tu respuesta"
                                  />
                                )}
                                {isCorrectAnswer && (
                                  <Icon 
                                    name="CheckCircle" 
                                    size={16} 
                                    className="text-success" 
                                    title="Respuesta correcta"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Motivational Message */}
        <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg border border-primary-200">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="Lightbulb" size={24} color="white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-text-primary mb-2">
                {score.percentage >= 70 ? '¡Sigue así!' : 'Consejos para mejorar'}
              </h4>
              <p className="text-text-secondary">
                {score.percentage >= 90 
                  ? 'Excelente dominio del tema. Continúa practicando para mantener este nivel.'
                  : score.percentage >= 70
                    ? 'Buen trabajo. Revisa los temas donde tuviste dificultades para mejorar aún más.'
                    : 'Te recomendamos repasar los conceptos fundamentales y practicar más ejercicios similares.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResults;
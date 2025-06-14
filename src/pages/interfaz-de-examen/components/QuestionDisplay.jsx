import React from 'react';
import Icon from 'components/AppIcon';

const QuestionDisplay = ({
  question,
  selectedAnswer,
  isMarkedForReview,
  onAnswerSelect,
  onMarkForReview
}) => {
  if (!question) return null;

  const handleOptionSelect = (optionId) => {
    onAnswerSelect(optionId);
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6 lg:p-8">
      {/* Question Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-primary bg-primary-50 px-2 py-1 rounded">
              Pregunta {question.id}
            </span>
            {isMarkedForReview && (
              <span className="text-xs font-medium text-warning bg-warning-50 px-2 py-1 rounded flex items-center">
                <Icon name="Flag" size={12} className="mr-1" />
                Marcada para revisión
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={onMarkForReview}
          className={`
            flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out
            ${isMarkedForReview 
              ? 'bg-warning-100 text-warning hover:bg-warning-200' :'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
            }
          `}
          title="Marcar para revisión (Ctrl+R)"
        >
          <Icon name="Flag" size={16} />
          <span className="hidden sm:inline">
            {isMarkedForReview ? 'Quitar marca' : 'Marcar'}
          </span>
        </button>
      </div>

      {/* Question Text */}
      <div className="mb-8">
        <h2 className="text-xl lg:text-2xl font-medium text-text-primary leading-relaxed whitespace-pre-line">
          {question.question}
        </h2>
      </div>

      {/* Answer Options */}
      <div className="space-y-4">
        {question.options.map((option, index) => (
          <label
            key={option.id}
            className={`
              block p-4 lg:p-5 rounded-lg border-2 cursor-pointer transition-all duration-200 ease-in-out
              ${selectedAnswer === option.id
                ? 'border-primary bg-primary-50 shadow-sm'
                : 'border-border bg-surface hover:border-secondary-600 hover:bg-secondary-50'
              }
              focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2
            `}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.id}
                  checked={selectedAnswer === option.id}
                  onChange={() => handleOptionSelect(option.id)}
                  className="w-5 h-5 text-primary border-2 border-secondary-600 focus:ring-primary focus:ring-offset-0"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span className={`
                    text-sm font-medium px-2 py-1 rounded
                    ${selectedAnswer === option.id
                      ? 'bg-primary text-white' :'bg-secondary-200 text-secondary-700'
                    }
                  `}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-lg text-text-primary font-medium whitespace-pre-line">
                    {option.text}
                  </span>
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="mt-8 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
        <div className="flex items-start space-x-3">
          <Icon name="Keyboard" size={20} className="text-secondary-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-1">
              Atajos de teclado
            </h4>
            <div className="text-sm text-text-secondary space-y-1">
              <p><kbd className="px-1 py-0.5 bg-white border border-secondary-300 rounded text-xs">1-4</kbd> Seleccionar opción</p>
              <p><kbd className="px-1 py-0.5 bg-white border border-secondary-300 rounded text-xs">←→</kbd> Navegar preguntas</p>
              <p><kbd className="px-1 py-0.5 bg-white border border-secondary-300 rounded text-xs">Ctrl+R</kbd> Marcar para revisión</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;
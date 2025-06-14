import React from 'react';
import Icon from 'components/AppIcon';

const NavigationControls = ({
  currentQuestion,
  totalQuestions,
  hasAnswer,
  onPrevious,
  onNext,
  onShowSummary,
  onSubmit
}) => {
  const isFirstQuestion = currentQuestion === 1;
  const isLastQuestion = currentQuestion === totalQuestions;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-1010 lg:pr-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Previous Button */}
          <button
            onClick={onPrevious}
            disabled={isFirstQuestion}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ease-in-out
              ${isFirstQuestion
                ? 'bg-secondary-100 text-secondary-400 cursor-not-allowed' :'bg-secondary-100 text-secondary-700 hover:bg-secondary-200 active:scale-95'
              }
            `}
          >
            <Icon name="ChevronLeft" size={20} />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          {/* Middle Section - Question Status */}
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-sm text-text-secondary">Pregunta</div>
              <div className="text-lg font-semibold text-text-primary">
                {currentQuestion} / {totalQuestions}
              </div>
            </div>
            
            {hasAnswer && (
              <div className="flex items-center space-x-1 text-success">
                <Icon name="CheckCircle" size={16} />
                <span className="text-sm font-medium hidden sm:inline">Respondida</span>
              </div>
            )}
          </div>

          {/* Next/Submit Button */}
          <div className="flex items-center space-x-2">
            {!isLastQuestion ? (
              <button
                onClick={onNext}
                className="btn-primary flex items-center space-x-2 active:scale-95"
              >
                <span className="hidden sm:inline">Siguiente</span>
                <span className="sm:hidden">Sig.</span>
                <Icon name="ChevronRight" size={20} />
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onShowSummary}
                  className="btn-secondary flex items-center space-x-2 active:scale-95"
                >
                  <Icon name="Eye" size={16} />
                  <span className="hidden sm:inline">Revisar</span>
                </button>
                <button
                  onClick={onSubmit}
                  className="bg-success text-white px-4 py-2 rounded-md font-medium transition-all duration-200 ease-in-out hover:bg-success-600 focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2 active:scale-95 flex items-center space-x-2"
                >
                  <Icon name="Send" size={16} />
                  <span>Enviar</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 lg:hidden">
          <div className="w-full bg-secondary-200 rounded-full h-1">
            <div
              className="bg-primary h-1 rounded-full transition-all duration-300 ease-smooth"
              style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationControls;
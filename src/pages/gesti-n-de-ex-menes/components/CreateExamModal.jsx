import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const CreateExamModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    attemptsAllowed: 'multiple',
    maxAttempts: 3,
    timeLimit: 60,
    questionsFile: null
  });
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (file.type !== 'text/plain') {
      setErrors(prev => ({
        ...prev,
        questionsFile: 'Por favor, sube un archivo de texto (.txt)'
      }));
      return;
    }

    setIsProcessing(true);
    
    try {
      const text = await file.text();
      const questions = parseQuestionsFile(text);
      
      if (questions.length === 0) {
        setErrors(prev => ({
          ...prev,
          questionsFile: 'No se encontraron preguntas válidas en el archivo'
        }));
      } else {
        setParsedQuestions(questions);
        setFormData(prev => ({
          ...prev,
          questionsFile: file
        }));
        setErrors(prev => ({
          ...prev,
          questionsFile: ''
        }));
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        questionsFile: 'Error al procesar el archivo'
      }));
    }
    
    setIsProcessing(false);
  };

  const parseQuestionsFile = (text) => {
    const questions = [];
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    let currentQuestion = null;
    let questionNumber = 1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if it's a question (starts with number or "Pregunta")
      if (line.match(/^\d+\./) || line.toLowerCase().startsWith('pregunta')) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        
        currentQuestion = {
          id: questionNumber++,
          question: line.replace(/^\d+\.\s*/, '').replace(/^pregunta\s*\d*:?\s*/i, ''),
          options: [],
          correctAnswer: null
        };
      }
      // Check if it's an option (starts with a), b), c), etc.)
      else if (line.match(/^[a-d]\)/i) && currentQuestion) {
        const optionText = line.substring(2).trim();
        const isCorrect = optionText.startsWith('*');
        const cleanText = optionText.replace(/^\*\s*/, '');
        
        currentQuestion.options.push({
          id: line.charAt(0).toLowerCase(),
          text: cleanText,
          isCorrect
        });
        
        if (isCorrect) {
          currentQuestion.correctAnswer = line.charAt(0).toLowerCase();
        }
      }
    }
    
    // Add the last question
    if (currentQuestion) {
      questions.push(currentQuestion);
    }
    
    // Filter out questions without valid options or correct answers
    return questions.filter(q => 
      q.options.length >= 2 && 
      q.correctAnswer && 
      q.question.length > 0
    );
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }
    
    if (formData.timeLimit < 5 || formData.timeLimit > 300) {
      newErrors.timeLimit = 'La duración debe estar entre 5 y 300 minutos';
    }
    
    if (formData.attemptsAllowed === 'multiple' && (formData.maxAttempts < 1 || formData.maxAttempts > 10)) {
      newErrors.maxAttempts = 'Los intentos deben estar entre 1 y 10';
    }
    
    if (!formData.questionsFile) {
      newErrors.questionsFile = 'Debes subir un archivo con las preguntas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const examData = {
      ...formData,
      questionsCount: parsedQuestions.length,
      questions: parsedQuestions
    };
    
    onSubmit(examData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-1020 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-primary">
              Crear Nuevo Examen
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-primary hover:bg-secondary-100 rounded-md transition-colors duration-200 ease-in-out"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-2">
              Título del Examen *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`input-field ${errors.title ? 'border-error focus:ring-error' : ''}`}
              placeholder="Ej: Álgebra Básica - Ecuaciones Lineales"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-error">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-2">
              Descripción *
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className={`input-field resize-none ${errors.description ? 'border-error focus:ring-error' : ''}`}
              placeholder="Describe el contenido y objetivos del examen..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-error">{errors.description}</p>
            )}
          </div>

          {/* Configuration Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Attempts */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Intentos Permitidos
              </label>
              <select
                name="attemptsAllowed"
                value={formData.attemptsAllowed}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="single">Único intento</option>
                <option value="multiple">Múltiples intentos</option>
              </select>
              
              {formData.attemptsAllowed === 'multiple' && (
                <div className="mt-2">
                  <input
                    type="number"
                    name="maxAttempts"
                    value={formData.maxAttempts}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    className={`input-field ${errors.maxAttempts ? 'border-error focus:ring-error' : ''}`}
                    placeholder="Número máximo de intentos"
                  />
                  {errors.maxAttempts && (
                    <p className="mt-1 text-sm text-error">{errors.maxAttempts}</p>
                  )}
                </div>
              )}
            </div>

            {/* Time Limit */}
            <div>
              <label htmlFor="timeLimit" className="block text-sm font-medium text-text-primary mb-2">
                Duración (minutos)
              </label>
              <input
                type="number"
                id="timeLimit"
                name="timeLimit"
                value={formData.timeLimit}
                onChange={handleInputChange}
                min="5"
                max="300"
                className={`input-field ${errors.timeLimit ? 'border-error focus:ring-error' : ''}`}
                placeholder="60"
              />
              {errors.timeLimit && (
                <p className="mt-1 text-sm text-error">{errors.timeLimit}</p>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Archivo de Preguntas *
            </label>
            
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 transition-colors duration-200 ease-in-out ${
                dragActive 
                  ? 'border-primary bg-primary-50' 
                  : errors.questionsFile 
                    ? 'border-error bg-error-50' :'border-border hover:border-primary hover:bg-secondary-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".txt"
                onChange={(e) => handleFileUpload(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="text-center">
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="text-text-secondary">Procesando archivo...</span>
                  </div>
                ) : formData.questionsFile ? (
                  <div className="space-y-2">
                    <Icon name="CheckCircle" size={32} className="text-success mx-auto" />
                    <p className="text-sm font-medium text-text-primary">
                      {formData.questionsFile.name}
                    </p>
                    <p className="text-sm text-success">
                      {parsedQuestions.length} preguntas encontradas
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Icon name="Upload" size={32} className="text-text-secondary mx-auto" />
                    <p className="text-sm font-medium text-text-primary">
                      Arrastra tu archivo aquí o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-text-secondary">
                      Solo archivos .txt con formato específico
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {errors.questionsFile && (
              <p className="mt-1 text-sm text-error">{errors.questionsFile}</p>
            )}

            {/* Format Help */}
            <div className="mt-3 p-3 bg-secondary-50 rounded-md">
              <h4 className="text-sm font-medium text-text-primary mb-2">
                Formato del archivo:
              </h4>
              <div className="text-xs text-text-secondary space-y-1">
                <p>1. ¿Cuál es el resultado de 2 + 2?</p>
                <p>a) 3</p>
                <p>b) *4</p>
                <p>c) 5</p>
                <p>d) 6</p>
                <p className="text-primary mt-2">* Marca la respuesta correcta con asterisco</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Procesando...' : 'Crear Examen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExamModal;
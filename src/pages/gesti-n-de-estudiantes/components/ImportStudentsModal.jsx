import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ImportStudentsModal = ({ isOpen, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState(null);

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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      alert('Por favor selecciona un archivo CSV válido.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('El archivo es demasiado grande. El tamaño máximo es 5MB.');
      return;
    }
    
    setSelectedFile(file);
    setImportResults(null);
  };

  const processImport = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock results
      const mockResults = {
        total: 25,
        successful: 23,
        failed: 2,
        errors: [
          { row: 5, error: 'Email duplicado: maria.lopez@estudiante.edu' },
          { row: 12, error: 'Formato de teléfono inválido: +34 abc def ghi' }
        ]
      };
      
      setImportResults(mockResults);
    } catch (error) {
      alert('Error al procesar el archivo. Inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `nombre,email,telefono,grado
Ana García López,ana.garcia@estudiante.edu,+34 612 345 678,10º Grado
Carlos Rodríguez Martín,carlos.rodriguez@estudiante.edu,+34 623 456 789,11º Grado
María Fernández Silva,maria.fernandez@estudiante.edu,+34 634 567 890,9º Grado`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'plantilla_estudiantes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetModal = () => {
    setSelectedFile(null);
    setImportResults(null);
    setIsProcessing(false);
    setDragActive(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-1020 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-primary">
              Importar Estudiantes desde CSV
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-text-secondary hover:text-primary transition-colors duration-200 ease-in-out"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!importResults ? (
            <>
              {/* Instructions */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-text-primary mb-3">
                  Instrucciones de Importación
                </h3>
                <div className="bg-secondary-50 p-4 rounded-md space-y-2 text-sm text-text-secondary">
                  <p>• El archivo debe estar en formato CSV con codificación UTF-8</p>
                  <p>• Las columnas requeridas son: <strong>nombre, email, telefono, grado</strong></p>
                  <p>• Los emails deben ser únicos en el sistema</p>
                  <p>• Los grados válidos son: 6º a 12º Grado</p>
                  <p>• Se generarán contraseñas temporales automáticamente</p>
                </div>
              </div>

              {/* Template Download */}
              <div className="mb-6">
                <button
                  onClick={downloadTemplate}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Icon name="Download" size={16} />
                  <span>Descargar Plantilla CSV</span>
                </button>
              </div>

              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ease-in-out ${
                  dragActive 
                    ? 'border-primary bg-primary-50' :'border-border hover:border-primary hover:bg-secondary-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto">
                    <Icon name="Upload" size={32} className="text-secondary-600" />
                  </div>
                  
                  {selectedFile ? (
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-text-primary">
                        Archivo Seleccionado
                      </p>
                      <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
                        <Icon name="FileText" size={16} />
                        <span>{selectedFile.name}</span>
                        <span>({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-sm text-error hover:text-error-600 transition-colors duration-200 ease-in-out"
                      >
                        Cambiar archivo
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-text-primary">
                        Arrastra tu archivo CSV aquí
                      </p>
                      <p className="text-text-secondary">
                        o haz clic para seleccionar
                      </p>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="csvFileInput"
                  />
                  
                  {!selectedFile && (
                    <label
                      htmlFor="csvFileInput"
                      className="btn-primary cursor-pointer inline-flex items-center space-x-2"
                    >
                      <Icon name="FolderOpen" size={16} />
                      <span>Seleccionar Archivo</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleClose}
                  className="btn-secondary flex-1"
                  disabled={isProcessing}
                >
                  Cancelar
                </button>
                <button
                  onClick={processImport}
                  disabled={!selectedFile || isProcessing}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <Icon name="Loader2" size={16} className="animate-spin" />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="Upload" size={16} />
                      <span>Importar Estudiantes</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Import Results */
            <div className="space-y-6">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  importResults.failed === 0 ? 'bg-success-100' : 'bg-warning-100'
                }`}>
                  <Icon 
                    name={importResults.failed === 0 ? "CheckCircle" : "AlertTriangle"} 
                    size={32} 
                    className={importResults.failed === 0 ? 'text-success' : 'text-warning'}
                  />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Importación Completada
                </h3>
              </div>

              {/* Results Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-secondary-50 rounded-md">
                  <div className="text-2xl font-bold text-text-primary">
                    {importResults.total}
                  </div>
                  <div className="text-sm text-text-secondary">Total</div>
                </div>
                <div className="text-center p-4 bg-success-50 rounded-md">
                  <div className="text-2xl font-bold text-success">
                    {importResults.successful}
                  </div>
                  <div className="text-sm text-text-secondary">Exitosos</div>
                </div>
                <div className="text-center p-4 bg-error-50 rounded-md">
                  <div className="text-2xl font-bold text-error">
                    {importResults.failed}
                  </div>
                  <div className="text-sm text-text-secondary">Fallidos</div>
                </div>
              </div>

              {/* Errors */}
              {importResults.errors.length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-text-primary mb-3">
                    Errores Encontrados
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {importResults.errors.map((error, index) => (
                      <div key={index} className="flex items-start space-x-2 p-3 bg-error-50 rounded-md">
                        <Icon name="AlertCircle" size={16} className="text-error mt-0.5" />
                        <div className="text-sm">
                          <span className="font-medium">Fila {error.row}:</span>
                          <span className="text-text-secondary ml-1">{error.error}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success Message */}
              {importResults.successful > 0 && (
                <div className="bg-success-50 p-4 rounded-md">
                  <div className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
                    <div className="text-sm text-success-600">
                      <p className="font-medium">
                        {importResults.successful} estudiante(s) importado(s) exitosamente.
                      </p>
                      <p>
                        Se han enviado emails con las credenciales de acceso a todos los estudiantes nuevos.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={resetModal}
                  className="btn-secondary flex-1"
                >
                  Importar Más Estudiantes
                </button>
                <button
                  onClick={handleClose}
                  className="btn-primary flex-1"
                >
                  Finalizar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportStudentsModal;
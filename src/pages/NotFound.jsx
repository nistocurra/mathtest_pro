import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="AlertTriangle" size={48} className="text-primary" />
          </div>
          <h1 className="text-6xl font-bold text-text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Página no encontrada
          </h2>
          <p className="text-text-secondary mb-8">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/inicio-de-sesi-n-login"
            className="btn-primary w-full inline-flex items-center justify-center space-x-2"
          >
            <Icon name="Home" size={20} />
            <span>Volver al Inicio</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-secondary w-full inline-flex items-center justify-center space-x-2"
          >
            <Icon name="ArrowLeft" size={20} />
            <span>Página Anterior</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
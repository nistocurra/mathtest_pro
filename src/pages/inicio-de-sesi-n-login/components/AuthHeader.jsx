import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const AuthHeader = () => {
  return (
    <header className="bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16">
          <Link to="/inicio-de-sesi-n-login" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Calculator" size={24} color="white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-text-primary">
                MathPractice Pro
              </h1>
              <p className="text-sm text-text-secondary hidden sm:block">
                Pon en práctica tus Matemáticas
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
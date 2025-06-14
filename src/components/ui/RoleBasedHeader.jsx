import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const RoleBasedHeader = ({ userRole = 'teacher', userName = 'Usuario' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const teacherNavItems = [
    { label: 'Panel', path: '/panel-del-profesor', icon: 'LayoutDashboard' },
    { label: 'Exámenes', path: '/gesti-n-de-ex-menes', icon: 'FileText' },
    { label: 'Estudiantes', path: '/gesti-n-de-estudiantes', icon: 'Users' },
  ];

  const studentNavItems = [
    { label: 'Dashboard', path: '/dashboard-del-estudiante', icon: 'Home' },
    { label: 'Exámenes', path: '/interfaz-de-examen', icon: 'PenTool' },
  ];

  const navItems = userRole === 'teacher' ? teacherNavItems : studentNavItems;

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-surface border-b border-border z-1000">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Icon name="GraduationCap" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-text-primary">
                MathAssess
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out ${
                  isActiveRoute(item.path)
                    ? 'text-primary bg-primary-50' :'text-text-secondary hover:text-primary hover:bg-secondary-100'
                }`}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="w-8 h-8 bg-secondary-200 rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="#64748B" />
              </div>
              <div className="text-sm">
                <p className="text-text-primary font-medium">{userName}</p>
                <p className="text-text-secondary capitalize">{userRole === 'teacher' ? 'Profesor' : 'Estudiante'}</p>
              </div>
            </div>

            {/* Logout Button */}
            <Link
              to="/inicio-de-sesi-n-login"
              className="hidden sm:flex items-center space-x-1 px-3 py-2 text-sm font-medium text-text-secondary hover:text-error transition-colors duration-200 ease-in-out"
            >
              <Icon name="LogOut" size={16} />
              <span>Salir</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-primary hover:bg-secondary-100 transition-colors duration-200 ease-in-out"
              aria-expanded="false"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ease-in-out ${
                  isActiveRoute(item.path)
                    ? 'text-primary bg-primary-50' :'text-text-secondary hover:text-primary hover:bg-secondary-100'
                }`}
              >
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
            
            {/* Mobile User Info */}
            <div className="px-3 py-3 border-t border-border mt-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-secondary-200 rounded-full flex items-center justify-center">
                  <Icon name="User" size={20} color="#64748B" />
                </div>
                <div>
                  <p className="text-text-primary font-medium">{userName}</p>
                  <p className="text-text-secondary text-sm capitalize">{userRole === 'teacher' ? 'Profesor' : 'Estudiante'}</p>
                </div>
              </div>
              
              <Link
                to="/inicio-de-sesi-n-login"
                onClick={closeMobileMenu}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-error hover:bg-error-50 rounded-md transition-colors duration-200 ease-in-out"
              >
                <Icon name="LogOut" size={16} />
                <span>Cerrar Sesión</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default RoleBasedHeader;
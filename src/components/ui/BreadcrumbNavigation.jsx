import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BreadcrumbNavigation = () => {
  const location = useLocation();
  
  const routeLabels = {
    '/panel-del-profesor': 'Panel del Profesor',
    '/gesti-n-de-ex-menes': 'Gestión de Exámenes',
    '/gesti-n-de-estudiantes': 'Gestión de Estudiantes',
    '/dashboard-del-estudiante': 'Dashboard del Estudiante',
    '/interfaz-de-examen': 'Interfaz de Examen',
    '/inicio-de-sesi-n-login': 'Inicio de Sesión'
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [{ label: 'Inicio', path: '/' }];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = routeLabels[currentPath] || segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      breadcrumbs.push({
        label,
        path: currentPath,
        isLast: index === pathSegments.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="mx-2 text-secondary-600" 
              />
            )}
            
            {breadcrumb.isLast ? (
              <span 
                className="text-text-primary font-medium truncate max-w-xs sm:max-w-none"
                aria-current="page"
              >
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                to={breadcrumb.path}
                className="text-text-secondary hover:text-primary transition-colors duration-200 ease-in-out truncate max-w-xs sm:max-w-none"
              >
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbNavigation;
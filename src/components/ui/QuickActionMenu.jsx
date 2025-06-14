import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

const QuickActionMenu = ({ userRole = 'teacher' }) => {
  const teacherActions = [
    {
      title: 'Crear Nuevo Examen',
      description: 'Diseña y configura un nuevo examen para tus estudiantes',
      icon: 'Plus',
      path: '/gesti-n-de-ex-menes',
      color: 'primary',
      featured: true
    },
    {
      title: 'Gestionar Estudiantes',
      description: 'Administra la lista de estudiantes y sus permisos',
      icon: 'Users',
      path: '/gesti-n-de-estudiantes',
      color: 'secondary'
    },
    {
      title: 'Ver Resultados',
      description: 'Revisa el rendimiento y estadísticas de exámenes',
      icon: 'BarChart3',
      path: '/panel-del-profesor',
      color: 'accent'
    },
    {
      title: 'Configuración',
      description: 'Ajusta las preferencias del sistema',
      icon: 'Settings',
      path: '/panel-del-profesor',
      color: 'secondary'
    }
  ];

  const studentActions = [
    {
      title: 'Exámenes Disponibles',
      description: 'Ve los exámenes que puedes realizar ahora',
      icon: 'FileText',
      path: '/interfaz-de-examen',
      color: 'primary',
      featured: true
    },
    {
      title: 'Mi Progreso',
      description: 'Revisa tu historial y calificaciones',
      icon: 'TrendingUp',
      path: '/dashboard-del-estudiante',
      color: 'accent'
    },
    {
      title: 'Exámenes Completados',
      description: 'Consulta los exámenes que ya has terminado',
      icon: 'CheckCircle',
      path: '/dashboard-del-estudiante',
      color: 'success'
    }
  ];

  const actions = userRole === 'teacher' ? teacherActions : studentActions;

  const getColorClasses = (color, featured = false) => {
    const colorMap = {
      primary: {
        bg: featured ? 'bg-primary' : 'bg-primary-50 hover:bg-primary-100',
        text: featured ? 'text-white' : 'text-primary',
        icon: featured ? 'text-white' : 'text-primary',
        border: 'border-primary-200'
      },
      secondary: {
        bg: 'bg-secondary-100 hover:bg-secondary-200',
        text: 'text-secondary-700',
        icon: 'text-secondary-600',
        border: 'border-secondary-200'
      },
      accent: {
        bg: 'bg-accent-50 hover:bg-accent-100',
        text: 'text-accent-600',
        icon: 'text-accent',
        border: 'border-accent-200'
      },
      success: {
        bg: 'bg-success-50 hover:bg-success-100',
        text: 'text-success-600',
        icon: 'text-success',
        border: 'border-success-200'
      }
    };
    return colorMap[color] || colorMap.primary;
  };

  const handleActionClick = (action) => {
    // Add analytics or tracking here if needed
    console.log(`Quick action clicked: ${action.title}`);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          {userRole === 'teacher' ? 'Acciones Rápidas' : 'Actividades'}
        </h2>
        <p className="text-text-secondary">
          {userRole === 'teacher' ?'Accede rápidamente a las funciones más utilizadas' :'Comienza con tus actividades de aprendizaje'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const colors = getColorClasses(action.color, action.featured);
          
          return (
            <Link
              key={index}
              to={action.path}
              onClick={() => handleActionClick(action)}
              className={`
                group relative p-6 rounded-lg border transition-all duration-200 ease-in-out
                ${colors.bg} ${colors.border}
                hover:shadow-md hover:scale-105 active:scale-98
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${action.featured ? 'sm:col-span-2 lg:col-span-1' : ''}
              `}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`
                    p-2 rounded-md transition-colors duration-200 ease-in-out
                    ${action.featured ? 'bg-white bg-opacity-20' : 'bg-white'}
                  `}>
                    <Icon 
                      name={action.icon} 
                      size={24} 
                      className={colors.icon}
                    />
                  </div>
                  {action.featured && (
                    <span className="px-2 py-1 text-xs font-medium bg-white bg-opacity-20 text-white rounded-full">
                      Destacado
                    </span>
                  )}
                </div>
                
                <div className="flex-grow">
                  <h3 className={`text-lg font-semibold mb-2 ${colors.text}`}>
                    {action.title}
                  </h3>
                  <p className={`text-sm ${action.featured ? 'text-white text-opacity-90' : 'text-text-secondary'}`}>
                    {action.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className={`text-sm font-medium ${colors.text}`}>
                    {userRole === 'teacher' ? 'Ir a función' : 'Comenzar'}
                  </span>
                  <Icon 
                    name="ArrowRight" 
                    size={16} 
                    className={`transition-transform duration-200 ease-in-out group-hover:translate-x-1 ${colors.icon}`}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Additional Help Section */}
      <div className="mt-8 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
        <div className="flex items-start space-x-3">
          <Icon name="HelpCircle" size={20} className="text-secondary-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-1">
              ¿Necesitas ayuda?
            </h4>
            <p className="text-sm text-text-secondary mb-2">
              {userRole === 'teacher' ?'Consulta la guía del profesor o contacta con soporte técnico.' :'Si tienes dudas sobre cómo usar la plataforma, consulta la ayuda.'
              }
            </p>
            <button className="text-sm text-primary hover:text-primary-700 font-medium transition-colors duration-200 ease-in-out">
              Ver guía de ayuda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionMenu;
# MathTest Pro

A comprehensive mathematics testing platform built with React and modern web technologies. This application provides an intuitive interface for students to take math exams and for teachers to manage students and create assessments.

## 🌟 Features

### For Students
- **Interactive Exam Interface** - Clean, distraction-free exam environment
- **Progress Tracking** - Real-time progress indicators and performance analytics
- **Achievement System** - Badges and rewards for milestones
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### For Teachers
- **Student Management** - Complete student profile management system
- **Exam Creation** - Flexible exam builder with various question types
- **Analytics Dashboard** - Comprehensive performance metrics and insights
- **Bulk Operations** - Import/export students and manage multiple exams

## 🚀 Live Demo

[View Live Application](https://YOUR_USERNAME.github.io/mathtest-pro/)

## 🛠️ Built With

- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **Redux Toolkit** - Predictable state management
- **TailwindCSS** - Utility-first CSS framework
- **React Router v6** - Declarative routing
- **Framer Motion** - Smooth animations and transitions
- **Recharts & D3.js** - Data visualization and charts
- **React Hook Form** - Efficient form handling
- **Lucide React** - Beautiful icon library

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn
- Git

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/mathtest-pro.git
   cd mathtest-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
mathtest-pro/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Common UI elements
│   │   └── *.jsx          # Component files
│   ├── pages/             # Page components
│   │   ├── dashboard-del-estudiante/     # Student dashboard
│   │   ├── panel-del-profesor/           # Teacher dashboard
│   │   ├── gestion-de-estudiantes/       # Student management
│   │   ├── gestion-de-examenes/          # Exam management
│   │   ├── interfaz-de-examen/           # Exam interface
│   │   └── inicio-de-sesion-login/       # Login system
│   ├── styles/            # Global styles
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main application component
│   ├── Routes.jsx         # Application routing
│   └── index.jsx          # Entry point
├── .github/
│   └── workflows/         # GitHub Actions
├── scripts/               # Deployment scripts
└── docs/                  # Documentation
```

## 🎯 Key Features

### Student Dashboard
- **Progress Overview** - Visual progress tracking with charts
- **Available Exams** - List of upcoming and available tests
- **Achievement Badges** - Gamification elements
- **Recent Activity** - History of completed exams

### Teacher Dashboard
- **Metrics Cards** - Overview of student performance
- **Class Management** - Student enrollment and progress
- **Exam Analytics** - Detailed performance insights

### Exam Interface
- **Question Display** - Clean, focused question presentation
- **Navigation Controls** - Easy movement between questions
- **Progress Indicator** - Visual progress through exam
- **Results Summary** - Immediate feedback upon completion

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Serve production build locally
- `npm test` - Run test suite
- `npm run lint` - Run ESLint

## 🚀 Deployment

This project is configured for easy deployment to GitHub Pages. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### Quick Deploy
```bash
# Build the project
npm run build

# Deploy to GitHub Pages (automatic via GitHub Actions)
git push origin main
```

## 🎨 Customization

### Styling
The project uses Tailwind CSS with custom configurations:
- **Colors**: Customizable color palette in `tailwind.config.js`
- **Typography**: Responsive font sizes and spacing
- **Components**: Modular component styling

### Themes
Easily switch between light and dark themes by modifying the Tailwind configuration.

## 🔒 Security Features

- **Input Validation** - Comprehensive form validation
- **Error Boundaries** - Graceful error handling
- **Secure Routing** - Protected routes for different user roles
- **Data Sanitization** - XSS protection

## 🌍 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern React best practices
- Styled with Tailwind CSS
- Icons by Lucide React
- Animations by Framer Motion
- Charts by Recharts and D3.js

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/YOUR_USERNAME/mathtest-pro/issues) page
2. Create a new issue with detailed information
3. Review the documentation in the `docs/` folder

---

**Built with ❤️ using React and modern web technologies**

*Don't forget to star ⭐ this repository if you find it useful!*
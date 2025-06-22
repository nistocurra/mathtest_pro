import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { AuthProvider } from "context/AuthContext";

// Page imports
import Login from "pages/inicio-de-sesi-n-login";
import TeacherPanel from "pages/panel-del-profesor";
import PracticeManagement from "pages/gesti-n-de-ex-menes";
import StudentManagement from "pages/gesti-n-de-estudiantes";
import GroupManagement from "pages/gesti-n-de-grupos";
import StudentDashboard from "pages/dashboard-del-estudiante";
import ExamInterface from "pages/interfaz-de-examen";

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            <Route path="/" element={<Login />} />
            <Route path="/inicio-de-sesi-n-login" element={<Login />} />
            <Route path="/panel-del-profesor" element={<TeacherPanel />} />
            <Route path="/gesti-n-de-ex-menes" element={<PracticeManagement />} />
            <Route path="/gesti-n-de-estudiantes" element={<StudentManagement />} />
            <Route path="/gesti-n-de-grupos" element={<GroupManagement />} />
            <Route path="/dashboard-del-estudiante" element={<StudentDashboard />} />
            <Route path="/interfaz-de-examen" element={<ExamInterface />} />
          </RouterRoutes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
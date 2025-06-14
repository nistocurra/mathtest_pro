import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

// Page imports
import Login from "pages/inicio-de-sesi-n-login";
import TeacherPanel from "pages/panel-del-profesor";
import ExamManagement from "pages/gesti-n-de-ex-menes";
import StudentManagement from "pages/gesti-n-de-estudiantes";
import StudentDashboard from "pages/dashboard-del-estudiante";
import ExamInterface from "pages/interfaz-de-examen";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<Login />} />
          <Route path="/inicio-de-sesi-n-login" element={<Login />} />
          <Route path="/panel-del-profesor" element={<TeacherPanel />} />
          <Route path="/gesti-n-de-ex-menes" element={<ExamManagement />} />
          <Route path="/gesti-n-de-estudiantes" element={<StudentManagement />} />
          <Route path="/dashboard-del-estudiante" element={<StudentDashboard />} />
          <Route path="/interfaz-de-examen" element={<ExamInterface />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
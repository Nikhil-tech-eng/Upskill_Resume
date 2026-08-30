import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResumeUpload from "./pages/ResumeUpload";
import ResumeBuilder from "./pages/ResumeBuilder";
import JobMatching from "./pages/JobMatching";
import InterviewPreparation from "./pages/InterviewPreparation";
import LearningResources from "./pages/LearningResources";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <ProtectedAdminRoute>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </ProtectedAdminRoute>
    );
  }

  return (
    <div className="app-container">
      {/* GLOBAL NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT WITH ROUTER */}
      <main className="app-main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/about" element={<Navigate to="/about-us" replace />} />
          <Route path="/contact" element={<Contact />} />

          {/* Authenticated User Routes */}
          <Route
            path="/resume-builder"
            element={
              <ProtectedRoute>
                <ResumeBuilder />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resume-analysis"
            element={
              <ProtectedRoute>
                <ResumeUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ats"
            element={<Navigate to="/resume-analysis" replace />}
          />

          <Route
            path="/job-matching"
            element={
              <ProtectedRoute>
                <JobMatching />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview-preparation"
            element={
              <ProtectedRoute>
                <InterviewPreparation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/learning-resources"
            element={
              <ProtectedRoute>
                <LearningResources />
              </ProtectedRoute>
            }
          />

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
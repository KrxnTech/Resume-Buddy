import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Loading Fallback spinner
const PageLoader = () => (
  <div className="page-loading-fallback">
    <span className="btn-spinner" style={{ width: "32px", height: "32px" }} />
    <p>Loading Workspace Page...</p>
  </div>
);

// Lazy Loaded Pages
const Landing = lazy(() => import("../pages/Landing"));
const AboutUs = lazy(() => import("../pages/AboutUs"));
const Features = lazy(() => import("../pages/Features"));
const Help = lazy(() => import("../pages/Help"));
const Upload = lazy(() => import("../pages/Upload"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const DashboardLayout = lazy(() => import("../layouts/DashboardLayout"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const ATS = lazy(() => import("../pages/ATS"));
const Recruiter = lazy(() => import("../pages/Recruiter"));
const ResumeProfile = lazy(() => import("../pages/ResumeProfile"));
const SectionAnalyzer = lazy(() => import("../pages/SectionAnalyzer"));

// SaaS Utilities
const ResumeHealth = lazy(() => import("../pages/ResumeHealth"));
const InterviewPrep = lazy(() => import("../pages/InterviewPrep"));
const CareerRoadmap = lazy(() => import("../pages/CareerRoadmap"));
const ExportReport = lazy(() => import("../pages/ExportReport"));
const Settings = lazy(() => import("../pages/Settings"));
const CareerCopilot = lazy(() => import("../pages/CareerCopilot"));

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/features" element={<Features />} />
        <Route path="/help" element={<Help />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Upload scanner portal route */}
        <Route path="/upload" element={<Upload />} />

        {/* Dashboard Shell Nested Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<ResumeProfile />} />
          <Route path="ats" element={<ATS />} />
          <Route path="recruiter" element={<Recruiter />} />
          <Route path="sections" element={<SectionAnalyzer />} />

          {/* SaaS Utilities */}
          <Route path="health" element={<ResumeHealth />} />
          <Route path="interview" element={<InterviewPrep />} />
          <Route path="roadmap" element={<CareerRoadmap />} />
          <Route path="export" element={<ExportReport />} />
          <Route path="copilot" element={<CareerCopilot />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;

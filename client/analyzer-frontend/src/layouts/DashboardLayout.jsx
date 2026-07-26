import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAnalysis } from "../hooks/useAnalysis";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

function DashboardLayout() {
  const { hasAnalysis } = useAnalysis();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  // Auto redirect to upload page if there is no scan data, except for Settings
  useEffect(() => {
    const path = location.pathname;
    if (!hasAnalysis && path.startsWith("/dashboard") && path !== "/dashboard" && path !== "/dashboard/settings") {
      navigate("/upload");
    }
  }, [hasAnalysis, location.pathname, navigate]);

  // Window resizing handler
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false); // Start collapsed on mobile
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeMobileSidebar = () => {
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className={`dashboard-layout-container ${isMobile ? "mobile-viewport" : ""}`}>
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleOpen={toggleSidebar}
        isMobile={isMobile}
        closeMobile={closeMobileSidebar}
      />

      {/* Main Panel Content Area */}
      <div className={`dashboard-main-panel ${sidebarOpen && !isMobile ? "with-sidebar-expanded" : "with-sidebar-collapsed"}`}>
        <TopNavbar
          toggleMobileSidebar={toggleSidebar}
          isMobile={isMobile}
        />

        <main className="dashboard-content-outlet">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;

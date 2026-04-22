import { Outlet, useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [navigate, location]);

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

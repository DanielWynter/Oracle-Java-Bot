import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, User, LogOut, ChevronDown, Layers } from "lucide-react";
import { useSprint } from "../context/SprintContext.tsx";

export default function Navbar() {
  const navigate = useNavigate();
  const { sprints, selectedSprintId, setSelectedSprintId } = useSprint();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userEmail = localStorage.getItem("userEmail") || "user@oracle.com";
  const userRole = localStorage.getItem("userRole") || "developer";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6">
      {/* Sprint Selector */}
      <div className="flex items-center gap-2">
        <Layers className="w-4 h-4 text-[#2563EB]" />
        <select
          value={selectedSprintId ?? ""}
          onChange={(e) =>
            setSelectedSprintId(
              e.target.value !== "" ? Number(e.target.value) : null
            )
          }
          className="px-3 py-1.5 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-lg text-sm text-[#2563EB] font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB] cursor-pointer"
        >
          <option value="">All Sprints</option>
          {sprints.map((s) => (
            <option key={s.sprintId} value={s.sprintId}>
              {s.sprintName}
              {s.status?.toLowerCase() === "active" ? " (Active)" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-4">
        {/* Global Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search tasks, sprints, team..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-80 pl-10 pr-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-[#F7F8FA] rounded-lg transition-colors group">
          <Bell className="w-5 h-5 text-[#6B7280] group-hover:text-[#1A1A1A]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#C74634] rounded-full" />
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 px-3 py-2 hover:bg-[#F7F8FA] rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-[#C74634] rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-[#1A1A1A]">
                {userEmail.split("@")[0]}
              </p>
              <p className="text-xs text-[#6B7280] capitalize">{userRole}</p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[#6B7280] transition-transform ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E5E7EB] rounded-lg shadow-xl py-2 z-50">
              <div className="px-4 py-3 border-b border-[#E5E7EB]">
                <p className="text-sm font-medium text-[#1A1A1A]">
                  {userEmail}
                </p>
                <p className="text-xs text-[#6B7280] capitalize mt-1">
                  {userRole}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-[#DC2626] hover:bg-[#DC2626]/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

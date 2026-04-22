import { useState } from "react";
import { User, Bell, Palette, Shield } from "lucide-react";

export default function Settings() {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    taskAssignments: true,
    sprintUpdates: true,
    weeklyReports: false,
  });

  const [profile, setProfile] = useState({
    name: localStorage.getItem("userEmail")?.split("@")[0] || "User",
    email: localStorage.getItem("userEmail") || "user@oracle.com",
    role: localStorage.getItem("userRole") || "developer",
  });

  const [theme, setTheme] = useState("light");

  const handleSaveProfile = () => {
    alert("Profile updated successfully!");
  };

  const handleSaveNotifications = () => {
    alert("Notification preferences saved!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-[#1A1A1A] mb-2">Settings</h1>
        <p className="text-[#6B7280]">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#C74634]/10 rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-[#C74634]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1A1A1A]">
              Profile Settings
            </h3>
            <p className="text-sm text-[#6B7280]">
              Update your personal information
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Role
            </label>
            <select
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
            >
              <option value="developer">Developer</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <button
            onClick={handleSaveProfile}
            className="px-6 py-2 bg-[#C74634] text-white rounded-lg hover:bg-[#9E2A1F] transition-colors"
          >
            Save Profile
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center">
            <Bell className="w-6 h-6 text-[#2563EB]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1A1A1A]">
              Notification Preferences
            </h3>
            <p className="text-sm text-[#6B7280]">
              Configure how you receive updates
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </p>
                <p className="text-xs text-[#6B7280] mt-1">
                  Receive notifications for this event
                </p>
              </div>
              <button
                onClick={() =>
                  setNotifications({ ...notifications, [key]: !value })
                }
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  value ? "bg-[#C74634]" : "bg-[#E5E7EB]"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    value ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}

          <button
            onClick={handleSaveNotifications}
            className="px-6 py-2 bg-[#C74634] text-white rounded-lg hover:bg-[#9E2A1F] transition-colors mt-4"
          >
            Save Preferences
          </button>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center">
            <Palette className="w-6 h-6 text-[#F59E0B]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1A1A1A]">
              Theme Settings
            </h3>
            <p className="text-sm text-[#6B7280]">Choose your preferred theme</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setTheme("light")}
            className={`p-4 rounded-lg border-2 transition-all ${
              theme === "light"
                ? "border-[#C74634] bg-[#C74634]/5"
                : "border-[#E5E7EB] hover:border-[#C74634]/30"
            }`}
          >
            <div className="w-full h-24 bg-white rounded-lg border border-[#E5E7EB] mb-3" />
            <p className="text-sm font-medium text-[#1A1A1A]">Light Mode</p>
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`p-4 rounded-lg border-2 transition-all ${
              theme === "dark"
                ? "border-[#C74634] bg-[#C74634]/5"
                : "border-[#E5E7EB] hover:border-[#C74634]/30"
            }`}
          >
            <div className="w-full h-24 bg-[#1A1A1A] rounded-lg border border-[#E5E7EB] mb-3" />
            <p className="text-sm font-medium text-[#1A1A1A]">Dark Mode</p>
            <p className="text-xs text-[#6B7280] mt-1">Coming Soon</p>
          </button>
        </div>
      </div>

      {/* Role Management */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#16A34A]/10 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#16A34A]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1A1A1A]">
              Role Management
            </h3>
            <p className="text-sm text-[#6B7280]">Manage access and permissions</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-[#F7F8FA] rounded-lg border border-[#E5E7EB]">
            <p className="text-sm font-medium text-[#1A1A1A] mb-1">
              Current Role: <span className="capitalize">{profile.role}</span>
            </p>
            <p className="text-xs text-[#6B7280]">
              {profile.role === "manager"
                ? "Full access to all features including team management and reports"
                : "Access to task management and personal dashboard"}
            </p>
          </div>

          <div className="p-4 bg-[#2563EB]/5 border border-[#2563EB]/20 rounded-lg">
            <p className="text-sm text-[#2563EB]">
              💡 Contact your administrator to change your role permissions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

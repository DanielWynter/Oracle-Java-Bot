import { useEffect, useState } from "react";
import { User, Bell, Palette, Shield, Check } from "lucide-react";

interface UserFull {
  userId: number;
  username: string;
  email: string;
  userRole: string;
  passwordHash: string;
  team: object | null;
  project: object | null;
}

interface NotificationPrefs {
  emailNotifications: boolean;
  taskAssignments: boolean;
  sprintUpdates: boolean;
  weeklyReports: boolean;
}

const NOTIF_KEY = "notificationPrefs";

function loadNotifPrefs(): NotificationPrefs {
  try {
    const stored = localStorage.getItem(NOTIF_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    emailNotifications: true,
    taskAssignments: true,
    sprintUpdates: true,
    weeklyReports: false,
  };
}

const NOTIF_LABELS: Record<keyof NotificationPrefs, string> = {
  emailNotifications: "Email Notifications",
  taskAssignments: "Task Assignments",
  sprintUpdates: "Sprint Updates",
  weeklyReports: "Weekly Reports",
};

export default function Settings() {
  const [currentUser, setCurrentUser] = useState<UserFull | null>(null);
  const [profile, setProfile] = useState({ name: "", email: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [notifications, setNotifications] =
    useState<NotificationPrefs>(loadNotifPrefs);
  const [notifSaved, setNotifSaved] = useState(false);

  const [theme, setTheme] = useState("light");

  // Load user from DB on mount
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) { setLoading(false); return; }

    fetch("/api/users")
      .then((r) => r.json())
      .then((users: UserFull[]) => {
        const me = users.find((u) => u.email === email);
        if (me) {
          setCurrentUser(me);
          setProfile({
            name: me.username ?? "",
            email: me.email ?? "",
            role: me.userRole ?? "developer",
          });
        } else {
          // Fallback to localStorage values
          setProfile({
            name: email.split("@")[0],
            email,
            role: localStorage.getItem("userRole") ?? "developer",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setProfileError("");
    try {
      if (currentUser) {
        const body: UserFull = {
          ...currentUser,
          username: profile.name,
          email: profile.email,
          userRole: profile.role,
        };
        const res = await fetch(`/api/users/${currentUser.userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Server error");
        const updated: UserFull = await res.json();
        setCurrentUser(updated);
      }
      localStorage.setItem("userEmail", profile.email);
      localStorage.setItem("userRole", profile.role);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch {
      setProfileError("Failed to save profile. Please try again.");
    }
  };

  const handleSaveNotifications = () => {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications));
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 3000);
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

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-[#F7F8FA] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
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
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Role
              </label>
              <input
                type="text"
                value={profile.role}
                readOnly
                className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg text-[#6B7280] cursor-not-allowed"
              />
              <p className="text-xs text-[#6B7280] mt-1">
                Role is managed by your administrator.
              </p>
            </div>

            {profileError && (
              <p className="text-sm text-[#DC2626]">{profileError}</p>
            )}

            <button
              onClick={handleSaveProfile}
              className="flex items-center gap-2 px-6 py-2 bg-[#C74634] text-white rounded-lg hover:bg-[#9E2A1F] transition-colors"
            >
              {profileSaved && <Check className="w-4 h-4" />}
              {profileSaved ? "Saved!" : "Save Profile"}
            </button>
          </div>
        )}
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
          {(Object.keys(notifications) as (keyof NotificationPrefs)[]).map((key) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  {NOTIF_LABELS[key]}
                </p>
                <p className="text-xs text-[#6B7280] mt-1">
                  Receive notifications for this event
                </p>
              </div>
              <button
                onClick={() =>
                  setNotifications({ ...notifications, [key]: !notifications[key] })
                }
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications[key] ? "bg-[#C74634]" : "bg-[#E5E7EB]"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifications[key] ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}

          <button
            onClick={handleSaveNotifications}
            className="flex items-center gap-2 px-6 py-2 bg-[#C74634] text-white rounded-lg hover:bg-[#9E2A1F] transition-colors mt-4"
          >
            {notifSaved && <Check className="w-4 h-4" />}
            {notifSaved ? "Saved!" : "Save Preferences"}
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
            <p className="text-sm text-[#6B7280]">
              Choose your preferred theme
            </p>
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
            <p className="text-sm text-[#6B7280]">
              Manage access and permissions
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-[#F7F8FA] rounded-lg border border-[#E5E7EB]">
            <p className="text-sm font-medium text-[#1A1A1A] mb-1">
              Current Role:{" "}
              <span className="capitalize">{profile.role || "—"}</span>
            </p>
            <p className="text-xs text-[#6B7280]">
              {profile.role?.toLowerCase() === "manager"
                ? "Full access to all features including team management and reports"
                : "Access to task management and personal dashboard"}
            </p>
          </div>

          <div className="p-4 bg-[#2563EB]/5 border border-[#2563EB]/20 rounded-lg">
            <p className="text-sm text-[#2563EB]">
              Contact your administrator to change your role permissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

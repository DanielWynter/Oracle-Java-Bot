import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import oracleLogo from "../assets/oracle-logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"manager" | "developer">("developer");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      if (email && password) {
        localStorage.setItem("userRole", role);
        localStorage.setItem("userEmail", email);
        navigate("/dashboard");
      } else {
        setError("Please enter valid credentials");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F8FA] to-[#E5E7EB] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src={oracleLogo} alt="Oracle Logo" className="h-8 w-auto" />
          </div>

          <h1 className="text-3xl font-semibold text-[#1A1A1A] mb-2">
            Dev Productivity Portal
          </h1>

          <p className="text-[#6B7280]">
            Sign in to manage your team's productivity
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
                Role
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("developer")}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    role === "developer"
                      ? "border-[#C74634] bg-[#C74634]/5 text-[#C74634]"
                      : "border-[#E5E7EB] text-[#6B7280] hover:border-[#C74634]/30"
                  }`}
                >
                  Developer
                </button>

                <button
                  type="button"
                  onClick={() => setRole("manager")}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    role === "manager"
                      ? "border-[#C74634] bg-[#C74634]/5 text-[#C74634]"
                      : "border-[#E5E7EB] text-[#6B7280] hover:border-[#C74634]/30"
                  }`}
                >
                  Manager
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#1A1A1A] mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#1A1A1A] mb-2"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent transition-all pr-12"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1A1A1A]"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-lg text-[#DC2626] text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#C74634] text-white py-3 rounded-lg hover:bg-[#9E2A1F] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-[#E5E7EB] text-center">
            <p className="text-sm text-[#6B7280]">
              Demo credentials: any email/password
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-[#6B7280] mt-6">
          © 2026 Oracle Dev Productivity Portal
        </p>
      </div>
    </div>
  );
}

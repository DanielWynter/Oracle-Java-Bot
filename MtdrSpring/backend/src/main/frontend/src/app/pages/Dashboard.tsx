import KPIWidget from "../components/KPIWidget";
import BurndownChart from "../components/BurndownChart";
import VelocityChart from "../components/VelocityChart";
import EstimationChart from "../components/EstimationChart";
import TaskTypeChart from "../components/TaskTypeChart";
import TeamWorkload from "../components/TeamWorkload";
import ActivityFeed from "../components/ActivityFeed";
import {
  Target,
  CheckSquare,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Percent,
} from "lucide-react";

export default function Dashboard() {
  // SIMULACIÓN TEMPORAL DE ROLES PARA LOS TESTS
  const userRole = localStorage.getItem("userRole") || "developer";

  const kpiData = [
    {
      label: "Sprint Completion",
      value: "78%",
      change: "+12%",
      trend: "up" as const,
      icon: Target,
      color: "#2563EB",
    },
    {
      label: "Total Tasks",
      value: "124",
      change: "+8",
      trend: "up" as const,
      icon: CheckSquare,
      color: "#6B7280",
    },
    {
      label: "Completed Tasks",
      value: "97",
      change: "+15",
      trend: "up" as const,
      icon: CheckCircle2,
      color: "#16A34A",
    },
    {
      label: "Overdue Tasks",
      value: "5",
      change: "-3",
      trend: "down" as const,
      icon: AlertCircle,
      color: "#DC2626",
    },
    {
      label: "Velocity",
      value: "42",
      change: "+5",
      trend: "up" as const,
      icon: TrendingUp,
      color: "#FF6B35",
    },
    {
      label: "Estimation Accuracy",
      value: "89%",
      change: "+4%",
      trend: "up" as const,
      icon: Percent,
      color: "#F59E0B",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-[#1A1A1A] mb-2">
          Dashboard
        </h1>
        <p className="text-[#6B7280]">
          Monitor your team's productivity and sprint progress
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi) => (
          <KPIWidget key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BurndownChart />
        {/* Renderizado condicional */}
        {userRole === "admin" || userRole === "pm" ? <VelocityChart /> : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EstimationChart />
        {/* Renderizado condicional */}
        {userRole === "admin" || userRole === "pm" ? <TaskTypeChart /> : null}
      </div>

      {/* Team Workload & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TeamWorkload />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
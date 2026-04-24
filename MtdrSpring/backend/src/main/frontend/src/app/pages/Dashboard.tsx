import { useEffect, useState } from "react";
import KPIWidget from "../components/KPIWidget.tsx";
import BurndownChart from "../components/BurndownChart.tsx";
import VelocityChart from "../components/VelocityChart.tsx";
import EstimationChart from "../components/EstimationChart.tsx";
import TaskTypeChart from "../components/TaskTypeChart.tsx";
import TeamWorkload from "../components/TeamWorkload.tsx";
import ActivityFeed from "../components/ActivityFeed.tsx";
import {
  Target,
  CheckSquare,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Percent,
} from "lucide-react";

interface TaskRaw {
  taskId: number;
  status: string;
  hours: number;
  totalTime: number;
  sprint: { sprintId: number; sprintName: string } | null;
}

interface SprintRaw {
  sprintId: number;
  endDate: string;
}

const isDone = (status: string) =>
  ["done", "completed", "finished"].includes(status?.toLowerCase() ?? "");

function formatChange(diff: number, isPercent = false): string {
  const sign = diff >= 0 ? "+" : "";
  return `${sign}${diff}${isPercent ? "%" : ""}`;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<TaskRaw[]>([]);
  const [sprints, setSprints] = useState<SprintRaw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/tasks").then((r) => r.json()),
      fetch("/api/sprints").then((r) => r.json()),
    ])
      .then(([tasksData, sprintsData]) => {
        setTasks(tasksData);
        setSprints(sprintsData);
      })
      .finally(() => setLoading(false));
  }, []);

  // Unique sprint IDs sorted descending (most recent first)
  const sprintIds = [
    ...new Set(
      tasks
        .map((t) => t.sprint?.sprintId)
        .filter((id): id is number => id != null)
    ),
  ].sort((a, b) => b - a);

  const currId = sprintIds[0];
  const prevId = sprintIds[1];

  const currTasks = tasks.filter((t) => t.sprint?.sprintId === currId);
  const prevTasks = tasks.filter((t) => t.sprint?.sprintId === prevId);
  const currDone = currTasks.filter((t) => isDone(t.status));
  const prevDone = prevTasks.filter((t) => isDone(t.status));

  // Sprint Completion %
  const sprintComp =
    currTasks.length > 0
      ? Math.round((currDone.length / currTasks.length) * 100)
      : 0;
  const prevSprintComp =
    prevTasks.length > 0
      ? Math.round((prevDone.length / prevTasks.length) * 100)
      : 0;
  const sprintCompDiff = sprintComp - prevSprintComp;

  // Total Tasks
  const totalDiff = currTasks.length - prevTasks.length;

  // Completed Tasks (all time)
  const completedTotal = tasks.filter((t) => isDone(t.status)).length;
  const completedDiff = currDone.length - prevDone.length;

  // Overdue: not done and sprint ended before today
  const today = new Date();
  const sprintEndMap = Object.fromEntries(
    sprints.map((s) => [s.sprintId, s.endDate])
  );
  const overdueTasks = tasks.filter((t) => {
    if (!t.sprint || isDone(t.status)) return false;
    const end = sprintEndMap[t.sprint.sprintId];
    return end && new Date(end) < today;
  }).length;

  // Velocity: estimated hours completed in current sprint
  const currVelocity = Math.round(
    currDone.reduce((s, t) => s + (t.hours || 0), 0)
  );
  const prevVelocity = Math.round(
    prevDone.reduce((s, t) => s + (t.hours || 0), 0)
  );
  const velocityDiff = currVelocity - prevVelocity;

  // Estimation Accuracy
  const withBoth = tasks.filter(
    (t) => isDone(t.status) && t.hours > 0 && t.totalTime > 0
  );
  const accuracy =
    withBoth.length > 0
      ? Math.round(
          (withBoth.reduce(
            (s, t) =>
              s + Math.max(0, 1 - Math.abs(t.totalTime - t.hours) / t.hours),
            0
          ) /
            withBoth.length) *
            100
        )
      : 0;
  const prevWithBoth = prevTasks.filter(
    (t) => isDone(t.status) && t.hours > 0 && t.totalTime > 0
  );
  const prevAccuracy =
    prevWithBoth.length > 0
      ? Math.round(
          (prevWithBoth.reduce(
            (s, t) =>
              s + Math.max(0, 1 - Math.abs(t.totalTime - t.hours) / t.hours),
            0
          ) /
            prevWithBoth.length) *
            100
        )
      : 0;
  const accuracyDiff = accuracy - prevAccuracy;

  const kpiData = [
    {
      label: "Sprint Completion",
      value: `${sprintComp}%`,
      change: formatChange(sprintCompDiff, true),
      trend: sprintCompDiff >= 0 ? ("up" as const) : ("down" as const),
      icon: Target,
      color: "#2563EB",
    },
    {
      label: "Total Tasks",
      value: `${tasks.length}`,
      change: formatChange(totalDiff),
      trend: totalDiff >= 0 ? ("up" as const) : ("down" as const),
      icon: CheckSquare,
      color: "#6B7280",
    },
    {
      label: "Completed Tasks",
      value: `${completedTotal}`,
      change: formatChange(completedDiff),
      trend: completedDiff >= 0 ? ("up" as const) : ("down" as const),
      icon: CheckCircle2,
      color: "#16A34A",
    },
    {
      label: "Overdue Tasks",
      value: `${overdueTasks}`,
      change: `${overdueTasks}`,
      trend: overdueTasks === 0 ? ("up" as const) : ("down" as const),
      icon: AlertCircle,
      color: "#DC2626",
    },
    {
      label: "Velocity",
      value: `${currVelocity}`,
      change: formatChange(velocityDiff),
      trend: velocityDiff >= 0 ? ("up" as const) : ("down" as const),
      icon: TrendingUp,
      color: "#FF6B35",
    },
    {
      label: "Estimation Accuracy",
      value: `${accuracy}%`,
      change: formatChange(accuracyDiff, true),
      trend: accuracyDiff >= 0 ? ("up" as const) : ("down" as const),
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
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-[#E5E7EB] animate-pulse h-[140px]"
              />
            ))
          : kpiData.map((kpi) => <KPIWidget key={kpi.label} {...kpi} />)}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BurndownChart />
        <VelocityChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EstimationChart />
        <TaskTypeChart />
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

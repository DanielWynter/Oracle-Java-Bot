import { useEffect, useState } from "react";
import KPIWidget from "../components/KPIWidget.tsx";
import BurndownChart from "../components/BurndownChart.tsx";
import VelocityChart from "../components/VelocityChart.tsx";
import EstimationChart from "../components/EstimationChart.tsx";
import TaskTypeChart from "../components/TaskTypeChart.tsx";
import TeamWorkload from "../components/TeamWorkload.tsx";
import ActivityFeed from "../components/ActivityFeed.tsx";
import { useSprint } from "../context/SprintContext.tsx";
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
  sprint: { sprintId: number } | null;
}

const isDone = (status: string) =>
  ["done", "completed", "finished"].includes(status?.toLowerCase() ?? "");

function formatChange(diff: number, isPercent = false): string {
  const sign = diff >= 0 ? "+" : "";
  return `${sign}${diff}${isPercent ? "%" : ""}`;
}

export default function Dashboard() {
  const { sprints, selectedSprintId } = useSprint();
  const [tasks, setTasks] = useState<TaskRaw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then(setTasks)
      .finally(() => setLoading(false));
  }, []);

  // Determine current and previous sprint IDs
  // sprints is sorted descending by sprintId (most recent first)
  const sortedSprintIds = sprints.map((s) => s.sprintId);

  const currId =
    selectedSprintId ??
    // When "All Sprints" is selected, use the most recent sprint with tasks
    [...new Set(tasks.map((t) => t.sprint?.sprintId).filter((id): id is number => id != null))]
      .sort((a, b) => b - a)[0];

  const currIdxInSprints = sortedSprintIds.indexOf(currId);
  const prevId =
    currIdxInSprints >= 0
      ? sortedSprintIds[currIdxInSprints + 1]
      : undefined;

  // Filter tasks
  const currTasks = selectedSprintId
    ? tasks.filter((t) => t.sprint?.sprintId === currId)
    : tasks; // "All Sprints" shows aggregate of all tasks
  const prevTasks = prevId
    ? tasks.filter((t) => t.sprint?.sprintId === prevId)
    : [];

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

  // Completed Tasks
  const completedTotal = currTasks.filter((t) => isDone(t.status)).length;
  const completedDiff = currDone.length - prevDone.length;

  // Overdue: not done and sprint ended before today
  const today = new Date();
  const sprintEndMap = Object.fromEntries(
    sprints.map((s) => [s.sprintId, s.endDate])
  );
  const overdueTasks = tasks.filter((t) => {
    if (!t.sprint || isDone(t.status)) return false;
    // Only count overdue for selected sprint (or all if no selection)
    if (selectedSprintId && t.sprint.sprintId !== selectedSprintId) return false;
    const end = sprintEndMap[t.sprint.sprintId];
    return end && new Date(end) < today;
  }).length;

  // Velocity: estimated hours completed in current sprint scope
  const currVelocity = Math.round(
    currDone.reduce((s, t) => s + (t.hours || 0), 0)
  );
  const prevVelocity = Math.round(
    prevDone.reduce((s, t) => s + (t.hours || 0), 0)
  );
  const velocityDiff = currVelocity - prevVelocity;

  // Estimation Accuracy
  const withBoth = currTasks.filter(
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
      value: `${currTasks.length}`,
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
      value: `${currVelocity}h`,
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
          {selectedSprintId
            ? `Showing data for ${sprints.find((s) => s.sprintId === selectedSprintId)?.sprintName ?? "selected sprint"}`
            : "Showing aggregate data across all sprints"}
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

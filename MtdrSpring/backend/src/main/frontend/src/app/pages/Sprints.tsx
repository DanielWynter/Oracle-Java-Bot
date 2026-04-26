import { useEffect, useState } from "react";
import { Calendar, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { useSprint } from "../context/SprintContext.tsx";
import type { Sprint } from "../context/SprintContext.tsx";
import BurndownChart from "../components/BurndownChart.tsx";

interface TaskRaw {
  status: string;
  hours: number;
  sprint: { sprintId: number } | null;
}

const isDone = (s: string) =>
  ["done", "completed", "finished"].includes(s?.toLowerCase() ?? "");

function formatDate(str: string): string {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysRemaining(endStr: string): string {
  const [y, m, d] = endStr.split("-").map(Number);
  const end = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((end.getTime() - today.getTime()) / 86_400_000);
  if (diff < 0) return "Ended";
  if (diff === 0) return "Last day";
  return `${diff} day${diff !== 1 ? "s" : ""}`;
}

function statusLabel(status: string): string {
  const s = status?.toLowerCase();
  if (s === "active") return "Active";
  if (s === "completed") return "Completed";
  return status ?? "Unknown";
}

function statusColor(status: string): string {
  const s = status?.toLowerCase();
  if (s === "active") return "#2563EB";
  if (s === "completed") return "#16A34A";
  return "#6B7280";
}

interface SprintStats {
  sprint: Sprint;
  total: number;
  done: number;
  progress: number;
  velocity: number;
}

function computeStats(sprint: Sprint, tasks: TaskRaw[]): SprintStats {
  const sprintTasks = tasks.filter(
    (t) => t.sprint?.sprintId === sprint.sprintId
  );
  const doneTasks = sprintTasks.filter((t) => isDone(t.status));
  const progress =
    sprintTasks.length > 0
      ? Math.round((doneTasks.length / sprintTasks.length) * 100)
      : 0;
  const velocity = Math.round(
    doneTasks.reduce((s, t) => s + (t.hours || 0), 0)
  );
  return {
    sprint,
    total: sprintTasks.length,
    done: doneTasks.length,
    progress,
    velocity,
  };
}

export default function Sprints() {
  const { sprints, selectedSprintId } = useSprint();
  const [tasks, setTasks] = useState<TaskRaw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then(setTasks)
      .finally(() => setLoading(false));
  }, []);

  // Resolve the selected sprint object (most recent as fallback)
  const selectedSprint =
    sprints.find((s) => s.sprintId === selectedSprintId) ?? sprints[0];

  const stats = selectedSprint
    ? computeStats(selectedSprint, tasks)
    : null;

  // All sprints stats for the comparison table (sorted ascending)
  const allStats: SprintStats[] = [...sprints]
    .sort((a, b) => a.sprintId - b.sprintId)
    .map((s) => computeStats(s, tasks));

  if (!loading && !sprints.length) {
    return (
      <div className="flex items-center justify-center h-64 text-[#6B7280]">
        No sprints found in the database.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-[#1A1A1A] mb-2">
          Sprint Management
        </h1>
        <p className="text-[#6B7280]">
          {selectedSprint
            ? `Viewing ${selectedSprint.sprintName} — use the Navbar selector to switch sprints`
            : "Track and manage sprint progress"}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sprint Progress */}
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
          <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center mb-3">
            <Calendar className="w-6 h-6 text-[#2563EB]" />
          </div>
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-1">
            {loading ? "—" : `${stats?.progress ?? 0}%`}
          </h3>
          <p className="text-sm text-[#6B7280]">Sprint Progress</p>
        </div>

        {/* Tasks Completed */}
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
          <div className="w-12 h-12 bg-[#16A34A]/10 rounded-lg flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6 text-[#16A34A]" />
          </div>
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-1">
            {loading ? "—" : `${stats?.done ?? 0} / ${stats?.total ?? 0}`}
          </h3>
          <p className="text-sm text-[#6B7280]">Tasks Completed</p>
        </div>

        {/* Velocity */}
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
          <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center mb-3">
            <TrendingUp className="w-6 h-6 text-[#FF6B35]" />
          </div>
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-1">
            {loading ? "—" : `${stats?.velocity ?? 0}h`}
          </h3>
          <p className="text-sm text-[#6B7280]">Velocity (hours)</p>
        </div>

        {/* Days Remaining */}
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
          <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center mb-3">
            <Clock className="w-6 h-6 text-[#F59E0B]" />
          </div>
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-1">
            {loading || !selectedSprint
              ? "—"
              : daysRemaining(selectedSprint.endDate)}
          </h3>
          <p className="text-sm text-[#6B7280]">Days Remaining</p>
        </div>
      </div>

      {/* Sprint Timeline */}
      {selectedSprint && (
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">
            Sprint Timeline
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Sprint</span>
              <span className="font-medium text-[#1A1A1A]">
                {selectedSprint.sprintName}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Status</span>
              <span
                className="font-medium"
                style={{ color: statusColor(selectedSprint.status) }}
              >
                {statusLabel(selectedSprint.status)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Start Date</span>
              <span className="font-medium text-[#1A1A1A]">
                {formatDate(selectedSprint.startDate)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">End Date</span>
              <span className="font-medium text-[#1A1A1A]">
                {formatDate(selectedSprint.endDate)}
              </span>
            </div>
            <div className="pt-3">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-[#6B7280]">Progress</span>
                <span className="font-medium text-[#C74634]">
                  {stats?.progress ?? 0}%
                </span>
              </div>
              <div className="h-3 bg-[#F7F8FA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C74634] rounded-full transition-all"
                  style={{ width: `${stats?.progress ?? 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Burndown Chart — reuses the context-aware component */}
      <BurndownChart />

      {/* Sprint Comparison */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">
          Sprint Comparison
        </h3>
        {loading ? (
          <div className="text-center text-[#6B7280] text-sm py-6">
            Loading...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allStats.map(({ sprint, total, done, progress, velocity }) => (
              <div
                key={sprint.sprintId}
                className={`p-4 rounded-lg border transition-all ${
                  sprint.sprintId === selectedSprintId
                    ? "border-[#C74634] bg-[#C74634]/5"
                    : "border-[#E5E7EB] bg-[#F7F8FA]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-[#1A1A1A]">
                    {sprint.sprintName}
                  </h4>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      color: statusColor(sprint.status),
                      backgroundColor: `${statusColor(sprint.status)}15`,
                    }}
                  >
                    {statusLabel(sprint.status)}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Progress</span>
                    <span className="font-medium text-[#1A1A1A]">
                      {progress}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Tasks</span>
                    <span className="font-medium text-[#1A1A1A]">
                      {done} / {total}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Velocity</span>
                    <span className="font-medium text-[#1A1A1A]">
                      {velocity}h
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">
                      {sprint.status?.toLowerCase() === "active"
                        ? "Days Left"
                        : "End Date"}
                    </span>
                    <span className="font-medium text-[#1A1A1A]">
                      {sprint.status?.toLowerCase() === "active"
                        ? daysRemaining(sprint.endDate)
                        : formatDate(sprint.endDate)}
                    </span>
                  </div>
                </div>
                {/* Mini progress bar */}
                <div className="mt-3 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: statusColor(sprint.status),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

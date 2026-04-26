import { useEffect, useState } from "react";
import { Users, TrendingUp, Target, CheckCircle2, X } from "lucide-react";
import { useSprint } from "../context/SprintContext.tsx";

interface UserRaw {
  userId: number;
  username: string;
  email: string;
  userRole: string;
}

interface TaskRaw {
  status: string;
  hours: number;
  totalTime: number;
  sprint: { sprintId: number } | null;
  assignee: { userId: number } | null;
}

interface Developer {
  userId: number;
  name: string;
  role: string;
  email: string;
  workload: number;
  tasksCompleted: number;
  tasksInProgress: number;
  tasksPending: number;
  estimationAccuracy: number;
  productivityScore: number;
}

const isDone = (s: string) =>
  ["done", "completed", "finished"].includes(s?.toLowerCase() ?? "");

const isInProgress = (s: string) =>
  ["in-progress", "inprogress", "in progress"].includes(s?.toLowerCase() ?? "");

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function workloadColor(pct: number): string {
  if (pct >= 85) return "#DC2626";
  if (pct >= 70) return "#F59E0B";
  return "#16A34A";
}

function buildDevelopers(
  users: UserRaw[],
  tasks: TaskRaw[],
  selectedSprintId: number | null
): Developer[] {
  const sprintTasks = selectedSprintId
    ? tasks.filter((t) => t.sprint?.sprintId === selectedSprintId)
    : tasks;

  // Hours per user (for relative workload)
  const hoursMap: Record<number, number> = {};
  users.forEach((u) => (hoursMap[u.userId] = 0));
  sprintTasks.forEach((t) => {
    if (t.assignee) hoursMap[t.assignee.userId] =
      (hoursMap[t.assignee.userId] ?? 0) + (t.hours || 0);
  });
  const maxHours = Math.max(...Object.values(hoursMap), 1);

  return users.map((u) => {
    const myTasks = sprintTasks.filter(
      (t) => t.assignee?.userId === u.userId
    );
    const done = myTasks.filter((t) => isDone(t.status));
    const inProg = myTasks.filter((t) => isInProgress(t.status));
    const pending = myTasks.filter(
      (t) => !isDone(t.status) && !isInProgress(t.status)
    );

    // Estimation accuracy
    const withBoth = done.filter((t) => (t.hours || 0) > 0 && (t.totalTime || 0) > 0);
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

    // Productivity: done / total assigned
    const productivity =
      myTasks.length > 0
        ? Math.round((done.length / myTasks.length) * 100)
        : 0;

    const workload = Math.round(((hoursMap[u.userId] ?? 0) / maxHours) * 100);

    return {
      userId: u.userId,
      name: u.username,
      role: u.userRole || "Team Member",
      email: u.email,
      workload,
      tasksCompleted: done.length,
      tasksInProgress: inProg.length,
      tasksPending: pending.length,
      estimationAccuracy: accuracy,
      productivityScore: productivity,
    };
  });
}

export default function Team() {
  const { selectedSprintId } = useSprint();
  const [users, setUsers] = useState<UserRaw[]>([]);
  const [tasks, setTasks] = useState<TaskRaw[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Developer | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/users").then((r) => r.json()),
      fetch("/api/tasks").then((r) => r.json()),
    ])
      .then(([u, t]) => {
        setUsers(u);
        setTasks(t);
      })
      .finally(() => setLoading(false));
  }, []);

  const developers = buildDevelopers(users, tasks, selectedSprintId);

  // Overview stats
  const totalCompleted = developers.reduce((s, d) => s + d.tasksCompleted, 0);
  const avgAccuracy =
    developers.length > 0
      ? Math.round(
          developers.reduce((s, d) => s + d.estimationAccuracy, 0) /
            developers.length
        )
      : 0;
  const avgProductivity =
    developers.length > 0
      ? Math.round(
          developers.reduce((s, d) => s + d.productivityScore, 0) /
            developers.length
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-[#1A1A1A] mb-2">Team</h1>
        <p className="text-[#6B7280]">Monitor team members and performance</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
          <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center mb-3">
            <Users className="w-6 h-6 text-[#2563EB]" />
          </div>
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-1">
            {loading ? "—" : developers.length}
          </h3>
          <p className="text-sm text-[#6B7280]">Team Members</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
          <div className="w-12 h-12 bg-[#16A34A]/10 rounded-lg flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6 text-[#16A34A]" />
          </div>
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-1">
            {loading ? "—" : totalCompleted}
          </h3>
          <p className="text-sm text-[#6B7280]">Total Tasks Completed</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
          <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center mb-3">
            <Target className="w-6 h-6 text-[#F59E0B]" />
          </div>
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-1">
            {loading ? "—" : `${avgAccuracy}%`}
          </h3>
          <p className="text-sm text-[#6B7280]">Avg Estimation Accuracy</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
          <div className="w-12 h-12 bg-[#C74634]/10 rounded-lg flex items-center justify-center mb-3">
            <TrendingUp className="w-6 h-6 text-[#C74634]" />
          </div>
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-1">
            {loading ? "—" : `${avgProductivity}%`}
          </h3>
          <p className="text-sm text-[#6B7280]">Avg Productivity Score</p>
        </div>
      </div>

      {/* Developer Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 border border-[#E5E7EB] animate-pulse h-64"
            />
          ))}
        </div>
      ) : developers.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-[#E5E7EB] text-center text-[#6B7280]">
          No team members found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developers.map((dev) => (
            <div
              key={dev.userId}
              onClick={() => setSelected(dev)}
              className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm hover:shadow-lg transition-all cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-[#C74634] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-semibold text-white">
                    {initials(dev.name)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#1A1A1A] mb-1">
                    {dev.name}
                  </h3>
                  <p className="text-sm text-[#6B7280] mb-1">{dev.role}</p>
                  <p className="text-xs text-[#6B7280] truncate">{dev.email}</p>
                </div>
              </div>

              {/* Workload bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[#6B7280]">Current Workload</span>
                  <span
                    className="font-medium"
                    style={{ color: workloadColor(dev.workload) }}
                  >
                    {dev.workload}%
                  </span>
                </div>
                <div className="h-2 bg-[#F7F8FA] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${dev.workload}%`,
                      backgroundColor: workloadColor(dev.workload),
                    }}
                  />
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E5E7EB]">
                <div>
                  <p className="text-2xl font-semibold text-[#1A1A1A]">
                    {dev.tasksCompleted}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-1">Tasks Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#1A1A1A]">
                    {dev.tasksInProgress}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-1">In Progress</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#1A1A1A]">
                    {dev.estimationAccuracy > 0
                      ? `${dev.estimationAccuracy}%`
                      : "N/A"}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-1">Est. Accuracy</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#1A1A1A]">
                    {dev.tasksCompleted + dev.tasksInProgress > 0
                      ? `${dev.productivityScore}%`
                      : "N/A"}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-1">Productivity</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSelected(null)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-xl shadow-2xl z-50 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-[#1A1A1A]">
                Developer Details
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-[#F7F8FA] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Identity */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-[#C74634] rounded-full flex items-center justify-center">
                  <span className="text-2xl font-semibold text-white">
                    {initials(selected.name)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1A1A1A]">
                    {selected.name}
                  </h3>
                  <p className="text-[#6B7280]">{selected.role}</p>
                  <p className="text-sm text-[#6B7280]">{selected.email}</p>
                </div>
              </div>

              {/* Workload bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#6B7280]">Workload</span>
                  <span
                    className="font-medium"
                    style={{ color: workloadColor(selected.workload) }}
                  >
                    {selected.workload}%
                  </span>
                </div>
                <div className="h-3 bg-[#F7F8FA] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${selected.workload}%`,
                      backgroundColor: workloadColor(selected.workload),
                    }}
                  />
                </div>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#F7F8FA] rounded-lg">
                  <p className="text-sm text-[#6B7280] mb-1">Tasks Completed</p>
                  <p className="text-2xl font-semibold text-[#1A1A1A]">
                    {selected.tasksCompleted}
                  </p>
                </div>
                <div className="p-4 bg-[#F7F8FA] rounded-lg">
                  <p className="text-sm text-[#6B7280] mb-1">In Progress</p>
                  <p className="text-2xl font-semibold text-[#1A1A1A]">
                    {selected.tasksInProgress}
                  </p>
                </div>
                <div className="p-4 bg-[#F7F8FA] rounded-lg">
                  <p className="text-sm text-[#6B7280] mb-1">Pending</p>
                  <p className="text-2xl font-semibold text-[#1A1A1A]">
                    {selected.tasksPending}
                  </p>
                </div>
                <div className="p-4 bg-[#F7F8FA] rounded-lg">
                  <p className="text-sm text-[#6B7280] mb-1">
                    Estimation Accuracy
                  </p>
                  <p className="text-2xl font-semibold text-[#1A1A1A]">
                    {selected.estimationAccuracy > 0
                      ? `${selected.estimationAccuracy}%`
                      : "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-[#F7F8FA] rounded-lg col-span-2">
                  <p className="text-sm text-[#6B7280] mb-1">
                    Productivity Score
                  </p>
                  <p className="text-2xl font-semibold text-[#1A1A1A]">
                    {selected.tasksCompleted + selected.tasksInProgress > 0
                      ? `${selected.productivityScore}%`
                      : "N/A"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="w-full px-4 py-2 bg-[#C74634] text-white rounded-lg hover:bg-[#9E2A1F] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

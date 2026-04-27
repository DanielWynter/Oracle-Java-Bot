import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSprint } from "../context/SprintContext.tsx";
import type { Sprint } from "../context/SprintContext.tsx";

interface TaskRaw {
  taskId: number;
  status: string;
  hours: number;
  sprint: { sprintId: number } | null;
}

interface TaskLogRaw {
  logTimestamp: string;
  task?: { taskId: number };
}

interface ChartPoint {
  day: string;
  ideal: number;
  actual: number;
}

const isDone = (status: string) =>
  ["done", "completed", "finished"].includes(status?.toLowerCase() ?? "");

function parseDate(str: string): Date {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function buildBurndown(
  sprint: Sprint,
  tasks: TaskRaw[],
  logs: TaskLogRaw[]
): ChartPoint[] {
  const start = parseDate(sprint.startDate);
  const end = parseDate(sprint.endDate);
  const today = new Date();

  const sprintTasks = tasks.filter(
    (t) => t.sprint?.sprintId === sprint.sprintId
  );
  if (sprintTasks.length === 0) return [];

  const totalHours = sprintTasks.reduce((s, t) => s + (t.hours || 0), 0);
  const useCount = totalHours === 0;
  const total = useCount ? sprintTasks.length : totalHours;

  const doneTasks = sprintTasks.filter((t) => isDone(t.status));
  const doneValue = useCount
    ? doneTasks.length
    : doneTasks.reduce((s, t) => s + (t.hours || 0), 0);
  const remaining = total - doneValue;

  // Build log map: taskId → latest log timestamp
  const lastLogMap: Record<number, Date> = {};
  logs.forEach((log) => {
    if (!log.task?.taskId || !log.logTimestamp) return;
    const ts = new Date(log.logTimestamp);
    const existing = lastLogMap[log.task.taskId];
    if (!existing || ts > existing) lastLogMap[log.task.taskId] = ts;
  });
  const hasLogs = Object.keys(lastLogMap).length > 0;

  const totalDays = Math.round(
    (end.getTime() - start.getTime()) / 86_400_000
  );
  const chartEnd = end < today ? end : today;

  const points: ChartPoint[] = [];
  const cursor = new Date(start);
  let dayIndex = 0;

  while (cursor <= chartEnd) {
    const dayEnd = new Date(cursor);
    dayEnd.setHours(23, 59, 59, 999);

    const idealRatio = Math.max(0, 1 - dayIndex / totalDays);
    const ideal = Math.round(total * idealRatio * 10) / 10;

    let actual: number;
    if (hasLogs) {
      const burned = sprintTasks
        .filter((t) => {
          if (!isDone(t.status)) return false;
          const completion = lastLogMap[t.taskId];
          return completion && completion <= dayEnd;
        })
        .reduce((s, t) => s + (useCount ? 1 : t.hours || 0), 0);
      actual = Math.round(Math.max(0, total - burned) * 10) / 10;
    } else {
      // No logs: interpolate linearly from total → remaining
      const elapsed = dayEnd.getTime() - start.getTime();
      const duration = chartEnd.getTime() - start.getTime();
      const progress = duration > 0 ? elapsed / duration : 1;
      actual =
        Math.round(
          Math.max(0, total - (total - remaining) * progress) * 10
        ) / 10;
    }

    points.push({ day: `Day ${dayIndex + 1}`, ideal, actual });
    cursor.setDate(cursor.getDate() + 1);
    dayIndex++;
  }

  return points;
}

export default function BurndownChart() {
  const { sprints, selectedSprintId } = useSprint();
  const [tasks, setTasks] = useState<TaskRaw[]>([]);
  const [logs, setLogs] = useState<TaskLogRaw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/tasks").then((r) => r.json()),
      fetch("/api/task-logs").then((r) => r.json()),
    ])
      .then(([t, l]) => {
        setTasks(t);
        setLogs(l);
      })
      .finally(() => setLoading(false));
  }, []);

  // Determine which sprint to show
  const sprintsWithTasks = new Set(
    tasks.map((t) => t.sprint?.sprintId).filter((id): id is number => id != null)
  );

  const chosen: Sprint | undefined =
    // Usamos el ternario para evitar que el && nos regrese un 0 numérico
    (selectedSprintId ? sprints.find((s) => s.sprintId === selectedSprintId) : undefined) ??
    // Otherwise fall back to most recent sprint with tasks
    sprints.find((s) => sprintsWithTasks.has(s.sprintId));

  const data = chosen ? buildBurndown(chosen, tasks, logs) : [];
  const unit =
    chosen && tasks.filter((t) => t.sprint?.sprintId === chosen.sprintId)
      .reduce((s, t) => s + (t.hours || 0), 0) === 0
      ? "tasks"
      : "h";

  return (
    <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
          Sprint Burndown Chart
        </h3>
        <p className="text-sm text-[#6B7280]">
          {chosen
            ? `${chosen.sprintName} — remaining ${unit === "h" ? "hours" : "tasks"} vs ideal`
            : "Track remaining work vs ideal progress"}
        </p>
      </div>

      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-[#6B7280] text-sm">
          Loading...
        </div>
      ) : data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-[#6B7280] text-sm">
          No tasks found for this sprint
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="day"
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
              unit={unit === "h" ? "h" : ""}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                padding: "8px 12px",
              }}
              formatter={(value: number) => [
                `${value}${unit === "h" ? "h" : " tasks"}`,
                undefined,
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="ideal"
              stroke="#6B7280"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Ideal"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#C74634"
              strokeWidth={2}
              name="Actual"
              dot={{ fill: "#C74634", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

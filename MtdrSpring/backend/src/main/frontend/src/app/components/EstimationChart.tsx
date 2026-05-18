import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSprint } from "../context/SprintContext.tsx";

interface TaskRaw {
  taskId: number;
  taskName: string;
  hours: number;
  totalTime: number;
  sprint: { sprintId: number; sprintName: string } | null;
}

interface ChartEntry {
  task: string;
  fullName: string;
  estimated: number;
  actual: number;
}

const MAX_TASKS = 12;
const COLOR_ESTIMATED = "#F59E0B";
const COLOR_OK = "#16A34A";
const COLOR_OVER = "#DC2626";

function truncate(name: string, max = 14): string {
  return name.length > max ? name.slice(0, max) + "…" : name;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: ChartEntry }[];
}) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0].payload;
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        padding: "8px 12px",
      }}
    >
      <p className="text-xs font-semibold text-[#1A1A1A] mb-1">
        {entry.fullName}
      </p>
      {payload.map((p) => {
        const color =
          p.name === "Actual"
            ? entry.actual <= entry.estimated
              ? COLOR_OK
              : COLOR_OVER
            : COLOR_ESTIMATED;
        return (
          <p key={p.name} className="text-xs" style={{ color }}>
            {p.name}: {p.value}h
          </p>
        );
      })}
    </div>
  );
};

const Legend = () => (
  <div className="flex flex-wrap gap-4 justify-center text-xs text-[#6B7280] mb-2">
    <span className="flex items-center gap-1.5">
      <span
        className="inline-block w-3 h-3 rounded-sm"
        style={{ backgroundColor: COLOR_ESTIMATED }}
      />
      Estimated
    </span>
    <span className="flex items-center gap-1.5">
      <span
        className="inline-block w-3 h-3 rounded-sm"
        style={{ backgroundColor: COLOR_OK }}
      />
      Actual (within estimate)
    </span>
    <span className="flex items-center gap-1.5">
      <span
        className="inline-block w-3 h-3 rounded-sm"
        style={{ backgroundColor: COLOR_OVER }}
      />
      Actual (over estimate)
    </span>
  </div>
);

export default function EstimationChart() {
  const { selectedSprintId } = useSprint();
  const [allTasks, setAllTasks] = useState<TaskRaw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then(setAllTasks)
      .finally(() => setLoading(false));
  }, []);

  const sprintTasks = selectedSprintId
    ? allTasks.filter((t) => t.sprint?.sprintId === selectedSprintId)
    : allTasks;

  const data: ChartEntry[] = sprintTasks
    .filter((t) => (t.hours || 0) > 0 || (t.totalTime || 0) > 0)
    .slice(0, MAX_TASKS)
    .map((t) => ({
      task: truncate(t.taskName ?? `Task ${t.taskId}`),
      fullName: t.taskName ?? `Task ${t.taskId}`,
      estimated: t.hours || 0,
      actual: t.totalTime || 0,
    }));

  return (
    <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
          Estimation vs Actual Time
        </h3>
        <p className="text-sm text-[#6B7280]">
          Comparing estimated vs actual hours per task
        </p>
      </div>

      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-[#6B7280] text-sm">
          Loading...
        </div>
      ) : data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-[#6B7280] text-sm">
          No tasks with time data for this sprint
        </div>
      ) : (
        <>
          <Legend />
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, bottom: 55, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="task"
                stroke="#6B7280"
                style={{ fontSize: "11px" }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                stroke="#6B7280"
                style={{ fontSize: "12px" }}
                unit="h"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="estimated"
                fill={COLOR_ESTIMATED}
                name="Estimated"
                radius={[4, 4, 0, 0]}
              />
              <Bar dataKey="actual" name="Actual" radius={[4, 4, 0, 0]}>
                {data.map((entry, i) => (
                  <Cell
                    key={`actual-${i}`}
                    fill={
                      entry.actual <= entry.estimated ? COLOR_OK : COLOR_OVER
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}

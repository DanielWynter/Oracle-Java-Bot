import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSprint } from "../context/SprintContext.tsx";

interface TaskRaw {
  status: string;
  hours: number;
  sprint: { sprintId: number } | null;
}

interface SprintRaw {
  sprintId: number;
  sprintName: string;
}

interface ChartEntry {
  sprint: string;
  sprintId: number;
  velocity: number;
}

const isDone = (status: string) =>
  ["done", "completed", "finished"].includes(status?.toLowerCase() ?? "");

const COLOR_DEFAULT = "#2563EB";
const COLOR_SELECTED = "#C74634";

export default function VelocityChart() {
  const { sprints: contextSprints, selectedSprintId } = useSprint();
  const [tasks, setTasks] = useState<TaskRaw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then(setTasks)
      .finally(() => setLoading(false));
  }, []);

  // Use sprints from context (already fetched); sort ascending for trend view
  const sprints: SprintRaw[] = [...contextSprints].sort(
    (a, b) => a.sprintId - b.sprintId
  );

  const data: ChartEntry[] = sprints.map((s) => {
    const sprintDone = tasks.filter(
      (t) => t.sprint?.sprintId === s.sprintId && isDone(t.status)
    );
    const velocity = Math.round(
      sprintDone.reduce((sum, t) => sum + (t.hours || 0), 0) * 10
    ) / 10;
    return { sprint: s.sprintName, sprintId: s.sprintId, velocity };
  });

  return (
    <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
          Team Velocity Trend
        </h3>
        <p className="text-sm text-[#6B7280]">
          Estimated hours completed per sprint
        </p>
      </div>

      {loading || contextSprints.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-[#6B7280] text-sm">
          Loading...
        </div>
      ) : data.every((d) => d.velocity === 0) ? (
        <div className="h-[300px] flex items-center justify-center text-[#6B7280] text-sm">
          No completed tasks found
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="sprint"
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
              unit="h"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                padding: "8px 12px",
              }}
              formatter={(value: number) => [`${value}h`, "Velocity"]}
            />
            <Legend />
            <Bar dataKey="velocity" name="Velocity" radius={[8, 8, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.sprintId}
                  fill={
                    entry.sprintId === selectedSprintId
                      ? COLOR_SELECTED
                      : COLOR_DEFAULT
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

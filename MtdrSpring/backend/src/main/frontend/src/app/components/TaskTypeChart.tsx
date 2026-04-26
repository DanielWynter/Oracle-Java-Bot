import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useSprint } from "../context/SprintContext.tsx";

const TYPE_COLORS: Record<string, string> = {
  Feature: "#C74634",
  Bug: "#7C3AED",
  Issue: "#F59E0B",
  Enhancement: "#2563EB",
};

const FALLBACK_COLORS = ["#C74634", "#7C3AED", "#F59E0B", "#2563EB", "#16A34A"];

interface TaskRaw {
  taskType?: string;
  sprint?: { sprintId: number } | null;
}

interface ChartEntry {
  name: string;
  value: number;
}

export default function TaskTypeChart() {
  const { selectedSprintId } = useSprint();
  const [allTasks, setAllTasks] = useState<TaskRaw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then(setAllTasks)
      .finally(() => setLoading(false));
  }, []);

  const tasks = selectedSprintId
    ? allTasks.filter((t) => t.sprint?.sprintId === selectedSprintId)
    : allTasks;

  const data: ChartEntry[] = Object.entries(
    tasks.reduce<Record<string, number>>((counts, t) => {
      const type = t.taskType || "Unknown";
      counts[type] = (counts[type] || 0) + 1;
      return counts;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
          Tasks by Type
        </h3>
        <p className="text-sm text-[#6B7280]">
          Distribution of task categories
        </p>
      </div>

      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-[#6B7280] text-sm">
          Loading...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={100}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={TYPE_COLORS[entry.name] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                padding: "8px 12px",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

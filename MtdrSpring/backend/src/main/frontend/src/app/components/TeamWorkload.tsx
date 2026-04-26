import { useEffect, useState } from "react";
import { useSprint } from "../context/SprintContext.tsx";

interface TaskRaw {
  hours: number;
  sprint: { sprintId: number } | null;
  assignee: { userId: number; username: string } | null;
}

interface Developer {
  name: string;
  tasks: number;
  load: number;
  color: string;
}

function loadColor(load: number): string {
  if (load >= 85) return "#DC2626";
  if (load >= 70) return "#F59E0B";
  return "#16A34A";
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TeamWorkload() {
  const { selectedSprintId } = useSprint();
  const [allTasks, setAllTasks] = useState<TaskRaw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then(setAllTasks)
      .finally(() => setLoading(false));
  }, []);

  const tasks = selectedSprintId
    ? allTasks.filter((t) => t.sprint?.sprintId === selectedSprintId)
    : allTasks;

  // Aggregate by assignee
  const byUser: Record<number, { name: string; tasks: number; hours: number }> =
    {};
  tasks.forEach((t) => {
    if (!t.assignee) return;
    const { userId, username } = t.assignee;
    if (!byUser[userId])
      byUser[userId] = { name: username, tasks: 0, hours: 0 };
    byUser[userId].tasks++;
    byUser[userId].hours += t.hours || 0;
  });

  const userList = Object.values(byUser);
  const totalHours = userList.reduce((s, u) => s + u.hours, 0);
  const useCount = totalHours === 0;
  const maxVal = Math.max(...userList.map((u) => (useCount ? u.tasks : u.hours)), 1);

  const developers: Developer[] = userList
    .map((u) => {
      const val = useCount ? u.tasks : u.hours;
      const load = Math.round((val / maxVal) * 100);
      return { name: u.name, tasks: u.tasks, load, color: loadColor(load) };
    })
    .sort((a, b) => b.load - a.load);

  return (
    <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
          Team Workload
        </h3>
        <p className="text-sm text-[#6B7280]">
          Current capacity utilization and hours worked per developer
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8 text-[#6B7280] text-sm">
          Loading...
        </div>
      ) : developers.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-[#6B7280] text-sm">
          No assigned tasks for this sprint
        </div>
      ) : (
        <div className="space-y-4">
          {developers.map((dev) => (
            <div key={dev.name}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#C74634]/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-[#C74634]">
                      {initials(dev.name)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      {dev.name}
                    </p>
                    <p className="text-xs text-[#6B7280]">
                      {dev.tasks} {dev.tasks === 1 ? "task" : "tasks"}
                    </p>
                  </div>
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: dev.color }}
                >
                  {dev.load}%
                </span>
              </div>
              <div className="h-2 bg-[#F7F8FA] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${dev.load}%`,
                    backgroundColor: dev.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

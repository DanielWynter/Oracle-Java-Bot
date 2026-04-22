import { Task, TaskStatus, TaskType } from "../pages/Tasks";
import { AlertCircle } from "lucide-react";

interface TaskTableProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

const statusConfig: Record<
  TaskStatus,
  { label: string; color: string; bg: string }
> = {
  todo: { label: "To Do", color: "#6B7280", bg: "#6B7280" },
  "in-progress": { label: "In Progress", color: "#2563EB", bg: "#2563EB" },
  done: { label: "Done", color: "#16A34A", bg: "#16A34A" },
  blocked: { label: "Blocked", color: "#DC2626", bg: "#DC2626" },
};

const typeConfig: Record<TaskType, { label: string; color: string }> = {
  feature: { label: "Feature", color: "#C74634" },
  bug: { label: "Bug", color: "#DC2626" },
  issue: { label: "Issue", color: "#F59E0B" },
  enhancement: { label: "Enhancement", color: "#2563EB" },
};

export default function TaskTable({ tasks, onSelectTask }: TaskTableProps) {
  const getDeviation = (estimated: number, actual: number) => {
    if (actual === 0) return null;
    const deviation = ((actual - estimated) / estimated) * 100;
    return deviation;
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F7F8FA] border-b border-[#E5E7EB]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Task ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Assignee
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Estimation
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Actual
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Deviation
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {tasks.map((task) => {
              const deviation = getDeviation(task.estimation, task.actualTime);
              return (
                <tr
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="hover:bg-[#F7F8FA] transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-[#1A1A1A]">
                      {task.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm font-medium text-[#1A1A1A] truncate">
                        {task.title}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${statusConfig[task.status].bg}15`,
                        color: statusConfig[task.status].color,
                      }}
                    >
                      {statusConfig[task.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${typeConfig[task.type].color}15`,
                        color: typeConfig[task.type].color,
                      }}
                    >
                      {typeConfig[task.type].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-[#1A1A1A]">
                      {task.assignee}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-[#1A1A1A]">
                      {task.estimation}h
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-[#1A1A1A]">
                      {task.actualTime > 0 ? `${task.actualTime}h` : "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {deviation !== null ? (
                      <div className="flex items-center gap-1">
                        {Math.abs(deviation) > 20 && (
                          <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            deviation > 0 ? "text-[#DC2626]" : "text-[#16A34A]"
                          }`}
                        >
                          {deviation > 0 ? "+" : ""}
                          {deviation.toFixed(0)}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-[#6B7280]">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { CheckCircle2, UserPlus, Play, GitBranch, FileText, LucideIcon } from "lucide-react";

interface TaskLog {
  logId: number;
  logTimestamp: string;
  logContent: string;
  task?: {
    taskName?: string;
    status?: string;
    assignee?: { firstName?: string; lastName?: string };
  };
}

type ActivityType = "completed" | "assigned" | "started" | "branch" | "default";

const ACTIVITY_CONFIG: Record<ActivityType, { icon: LucideIcon; color: string }> = {
  completed: { icon: CheckCircle2, color: "#16A34A" },
  assigned:  { icon: UserPlus,     color: "#2563EB" },
  started:   { icon: Play,         color: "#F59E0B" },
  branch:    { icon: GitBranch,    color: "#6B7280" },
  default:   { icon: FileText,     color: "#6B7280" },
};

function inferType(content: string): ActivityType {
  const lower = content.toLowerCase();
  if (lower.includes("complet")) return "completed";
  if (lower.includes("assign"))  return "assigned";
  if (lower.includes("start") || lower.includes("began")) return "started";
  if (lower.includes("branch") || lower.includes("creat")) return "branch";
  return "default";
}

function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1)  return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)   return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function ActivityFeed() {
  const [logs, setLogs] = useState<TaskLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/task-logs")
      .then((res) => res.json())
      .then((data: TaskLog[]) => {
        const sorted = data
          .filter((l) => l.logTimestamp)
          .sort((a, b) => new Date(b.logTimestamp).getTime() - new Date(a.logTimestamp).getTime())
          .slice(0, 10);
        setLogs(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">Recent Activity</h3>
        <p className="text-sm text-[#6B7280]">Latest team updates</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8 text-[#6B7280] text-sm">
          Loading...
        </div>
      ) : logs.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-[#6B7280] text-sm">
          No recent activity
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => {
            const type = inferType(log.logContent ?? "");
            const { icon: Icon, color } = ACTIVITY_CONFIG[type];
            const taskName = log.task?.taskName;

            return (
              <div key={log.logId} className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1A1A1A]">
                    {log.logContent}
                    {taskName && (
                      <>
                        {" "}
                        <span className="font-medium">{taskName}</span>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-1">
                    {formatRelativeTime(log.logTimestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { X, Clock, Calendar, Trash2 } from "lucide-react";
import { Task, TaskStatus, TaskType } from "../pages/Tasks.tsx";
import { useSprint } from "../context/SprintContext.tsx";

interface UserOption {
  userId: number;
  username: string;
}

function localISOString(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
}

interface TaskDetailsPanelProps {
  task: Task;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    + " · "
    + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function TaskDetailsPanel({
  task,
  onClose,
  onUpdate,
  onDelete,
}: TaskDetailsPanelProps) {
  const { sprints } = useSprint();
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then(setUsers)
      .catch(() => {});
  }, []);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    setError("");
    try {
      const taskId = parseInt(editedTask.id.replace("TASK-", ""));
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Server error");
      onDelete(editedTask.id);
      onClose();
    } catch {
      setError("Failed to delete task. Please try again.");
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const taskId = parseInt(editedTask.id.replace("TASK-", ""));
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskName: editedTask.title,
          description: editedTask.description,
          status: editedTask.status,
          taskType: editedTask.type,
          hours: editedTask.estimation,
          totalTime: editedTask.actualTime,
          priority: editedTask.priority,
          finishedAt: editedTask.status === "done" ? localISOString() : null,
          assignee: editedTask.assigneeId ? { userId: editedTask.assigneeId } : null,
          sprint: editedTask.sprintId ? { sprintId: editedTask.sprintId } : null,
        }),
      });
      if (!res.ok) throw new Error("Server error");
      const saved = await res.json();
      onUpdate({ ...editedTask, finishedAt: saved.finishedAt ?? null });
      onClose();
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
                {task.id}
              </h2>
              <p className="text-sm text-[#6B7280]">Task Details</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F7F8FA] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#6B7280]" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Title
              </label>
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, title: e.target.value })
                }
                className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Description
              </label>
              <textarea
                value={editedTask.description}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, description: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent resize-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Status
              </label>
              <select
                value={editedTask.status}
                onChange={(e) =>
                  setEditedTask({
                    ...editedTask,
                    status: e.target.value as TaskStatus,
                  })
                }
                className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Type
              </label>
              <select
                value={editedTask.type}
                onChange={(e) =>
                  setEditedTask({
                    ...editedTask,
                    type: e.target.value as TaskType,
                  })
                }
                className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
              >
                <option value="feature">Feature</option>
                <option value="bug">Bug</option>
                <option value="issue">Issue</option>
                <option value="enhancement">Enhancement</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Priority
              </label>
              <select
                value={editedTask.priority}
                onChange={(e) =>
                  setEditedTask({
                    ...editedTask,
                    priority: e.target.value as "low" | "medium" | "high",
                  })
                }
                className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
              >
                <option value="high">↑ High</option>
                <option value="medium">→ Medium</option>
                <option value="low">↓ Low</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Assignee
              </label>
              <select
                value={editedTask.assigneeId ?? ""}
                onChange={(e) => {
                  const selected = users.find((u) => u.userId === Number(e.target.value));
                  setEditedTask({
                    ...editedTask,
                    assigneeId: selected?.userId ?? null,
                    assignee: selected?.username ?? "Unassigned",
                  });
                }}
                className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.userId} value={u.userId}>{u.username}</option>
                ))}
              </select>
            </div>

            {/* Estimation & Actual Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Estimation (hours)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                  <input
                    type="number"
                    value={editedTask.estimation}
                    onChange={(e) =>
                      setEditedTask({
                        ...editedTask,
                        estimation: Number(e.target.value),
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Actual Time (hours)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                  <input
                    type="number"
                    value={editedTask.actualTime}
                    onChange={(e) =>
                      setEditedTask({
                        ...editedTask,
                        actualTime: Number(e.target.value),
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Sprint */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Sprint
              </label>
              <div className="flex items-center gap-3 px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus-within:ring-2 focus-within:ring-[#C74634] focus-within:border-transparent">
                <Calendar className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
                <select
                  value={editedTask.sprintId ?? ""}
                  onChange={(e) => {
                    const selected = sprints.find((s) => s.sprintId === Number(e.target.value));
                    setEditedTask({
                      ...editedTask,
                      sprintId: selected?.sprintId ?? null,
                      sprint: selected?.sprintName ?? "No Sprint",
                    });
                  }}
                  className="flex-1 bg-transparent outline-none text-sm text-[#1A1A1A]"
                >
                  <option value="">No Sprint</option>
                  {sprints.map((s) => (
                    <option key={s.sprintId} value={s.sprintId}>{s.sprintName}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Created At
                </label>
                <div className="flex items-center gap-3 px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg">
                  <Clock className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
                  <span className="text-sm text-[#1A1A1A]">
                    {formatDateTime(editedTask.createdAt)}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Finished At
                </label>
                <div className="flex items-center gap-3 px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg">
                  <Clock className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
                  <span className={`text-sm ${editedTask.finishedAt ? "text-[#1A1A1A]" : "text-[#9CA3AF]"}`}>
                    {formatDateTime(editedTask.finishedAt)}
                  </span>
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-[#DC2626]">{error}</p>}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
              <button
                onClick={handleSave}
                disabled={saving || deleting}
                className="flex-1 px-4 py-2 bg-[#C74634] text-white rounded-lg hover:bg-[#9E2A1F] transition-colors disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleDelete}
                disabled={saving || deleting}
                className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2 ${
                  confirmDelete
                    ? "bg-[#DC2626] text-white hover:bg-[#B91C1C]"
                    : "bg-[#F7F8FA] text-[#DC2626] hover:bg-[#FEE2E2]"
                }`}
              >
                <Trash2 className="w-4 h-4" />
                {deleting ? "Deleting..." : confirmDelete ? "Confirm Delete" : "Delete"}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#F7F8FA] text-[#1A1A1A] rounded-lg hover:bg-[#E5E7EB] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

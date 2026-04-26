import { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";
import { useSprint } from "../context/SprintContext.tsx";
import type { Task, TaskStatus, TaskType } from "../pages/Tasks.tsx";

interface UserOption {
  userId: number;
  username: string;
}

interface TaskCreatePanelProps {
  onClose: () => void;
  onCreate: (task: Task) => void;
}

export default function TaskCreatePanel({ onClose, onCreate }: TaskCreatePanelProps) {
  const { sprints } = useSprint();
  const [users, setUsers] = useState<UserOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo" as TaskStatus,
    type: "feature" as TaskType,
    priority: "medium" as "low" | "medium" | "high",
    assigneeId: "",
    sprintId: "",
    estimation: 0,
  });

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then(setUsers)
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const body: Record<string, unknown> = {
        taskName: form.title,
        description: form.description,
        status: form.status,
        taskType: form.type,
        priority: form.priority,
        hours: form.estimation,
        createdAt: new Date().toISOString().slice(0, 19),
      };
      if (form.sprintId) body.sprint = { sprintId: Number(form.sprintId) };
      if (form.assigneeId) body.assignee = { userId: Number(form.assigneeId) };

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Server error");
      const created = await res.json();

      const selectedSprint = sprints.find((s) => s.sprintId === Number(form.sprintId));
      const selectedUser = users.find((u) => u.userId === Number(form.assigneeId));

      const newTask: Task = {
        id: `TASK-${created.taskId}`,
        title: created.taskName,
        description: created.description || "",
        status: form.status,
        type: form.type,
        priority: form.priority,
        assignee: selectedUser?.username || "Unassigned",
        sprint: selectedSprint?.sprintName || "No Sprint",
        sprintId: selectedSprint?.sprintId ?? null,
        estimation: form.estimation,
        actualTime: 0,
        createdAt: created.createdAt || new Date().toISOString(),
        finishedAt: null,
      };
      onCreate(newTask);
    } catch {
      setError("Failed to create task. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">New Task</h2>
              <p className="text-sm text-[#6B7280]">Fill in the details to create a new task</p>
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
                Title <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter task title"
                className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                placeholder="Describe the task..."
                className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent resize-none"
              />
            </div>

            {/* Status & Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}
                  className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as TaskType })}
                  className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
                >
                  <option value="feature">Feature</option>
                  <option value="bug">Bug</option>
                  <option value="issue">Issue</option>
                  <option value="enhancement">Enhancement</option>
                </select>
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Priority</label>
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({ ...form, priority: e.target.value as "low" | "medium" | "high" })
                }
                className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
              >
                <option value="high">↑ High</option>
                <option value="medium">→ Medium</option>
                <option value="low">↓ Low</option>
              </select>
            </div>

            {/* Assignee & Sprint */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Assignee</label>
                <select
                  value={form.assigneeId}
                  onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
                  className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.userId} value={u.userId}>
                      {u.username}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Sprint</label>
                <select
                  value={form.sprintId}
                  onChange={(e) => setForm({ ...form, sprintId: e.target.value })}
                  className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
                >
                  <option value="">No Sprint</option>
                  {sprints.map((s) => (
                    <option key={s.sprintId} value={s.sprintId}>
                      {s.sprintName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Estimation */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Estimation (hours)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="number"
                  min={0}
                  value={form.estimation}
                  onChange={(e) => setForm({ ...form, estimation: Number(e.target.value) })}
                  className="w-full pl-10 pr-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
                />
              </div>
            </div>

            {error && <p className="text-sm text-[#DC2626]">{error}</p>}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-[#C74634] text-white rounded-lg hover:bg-[#9E2A1F] transition-colors disabled:opacity-60"
              >
                {saving ? "Creating..." : "Create Task"}
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

import { useState, useEffect } from "react";
import { X, Clock, Sparkles } from "lucide-react";
import { useSprint } from "../context/SprintContext.tsx";
import type { Task, TaskStatus, TaskType } from "../pages/Tasks.tsx";

function localISOString(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
}

interface UserOption {
  userId: number;
  username: string;
}

interface AISuggestion {
  priority: "low" | "medium" | "high";
  type: "feature" | "bug" | "issue" | "enhancement";
  hours: string;
  reason: string;
}

interface TaskCreatePanelProps {
  onClose: () => void;
  onCreate: (task: Task) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  high: "text-red-600 bg-red-50 border-red-200",
  medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
  low: "text-green-600 bg-green-50 border-green-200",
};

const PRIORITY_LABELS: Record<string, string> = {
  high: "↑ High",
  medium: "→ Medium",
  low: "↓ Low",
};

export default function TaskCreatePanel({ onClose, onCreate }: TaskCreatePanelProps) {
  const { sprints } = useSprint();
  const [users, setUsers] = useState<UserOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [aiError, setAiError] = useState("");

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

  const handleAISuggest = async () => {
    setAiLoading(true);
    setAiError("");
    setAiSuggestion(null);
    try {
      const res = await fetch("/api/ai/suggest-priority", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          assigneeId: form.assigneeId ? Number(form.assigneeId) : null,
        }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setAiSuggestion(data as AISuggestion);
    } catch {
      setAiError("Could not get AI suggestion. Check your API key.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleUseSuggestion = () => {
    if (aiSuggestion) {
      setForm({
        ...form,
        priority: aiSuggestion.priority,
        type: aiSuggestion.type,
        estimation: Number(aiSuggestion.hours),
      });
      setAiSuggestion(null);
    }
  };

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
        createdAt: localISOString(),
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
        assigneeId: selectedUser?.userId ?? null,
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

            {/* Priority + AI Suggest */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-[#1A1A1A]">Priority</label>
                <button
                  type="button"
                  onClick={handleAISuggest}
                  disabled={aiLoading || !form.description.trim()}
                  title={!form.description.trim() ? "Add a description to enable AI suggestions" : ""}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {aiLoading ? "Thinking..." : "AI Suggest"}
                </button>
              </div>

              <select
                value={form.priority}
                onChange={(e) => {
                  setForm({ ...form, priority: e.target.value as "low" | "medium" | "high" });
                  setAiSuggestion(null);
                }}
                className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
              >
                <option value="high">↑ High</option>
                <option value="medium">→ Medium</option>
                <option value="low">↓ Low</option>
              </select>

              {/* AI Suggestion Card */}
              {aiSuggestion && (
                <div className="mt-3 p-4 rounded-lg border border-purple-200 bg-purple-50">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="text-xs font-semibold text-purple-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Suggestion
                    </p>
                    <button
                      type="button"
                      onClick={handleUseSuggestion}
                      className="flex-shrink-0 px-3 py-1 text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 rounded-md transition-colors"
                    >
                      Use All
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="bg-white rounded-md px-3 py-2 border border-purple-100">
                      <p className="text-[10px] text-purple-500 font-medium mb-0.5">Priority</p>
                      <p className="text-xs font-semibold text-purple-800">{PRIORITY_LABELS[aiSuggestion.priority]}</p>
                    </div>
                    <div className="bg-white rounded-md px-3 py-2 border border-purple-100">
                      <p className="text-[10px] text-purple-500 font-medium mb-0.5">Type</p>
                      <p className="text-xs font-semibold text-purple-800 capitalize">{aiSuggestion.type}</p>
                    </div>
                    <div className="bg-white rounded-md px-3 py-2 border border-purple-100">
                      <p className="text-[10px] text-purple-500 font-medium mb-0.5">Est. Hours</p>
                      <p className="text-xs font-semibold text-purple-800">{aiSuggestion.hours}h</p>
                    </div>
                  </div>
                  <p className="text-xs text-purple-600 opacity-80 leading-snug">{aiSuggestion.reason}</p>
                </div>
              )}

              {aiError && (
                <p className="mt-2 text-xs text-red-600">{aiError}</p>
              )}
            </div>

            {/* Assignee & Sprint */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Assignee</label>
                <select
                  value={form.assigneeId}
                  onChange={(e) => {
                    setForm({ ...form, assigneeId: e.target.value });
                    setAiSuggestion(null);
                  }}
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

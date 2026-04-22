import { useState } from "react";
import { X, Clock, User, Calendar } from "lucide-react";
import { Task, TaskStatus, TaskType } from "../pages/Tasks.tsx";

interface TaskDetailsPanelProps {
  task: Task;
  onClose: () => void;
  onUpdate: (task: Task) => void;
}

export default function TaskDetailsPanel({
  task,
  onClose,
  onUpdate,
}: TaskDetailsPanelProps) {
  const [editedTask, setEditedTask] = useState<Task>(task);

  const handleSave = () => {
    onUpdate(editedTask);
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

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Assignee
              </label>
              <div className="flex items-center gap-3 px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg">
                <User className="w-5 h-5 text-[#6B7280]" />
                <span className="text-sm text-[#1A1A1A]">
                  {editedTask.assignee}
                </span>
              </div>
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
              <div className="flex items-center gap-3 px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg">
                <Calendar className="w-5 h-5 text-[#6B7280]" />
                <span className="text-sm text-[#1A1A1A]">
                  {editedTask.sprint}
                </span>
              </div>
            </div>

            {/* Activity Log */}
            <div>
              <h3 className="text-sm font-medium text-[#1A1A1A] mb-3">
                Activity Log
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-[#F7F8FA] rounded-lg">
                  <p className="text-sm text-[#1A1A1A]">
                    <span className="font-medium">Sarah Chen</span> updated
                    status to <span className="font-medium">In Progress</span>
                  </p>
                  <p className="text-xs text-[#6B7280] mt-1">2 hours ago</p>
                </div>
                <div className="p-3 bg-[#F7F8FA] rounded-lg">
                  <p className="text-sm text-[#1A1A1A]">
                    Task created by <span className="font-medium">Manager</span>
                  </p>
                  <p className="text-xs text-[#6B7280] mt-1">1 day ago</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-[#C74634] text-white rounded-lg hover:bg-[#9E2A1F] transition-colors"
              >
                Save Changes
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

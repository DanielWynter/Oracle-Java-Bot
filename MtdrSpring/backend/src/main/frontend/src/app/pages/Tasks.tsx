import { useState, useEffect } from "react";
import { Search, Filter, Plus } from "lucide-react";
import TaskTable from "../components/TaskTable.tsx";
import TaskDetailsPanel from "../components/TaskDetailsPanel.tsx";
import { useSprint } from "../context/SprintContext.tsx";

export type TaskStatus = "todo" | "in-progress" | "done" | "blocked";
export type TaskType = "feature" | "bug" | "issue" | "enhancement";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  type: TaskType;
  assignee: string;
  sprint: string;
  sprintId: number | null;
  estimation: number;
  actualTime: number;
  priority: "low" | "medium" | "high";
  createdAt: string;
}

interface TaskResponse {
  taskId: number;
  taskName: string;
  description: string;
  status: string;
  taskType: string;
  priority: string;
  totalTime: number;
  createdAt: string;
  hours: number;
  sprint: { sprintId: number; sprintName: string } | null;
  project: { projectId: number; projectName: string } | null;
  assignee: { userId: number; username: string } | null;
}

const mapDatabaseTaskToUITask = (dbTask: TaskResponse): Task => {
  const statusMap: Record<string, TaskStatus> = {
    todo: "todo",
    "to-do": "todo",
    pending: "todo",
    "in-progress": "in-progress",
    inprogress: "in-progress",
    "in progress": "in-progress",
    done: "done",
    completed: "done",
    finished: "done",
    blocked: "blocked",
  };

  const typeMap: Record<string, TaskType> = {
    feature: "feature",
    bug: "bug",
    issue: "issue",
    enhancement: "enhancement",
  };

  return {
    id: `TASK-${dbTask.taskId}`,
    title: dbTask.taskName,
    description: dbTask.description || "",
    status: (statusMap[dbTask.status?.toLowerCase()] || "todo") as TaskStatus,
    type: (typeMap[dbTask.taskType?.toLowerCase()] || "feature") as TaskType,
    assignee: dbTask.assignee?.username || "Unassigned",
    sprint: dbTask.sprint?.sprintName || "No Sprint",
    sprintId: dbTask.sprint?.sprintId ?? null,
    estimation: dbTask.hours || 0,
    actualTime: dbTask.totalTime || 0,
    priority: (["low", "medium", "high"].includes(dbTask.priority?.toLowerCase())
      ? dbTask.priority.toLowerCase()
      : "medium") as "low" | "medium" | "high",
    createdAt: new Date(dbTask.createdAt).toISOString().split("T")[0],
  };
};

export default function Tasks() {
  const { selectedSprintId } = useSprint();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const dbTasks: TaskResponse[] = await response.json();
        const mappedTasks = dbTasks.map(mapDatabaseTaskToUITask);
        setTasks(mappedTasks);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesType = typeFilter === "all" || task.type === typeFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    // Global sprint filter from Navbar; null means "All Sprints"
    const matchesSprint =
      selectedSprintId === null || task.sprintId === selectedSprintId;
    return matchesSearch && matchesStatus && matchesType && matchesPriority && matchesSprint;
  });

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const taskId = parseInt(updatedTask.id.replace("TASK-", ""));
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskName: updatedTask.title,
          description: updatedTask.description,
          status: updatedTask.status,
          hours: updatedTask.estimation,
          priority: updatedTask.priority,
        }),
      });
      if (response.ok) {
        setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
        setSelectedTask(updatedTask);
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#1A1A1A] mb-2">Tasks</h1>
          <p className="text-[#6B7280]">Manage and track all project tasks</p>
        </div>
        <button className="px-4 py-2 bg-[#C74634] text-white rounded-lg hover:bg-[#9E2A1F] transition-colors flex items-center gap-2 shadow-lg">
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-800">
          Loading tasks from database...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">
          Error: {error}
        </div>
      )}

      {/* Filters */}
      {!loading && !error && (
        <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#6B7280]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="feature">Feature</option>
              <option value="bug">Bug</option>
              <option value="issue">Issue</option>
              <option value="enhancement">Enhancement</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

          </div>
        </div>
      )}

      {/* Task Table */}
      {!loading && !error && (
        <>
          <TaskTable tasks={filteredTasks} onSelectTask={setSelectedTask} />

          {/* Task Details Panel */}
          {selectedTask && (
            <TaskDetailsPanel
              task={selectedTask}
              onClose={() => setSelectedTask(null)}
              onUpdate={handleUpdateTask}
            />
          )}
        </>
      )}

      {/* No Tasks Message */}
      {!loading && !error && tasks.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-600">No tasks found in your database.</p>
        </div>
      )}
    </div>
  );
}

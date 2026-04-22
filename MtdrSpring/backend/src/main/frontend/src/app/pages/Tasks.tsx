import { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import TaskTable from "../components/TaskTable.tsx";
import TaskDetailsPanel from "../components/TaskDetailsPanel.tsx";

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
  estimation: number;
  actualTime: number;
  priority: "low" | "medium" | "high";
  createdAt: string;
}

const mockTasks: Task[] = [
  {
    id: "TASK-1234",
    title: "Implement user authentication flow",
    description: "Create login/logout functionality with JWT tokens",
    status: "in-progress",
    type: "feature",
    assignee: "Sarah Chen",
    sprint: "Sprint 24",
    estimation: 8,
    actualTime: 6,
    priority: "high",
    createdAt: "2026-02-28",
  },
  {
    id: "TASK-1235",
    title: "Fix API response timeout issue",
    description: "Optimize database queries causing timeouts",
    status: "done",
    type: "bug",
    assignee: "Michael Rodriguez",
    sprint: "Sprint 24",
    estimation: 5,
    actualTime: 6,
    priority: "high",
    createdAt: "2026-02-27",
  },
  {
    id: "TASK-1236",
    title: "Update dashboard UI components",
    description: "Refresh the design of dashboard widgets",
    status: "todo",
    type: "enhancement",
    assignee: "Emily Thompson",
    sprint: "Sprint 24",
    estimation: 13,
    actualTime: 0,
    priority: "medium",
    createdAt: "2026-02-26",
  },
  {
    id: "TASK-1237",
    title: "Setup CI/CD pipeline",
    description: "Configure automated testing and deployment",
    status: "blocked",
    type: "feature",
    assignee: "David Kim",
    sprint: "Sprint 24",
    estimation: 8,
    actualTime: 10,
    priority: "high",
    createdAt: "2026-02-25",
  },
  {
    id: "TASK-1238",
    title: "Documentation for API endpoints",
    description: "Create comprehensive API documentation",
    status: "in-progress",
    type: "issue",
    assignee: "Jessica Martinez",
    sprint: "Sprint 24",
    estimation: 3,
    actualTime: 2,
    priority: "low",
    createdAt: "2026-02-24",
  },
  {
    id: "TASK-1239",
    title: "Implement data export feature",
    description: "Add CSV and PDF export functionality",
    status: "done",
    type: "feature",
    assignee: "Robert Johnson",
    sprint: "Sprint 23",
    estimation: 5,
    actualTime: 5,
    priority: "medium",
    createdAt: "2026-02-20",
  },
];

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesType = typeFilter === "all" || task.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setSelectedTask(updatedTask);
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

      {/* Filters */}
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
        </div>
      </div>

      {/* Task Table */}
      <TaskTable tasks={filteredTasks} onSelectTask={setSelectedTask} />

      {/* Task Details Panel */}
      {selectedTask && (
        <TaskDetailsPanel
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdateTask}
        />
      )}
    </div>
  );
}

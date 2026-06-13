/** Shared types, constants and mock API payloads for E2E tests. */

export interface MockSprint {
  sprintId: number;
  sprintName: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface MockUser {
  userId: number;
  username: string;
  email: string;
  userRole: string;
}

export interface MockTask {
  taskId: number;
  taskName: string;
  description: string;
  status: string;
  taskType: string;
  priority: string;
  hours: number;
  totalTime: number;
  createdAt: string;
  finishedAt: string | null;
  sprint: { sprintId: number; sprintName: string } | null;
  assignee: { userId: number; username: string } | null;
}

export interface MockTaskLog {
  logId: number;
  logTimestamp: string;
  logContent: string;
  task?: { taskId: number; taskName?: string };
}

export interface Credentials {
  email: string;
  password: string;
  role: "manager" | "developer";
}

export const API_ROUTES = {
  TASKS: "**/api/tasks",
  TASK_BY_ID: "**/api/tasks/*",
  SPRINTS: "**/api/sprints",
  USERS: "**/api/users",
  TASK_LOGS: "**/api/task-logs",
  AI_SUGGEST: "**/api/ai/suggest-priority",
} as const;

export const CREDENTIALS = {
  validManager: {
    email: "manager@team23.com",
    password: "ManagerPass1!",
    role: "manager" as const,
  },
  validDeveloper: {
    email: "dev@team23.com",
    password: "DevPass1!",
    role: "developer" as const,
  },
  invalid: {
    email: "",
    password: "",
    role: "developer" as const,
  },
} satisfies Record<string, Credentials>;

export const MOCK_SPRINTS: MockSprint[] = [
  {
    sprintId: 2,
    sprintName: "Sprint 2",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    status: "active",
  },
  {
    sprintId: 1,
    sprintName: "Sprint 1",
    startDate: "2025-06-01",
    endDate: "2025-12-31",
    status: "completed",
  },
];

export const MOCK_USERS: MockUser[] = [
  {
    userId: 1,
    username: "Esteban",
    email: "dev@team23.com",
    userRole: "developer",
  },
  {
    userId: 2,
    username: "Daniel",
    email: "manager@team23.com",
    userRole: "manager",
  },
  {
    userId: 3,
    username: "Guille",
    email: "guille@team23.com",
    userRole: "developer",
  },
];

export const MOCK_TASKS: MockTask[] = [
  {
    taskId: 1,
    taskName: "Implement login flow",
    description: "Auth UI and session",
    status: "todo",
    taskType: "feature",
    priority: "high",
    hours: 8,
    totalTime: 0,
    createdAt: "2026-01-10T10:00:00",
    finishedAt: null,
    sprint: { sprintId: 2, sprintName: "Sprint 2" },
    assignee: { userId: 1, username: "Esteban" },
  },
  {
    taskId: 2,
    taskName: "Fix API timeout",
    description: "Retry logic for tasks endpoint",
    status: "in-progress",
    taskType: "bug",
    priority: "medium",
    hours: 4,
    totalTime: 2,
    createdAt: "2026-01-12T10:00:00",
    finishedAt: null,
    sprint: { sprintId: 2, sprintName: "Sprint 2" },
    assignee: { userId: 1, username: "Esteban" },
  },
  {
    taskId: 3,
    taskName: "Dashboard KPI widgets",
    description: "Velocity and burndown",
    status: "done",
    taskType: "feature",
    priority: "high",
    hours: 6,
    totalTime: 5,
    createdAt: "2026-01-05T10:00:00",
    finishedAt: "2026-01-20T18:00:00",
    sprint: { sprintId: 1, sprintName: "Sprint 1" },
    assignee: { userId: 3, username: "Guille" },
  },
  {
    taskId: 4,
    taskName: "Blocked DB migration",
    description: "Waiting on DBA",
    status: "blocked",
    taskType: "issue",
    priority: "low",
    hours: 3,
    totalTime: 0,
    createdAt: "2026-01-15T10:00:00",
    finishedAt: null,
    sprint: { sprintId: 2, sprintName: "Sprint 2" },
    assignee: { userId: 2, username: "Daniel" },
  },
];

export const MOCK_TASK_LOGS: MockTaskLog[] = [
  {
    logId: 1,
    logTimestamp: "2026-01-20T18:00:00",
    logContent: "Completed task",
    task: { taskId: 3, taskName: "Dashboard KPI widgets" },
  },
  {
    logId: 2,
    logTimestamp: "2026-01-14T09:00:00",
    logContent: "Started work on",
    task: { taskId: 2, taskName: "Fix API timeout" },
  },
];

export const LOGIN_ERROR = "Please enter valid credentials";

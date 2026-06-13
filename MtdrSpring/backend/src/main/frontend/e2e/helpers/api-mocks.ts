import type { Page, Route } from "@playwright/test";
import {
  API_ROUTES,
  MOCK_SPRINTS,
  MOCK_TASKS,
  MOCK_TASK_LOGS,
  MOCK_USERS,
  type MockTask,
} from "../fixtures/mock-data.ts";

export interface MockApiState {
  tasks: MockTask[];
}

const defaultState = (): MockApiState => ({
  tasks: MOCK_TASKS.map((t) => ({ ...t })),
});

/** Intercept all REST calls — tests never hit the real Oracle backend. */
export async function mockAllApis(
  page: Page,
  initialState: MockApiState = defaultState()
): Promise<{ state: MockApiState }> {
  const state = initialState;

  const json = (route: Route, body: unknown, status = 200) =>
    route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(body),
    });

  await page.route(API_ROUTES.SPRINTS, (route) => json(route, MOCK_SPRINTS));
  await page.route(API_ROUTES.USERS, (route) => json(route, MOCK_USERS));
  await page.route(API_ROUTES.TASK_LOGS, (route) => json(route, MOCK_TASK_LOGS));
  await page.route(API_ROUTES.AI_SUGGEST, (route) =>
    json(route, {
      priority: "medium",
      type: "feature",
      hours: "4",
      reason: "Mock AI suggestion",
    })
  );

  await page.route(API_ROUTES.TASKS, async (route) => {
    const method = route.request().method();
    if (method === "GET") {
      await json(route, state.tasks);
      return;
    }
    if (method === "POST") {
      const body = route.request().postDataJSON() as Partial<MockTask>;
      const created: MockTask = {
        taskId: state.tasks.length + 10,
        taskName: body.taskName ?? "New Task",
        description: body.description ?? "",
        status: (body.status as string) ?? "todo",
        taskType: body.taskType ?? "feature",
        priority: body.priority ?? "medium",
        hours: body.hours ?? 0,
        totalTime: 0,
        createdAt: new Date().toISOString(),
        finishedAt: null,
        sprint: MOCK_SPRINTS[0]
          ? { sprintId: MOCK_SPRINTS[0].sprintId, sprintName: MOCK_SPRINTS[0].sprintName }
          : null,
        assignee: MOCK_USERS[0]
          ? { userId: MOCK_USERS[0].userId, username: MOCK_USERS[0].username }
          : null,
      };
      state.tasks.push(created);
      await json(route, created, 201);
      return;
    }
    await route.continue();
  });

  await page.route(API_ROUTES.TASK_BY_ID, async (route) => {
    const method = route.request().method();
    const id = Number(route.request().url().split("/").pop());
    const idx = state.tasks.findIndex((t) => t.taskId === id);

    if (method === "PUT" && idx >= 0) {
      const body = route.request().postDataJSON() as Partial<MockTask>;
      state.tasks[idx] = { ...state.tasks[idx], ...body, taskId: id };
      await json(route, state.tasks[idx]);
      return;
    }
    if (method === "DELETE" && idx >= 0) {
      state.tasks.splice(idx, 1);
      await route.fulfill({ status: 204 });
      return;
    }
    if (method === "GET" && idx >= 0) {
      await json(route, state.tasks[idx]);
      return;
    }
    await json(route, { message: "Not found" }, 404);
  });

  return { state };
}

/** Fulfill routes using a HAR file (assignment: Mock with HAR Files). */
export async function mockFromHar(page: Page, harPath: string): Promise<void> {
  await page.routeFromHAR(harPath, {
    url: "**/api/**",
    notFound: "abort",
  });
}

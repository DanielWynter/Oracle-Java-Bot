import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Sprints from "./pages/Sprints";
import Team from "./pages/Team";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "tasks", Component: Tasks },
      { path: "sprints", Component: Sprints },
      { path: "team", Component: Team },
      { path: "reports", Component: Reports },
      { path: "settings", Component: Settings },
    ],
  },
]);

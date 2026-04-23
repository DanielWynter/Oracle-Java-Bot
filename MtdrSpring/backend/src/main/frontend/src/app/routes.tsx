import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Tasks from "./pages/Tasks.tsx";
import Sprints from "./pages/Sprints.tsx";
import Team from "./pages/Team.tsx";
import Reports from "./pages/Reports.tsx";
import Settings from "./pages/Settings.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/dashboard",
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

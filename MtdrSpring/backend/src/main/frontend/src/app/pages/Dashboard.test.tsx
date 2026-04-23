import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Dashboard from "./Dashboard";

// Limpieza obligatoria para que el admin no le deje su basura al developer
afterEach(() => {
  cleanup();
});

// MOCK MODULES
vi.mock("../components/KPIWidget", () => ({
  default: ({ label }: { label: string }) => (
    <div data-testid={`kpi-widget-${label}`}>{label}</div>
  ),
}));
vi.mock("../components/BurndownChart", () => ({
  default: () => <div data-testid="burndown-chart">Burndown</div>,
}));
vi.mock("../components/VelocityChart", () => ({
  default: () => <div data-testid="velocity-chart">Velocity</div>,
}));
vi.mock("../components/EstimationChart", () => ({
  default: () => <div data-testid="estimation-chart">Estimation</div>,
}));
vi.mock("../components/TaskTypeChart", () => ({
  default: () => <div data-testid="task-type-chart">TaskType</div>,
}));
vi.mock("../components/TeamWorkload", () => ({
  default: () => <div data-testid="team-workload">TeamWorkload</div>,
}));
vi.mock("../components/ActivityFeed", () => ({
  default: () => <div data-testid="activity-feed">ActivityFeed</div>,
}));

// Mockeamos lucide-react
vi.mock("lucide-react", () => ({
  Target: () => <span>Icon</span>,
  CheckSquare: () => <span>Icon</span>,
  CheckCircle2: () => <span>Icon</span>,
  AlertCircle: () => <span>Icon</span>,
  TrendingUp: () => <span>Icon</span>,
  Percent: () => <span>Icon</span>,
}));

describe("Dashboard Component - Lógica de Roles", () => {
  // Limpiamos todo antes de cada test para evitar que se hereden roles
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("debería mostrar Velocity y TaskType Charts si el rol es 'admin'", () => {
    // Forzamos que el localStorage devuelva 'admin'
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue("admin");

    render(<Dashboard />);

    expect(screen.getByTestId("velocity-chart")).toBeDefined();
    expect(screen.getByTestId("task-type-chart")).toBeDefined();
  });

  it("debería ocultar Velocity y TaskType Charts si el rol es 'developer'", () => {
    // Forzamos que el localStorage devuelva 'developer'
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue("developer");

    render(<Dashboard />);

    expect(screen.queryByTestId("velocity-chart")).toBeNull();
    expect(screen.queryByTestId("task-type-chart")).toBeNull();
  });
});

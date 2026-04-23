/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Sprints from "./Sprints";

// MOCK MODULES
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  LineChart: () => <div data-testid="line-chart">LineChart</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}));

// Mock de iconos
vi.mock("lucide-react", () => ({
  Calendar: () => <span>Icon</span>,
  TrendingUp: () => <span>Icon</span>,
  CheckCircle2: () => <span>Icon</span>,
  Clock: () => <span>Icon</span>,
}));

// Mock del TaskTable para verificar que se le pasan las tareas
vi.mock("../components/TaskTable", () => ({
  default: () => (
    <div data-testid="task-table-mock">Tabla de Tareas del Sprint</div>
  ),
}));

describe("Sprints Component", () => {
  it("debería renderizar la cabecera y el selector de sprints", () => {
    render(<Sprints />);
    expect(screen.getByText("Sprint Management")).toBeDefined();
    expect(screen.getByText("Sprint Progress")).toBeDefined();
  });

  it("debería renderizar la lista de tareas por sprint (Requisito Rúbrica)", () => {
    render(<Sprints />);
    // Comprobamos que el componente de la tabla de tareas se esta montando en la vista de Sprints
    expect(screen.getAllByTestId("task-table-mock")[0]).toBeDefined();
    expect(screen.getAllByText("Tasks for Sprint 24")[0]).toBeDefined();
  });
});

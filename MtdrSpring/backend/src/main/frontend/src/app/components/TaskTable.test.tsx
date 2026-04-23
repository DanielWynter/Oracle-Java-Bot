import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskTable from "./TaskTable";
import { Task } from "../pages/Tasks";

// 1. MOCK MODULES: Mockeamos lucide-react para evitar renderizar SVGs complejos
vi.mock("lucide-react", () => ({
  AlertCircle: () => <span data-testid="alert-icon">Alert</span>,
}));

const mockTasks: Task[] = [
  {
    id: "TASK-1",
    title: "Crear conexión con el bot",
    description: "Conectar webhook",
    status: "in-progress",
    type: "feature",
    assignee: "Esteban",
    sprint: "Sprint 1",
    estimation: 10,
    actualTime: 5,
    priority: "high",
    createdAt: "2026-04-21",
  }
];

describe("TaskTable Component", () => {
  // 2. MOCK FUNCTIONS: Función espía para simular la selección de tarea
  const mockOnSelectTask = vi.fn();

  it("debería hacer match con el snapshot (Snapshot Testing)", () => {
    const { asFragment } = render(
      <TaskTable tasks={mockTasks} onSelectTask={mockOnSelectTask} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("debería mostrar las tareas asignadas correctamente en la tabla", () => {
    render(<TaskTable tasks={mockTasks} onSelectTask={mockOnSelectTask} />);
    
    // Evitamos detalles de implementación buscando por texto visible
    expect(screen.getAllByText("TASK-1")[0]).toBeDefined();
    expect(screen.getByText("Crear conexión con el bot")).toBeDefined();
    expect(screen.getByText("Esteban")).toBeDefined();
  });

  it("debería llamar a onSelectTask al hacer clic en una fila", () => {
    render(<TaskTable tasks={mockTasks} onSelectTask={mockOnSelectTask} />);
    
    const taskRow = screen.getAllByText("TASK-1")[0].closest("tr");
    fireEvent.click(taskRow!);

    expect(mockOnSelectTask).toHaveBeenCalledTimes(1);
    expect(mockOnSelectTask).toHaveBeenCalledWith(mockTasks[0]);
  });
});
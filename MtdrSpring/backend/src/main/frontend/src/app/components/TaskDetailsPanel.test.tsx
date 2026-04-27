/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import TaskDetailsPanel from "./TaskDetailsPanel";
import { Task } from "../pages/Tasks";

// MOCK MODULES
vi.mock("lucide-react", () => ({
  X: () => <span data-testid="close-icon">X</span>,
  Clock: () => <span>Clock</span>,
  User: () => <span>User</span>,
  Calendar: () => <span>Calendar</span>,
}));

const initialTask: Task = {
  id: "TASK-2",
  title: "Diseñar Base de Datos",
  description: "Estructura inicial",
  status: "todo",
  type: "issue",
  assignee: "Luciano",
  sprint: "Sprint 1",
  estimation: 8,
  actualTime: 0,
  priority: "medium",
  createdAt: "2026-04-21",
  sprintId: 1, 
  finishedAt: "2026-04-26"
};

describe("TaskDetailsPanel Component", () => {
  const mockOnClose = vi.fn();
  const mockOnUpdate = vi.fn();

  it("debería permitir editar el título de la tarea (State Change)", async () => {
    const user = userEvent.setup();
    render(
      <TaskDetailsPanel
        task={initialTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />,
    );

    // Encontramos el input por su valor actual
    const titleInput = screen.getByDisplayValue("Diseñar Base de Datos");

    // simulamos que el usuario borra y escribe algo nuevo
    await user.clear(titleInput);
    await user.type(titleInput, "Nueva BD Optimizada");

    // guardae
    const saveButton = screen.getByText("Save Changes");
    await user.click(saveButton);

    // Verificamos que la funcion espia se llamo
    expect(mockOnUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Nueva BD Optimizada" }),
    );
  });

  it("debería permitir marcar la tarea como completada (Done)", async () => {
    const user = userEvent.setup();
    render(
      <TaskDetailsPanel
        task={initialTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />,
    );

    const statusSelect = screen.getAllByDisplayValue("To Do")[0];
    await user.selectOptions(statusSelect, "done");

    // Guardamos
    const saveButton = screen.getAllByText("Save Changes")[0];
    await user.click(saveButton);

    // Verificamos que el estado de la tarea cambio a 'done'
    expect(mockOnUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ status: "done" }),
    );
  });
});

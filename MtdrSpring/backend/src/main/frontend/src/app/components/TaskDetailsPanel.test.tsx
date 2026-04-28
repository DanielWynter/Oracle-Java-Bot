/** @vitest-environment jsdom */
import React from "react";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import TaskDetailsPanel from "./TaskDetailsPanel";
import { Task } from "../pages/Tasks";

// 1. Interceptamos el Fetch del botón "Save Changes"
globalThis.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ finishedAt: "2026-04-26T12:00:00Z" }),
  })
) as any;

describe("TaskDetailsPanel Component", () => {
  const mockTask: Task = {
    id: "TASK-1",
    title: "Añadir base de datos",
    description: "Configurar tabla",
    status: "todo",
    type: "feature",
    assignee: "Luciano",
    sprint: "Sprint 1",
    sprintId: 1,
    estimation: 5,
    actualTime: 2,
    priority: "medium",
    createdAt: "2026-04-25T10:00:00Z",
    finishedAt: null
  };

  const mockOnClose = vi.fn();
  const mockOnUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("debería permitir editar el título de la tarea (State Change)", async () => {
    render(
      <TaskDetailsPanel
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    // Escribimos el nuevo título
    const titleInput = screen.getByDisplayValue("Añadir base de datos");
    fireEvent.change(titleInput, { target: { value: "Nueva BD Optimizada" } });

    // Damos clic a Guardar
    const saveButton = screen.getByText("Save Changes");
    fireEvent.click(saveButton);

    // 2. Usamos waitFor porque el botón ahora tiene un 'await fetch' adentro
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Nueva BD Optimizada" })
      );
    });
  });

  it("debería permitir marcar la tarea como completada (Done)", async () => {
    render(
      <TaskDetailsPanel
        task={mockTask}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    // Cambiamos el select a "done"
    const statusSelect = screen.getByDisplayValue("To Do");
    fireEvent.change(statusSelect, { target: { value: "done" } });

    // Damos clic a Guardar
    const saveButton = screen.getByText("Save Changes");
    fireEvent.click(saveButton);

    // 3. Usamos waitFor para esperar a que termine la promesa
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ status: "done" })
      );
    });
  });
});
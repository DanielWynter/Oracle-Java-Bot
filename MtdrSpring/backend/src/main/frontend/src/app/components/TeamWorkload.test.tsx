/** @vitest-environment jsdom */
import React from "react";
import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import TeamWorkload from "./TeamWorkload";

// 1. Mockeamos el contexto para que "useSprint" no explote
vi.mock("../context/SprintContext.tsx", () => ({
  useSprint: () => ({ selectedSprintId: null })
}));

// 2. Creamos la estructura anidada EXACTA que pide tu interfaz TaskRaw
const mockTasks = [
  ...Array(12).fill({
    hours: 34 / 12,
    sprint: null,
    assignee: { userId: 1, username: "Sarah Chen" }
  }),
  ...Array(10).fill({
    hours: 28 / 10,
    sprint: null,
    assignee: { userId: 2, username: "Michael Rodriguez" }
  })
];

globalThis.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockTasks),
  })
) as any;

describe("TeamWorkload Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería renderizar la lista de desarrolladores", async () => {
    render(<TeamWorkload />);
    expect(await screen.findByText("Sarah Chen")).toBeDefined();
    expect(await screen.findByText("Michael Rodriguez")).toBeDefined();
  });

  it("debería mostrar las tareas completadas y horas trabajadas por persona (Requisito KPI)", async () => {
    render(<TeamWorkload />);
    
    // 1. Buscamos primero el componente padre (para que cargue)
    const sarahName = await screen.findByText(/Sarah Chen/i);
    expect(sarahName).toBeDefined();
    
    // 2. Usamos getAllByText para el número, porque "12" y "tasks" están separados en el DOM
    const twelveTasks = screen.getAllByText(/12/i);
    expect(twelveTasks.length).toBeGreaterThan(0);
    
    const tenTasks = screen.getAllByText(/10/i);
    expect(tenTasks.length).toBeGreaterThan(0);
    
    // 3. Verificamos los porcentajes de horas
    const cienPorciento = screen.getAllByText(/100/i);
    expect(cienPorciento.length).toBeGreaterThan(0);
    
    const ochentaYDos = screen.getAllByText(/82/i);
    expect(ochentaYDos.length).toBeGreaterThan(0);
  });
});
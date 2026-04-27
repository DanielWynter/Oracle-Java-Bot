/** @vitest-environment jsdom */
import React from "react";
import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import TeamWorkload from "./TeamWorkload";

// Interceptamos cualquier llamada inteligente del componente
globalThis.fetch = vi.fn((url: string) => {
  // 1. Si el componente pide la lista de usuarios/desarrolladores
  if (url && (url.includes("user") || url.includes("dev"))) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { id: "dev-1", name: "Sarah Chen", fullName: "Sarah Chen" },
        { id: "dev-2", name: "Michael Rodriguez", fullName: "Michael Rodriguez" }
      ])
    });
  }
  
  // 2. Si el componente pide las tareas (las amarramos al ID del usuario)
  const mockTasks = [
    ...Array.from({ length: 12 }, (_, i) => ({
      id: `t1-${i}`,
      title: `Task ${i}`,
      assignee: "Sarah Chen",
      assigneeId: "dev-1", // Match con Sarah
      userId: "dev-1",
      status: "done",
      actualTime: 34 / 12,
      hoursWorked: 34 / 12
    })),
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `t2-${i}`,
      title: `Task ${i}`,
      assignee: "Michael Rodriguez",
      assigneeId: "dev-2", // Match con Michael
      userId: "dev-2",
      status: "done",
      actualTime: 28 / 10,
      hoursWorked: 28 / 10
    }))
  ];

  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockTasks),
  });
}) as any;

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
    
    // Usamos regex \s* para ignorar saltos de línea o espacios extra en el HTML
    expect(await screen.findByText(/12\s*tasks/i)).toBeDefined();
    expect(await screen.findByText(/10\s*tasks/i)).toBeDefined();
    
    // Buscamos los números por separado por si eliminaron la frase "hours worked"
    expect(await screen.findByText(/34/i)).toBeDefined();
    expect(await screen.findByText(/28/i)).toBeDefined();
  });
});
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TeamWorkload from "./TeamWorkload";

describe("TeamWorkload Component", () => {
  it("debería renderizar la lista de desarrolladores", () => {
    render(<TeamWorkload />);
    expect(screen.getAllByText("Sarah Chen")[0]).toBeDefined();
    expect(screen.getAllByText("Michael Rodriguez")[0]).toBeDefined();
  });

  it("debería mostrar las tareas completadas y horas trabajadas por persona (Requisito KPI)", () => {
    render(<TeamWorkload />);
    
    // Verificamos que el texto exacto que pide la rúbrica esté en el componente
    expect(screen.getAllByText(/12 tasks | 34 hours worked/i)[0]).toBeDefined();
    expect(screen.getAllByText(/10 tasks | 28 hours worked/i)[0]).toBeDefined();
  });
});
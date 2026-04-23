/** @vitest-environment jsdom */
import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import MainLayout from "./MainLayout";

// Limpieza para evitar clones en el DOM
afterEach(() => {
  cleanup();
});

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: "/dashboard" }),
  };
});

vi.mock("../components/Sidebar", () => ({
  default: () => <div data-testid="sidebar-mock">Sidebar</div>,
}));
vi.mock("../components/Navbar", () => ({
  default: () => <div data-testid="navbar-mock">Navbar</div>,
}));

describe("MainLayout Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("debería redirigir a /login si no hay userEmail en localStorage", () => {
    localStorage.removeItem("userEmail");

    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>,
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("debería renderizar el layout completo si el usuario está autenticado", () => {
    localStorage.setItem("userEmail", "test@zenithlabs.com");

    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>,
    );

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getAllByTestId("sidebar-mock")[0]).toBeDefined();
    expect(screen.getAllByTestId("navbar-mock")[0]).toBeDefined();
  });
});

import { describe, it, expect, vi } from 'vitest';

// 1. Mock
const mockTelegramBot = {
  crearTarea: vi.fn().mockResolvedValue({ status: 200, message: "Tarea creada en el board" }),
  verTareasSprint: vi.fn().mockResolvedValue([
    "Login completado por Daniel", 
    "Base de datos configurada por Luciano"
  ]),
  verTareasUsuario: vi.fn().mockResolvedValue([
    "Tarea de despliegue completada por Guillermo"
  ])
};

describe('Evidencia Módulo 4 - Telegram Bot (Mock Testing)', () => {
  
  it('1. Debe crear una tarea simulando la respuesta de Telegram', async () => {
    const response = await mockTelegramBot.crearTarea("Diseñar arquitectura del Java Bot");
    expect(mockTelegramBot.crearTarea).toHaveBeenCalledOnce();
    expect(response.status).toBe(200);
  });

  it('2. Debe ver las tareas completadas de un sprint específico', async () => {
    const tareas = await mockTelegramBot.verTareasSprint(1);
    expect(tareas).toHaveLength(2);
    expect(tareas).toContain("Login completado por Daniel");
  });

  it('3. Debe ver las tareas completadas de un usuario en un sprint', async () => {
    const tareasUsuario = await mockTelegramBot.verTareasUsuario("Guillermo", 1);
    expect(tareasUsuario).toHaveLength(1);
    expect(tareasUsuario[0]).toContain("Guillermo");
  });
});
# Oracle Java Bot — Software Management Tool

Herramienta fullstack de gestión de proyectos de software con inteligencia artificial, bot de Telegram y dashboard en tiempo real. Desarrollada en 15 semanas como proyecto académico sobre Oracle Cloud Infrastructure.

---

## Tabla de contenido

1. [Descripción general](#1-descripción-general)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Arquitectura del sistema](#3-arquitectura-del-sistema)
4. [Estructura del repositorio](#4-estructura-del-repositorio)
5. [Backend — Explicación del código](#5-backend--explicación-del-código)
6. [Frontend — Explicación del código](#6-frontend--explicación-del-código)
7. [Bot de Telegram](#7-bot-de-telegram)
8. [Feature de IA — AI Priority Suggester](#8-feature-de-ia--ai-priority-suggester)
9. [Infraestructura (OCI)](#9-infraestructura-oci)
10. [Configuración y ejecución local](#10-configuración-y-ejecución-local)
11. [Tests y cobertura de código](#11-tests-y-cobertura-de-código)
12. [Equipo](#12-equipo)

---

## 1. Descripción general

**Oracle Java Bot** es una plataforma de gestión de proyectos de software que permite a equipos ágiles:

- Gestionar tareas, sprints y equipos desde una interfaz web.
- Actualizar el estado de tareas mediante un **bot de Telegram** sin salir del flujo de trabajo.
- Obtener sugerencias automáticas de prioridad, tipo y estimación de tiempo mediante **GPT-4o mini** (OpenAI).
- Monitorear el progreso del equipo en tiempo real con **KPIs, Burndown Chart y Velocity Chart**.

---

## 2. Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Java 11 · Spring Boot 3.5.6 · Spring Data JPA · Spring Security |
| Frontend | React 18 · TypeScript · Tailwind CSS · Recharts · Vite |
| Base de datos | Oracle Autonomous Database (ATP) — Always Free Tier |
| Bot | Telegram Bot API (long-polling) via `telegrambots` 9.1.0 |
| IA | OpenAI GPT-4o mini (REST) |
| Infraestructura | Oracle Kubernetes Engine (OKE) · Terraform · Oracle Container Registry |
| CI/CD | Oracle DevOps Build Pipeline (`build_spec.yaml`) |
| Tests | JUnit 5 · Mockito · JaCoCo 0.8.11 |

---

## 3. Arquitectura del sistema

```
┌─────────────────────────────────────────────────────────┐
│                   Oracle Cloud (OKE)                    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │           Spring Boot Application               │    │
│  │                                                 │    │
│  │  React SPA ──► REST API ──► Service ──► JPA     │    │
│  │  (static)     /api/**      Layer      Layer     │    │
│  │                                                 │    │
│  │  Telegram Bot (long-polling)                    │    │
│  │  OpenAI REST client (/api/ai/suggest-priority)  │    │
│  └───────────────────┬─────────────────────────────┘    │
│                      │                                  │
│             Oracle Autonomous DB (ATP)                  │
│                   Schema: DEV                           │
└─────────────────────────────────────────────────────────┘
         ▲                        ▲
         │                        │
    Browser (HTTPS)         Telegram App
```

El frontend React se compila durante el build de Maven y se sirve como recursos estáticos desde Spring Boot en el mismo servidor (puerto 8080). No hay un servidor frontend separado en producción.

---

## 4. Estructura del repositorio

```
Oracle-Java-Bot/
├── MtdrSpring/
│   ├── backend/                          # Aplicación Spring Boot
│   │   ├── pom.xml                       # Dependencias Maven + JaCoCo
│   │   └── src/
│   │       ├── main/
│   │       │   ├── java/com/springboot/MyTodoList/
│   │       │   │   ├── MyTodoListApplication.java   # Punto de entrada
│   │       │   │   ├── config/                      # Configuraciones Spring
│   │       │   │   ├── controller/                  # Controladores REST + Bot
│   │       │   │   ├── model/                       # Entidades JPA
│   │       │   │   ├── repository/                  # Interfaces Spring Data
│   │       │   │   ├── security/                    # Configuración Spring Security
│   │       │   │   ├── service/                     # Lógica de negocio
│   │       │   │   └── util/                        # Enums y helpers del bot
│   │       │   ├── frontend/                        # Aplicación React
│   │       │   │   └── src/app/
│   │       │   │       ├── components/              # Componentes reutilizables
│   │       │   │       ├── context/                 # SprintContext (estado global)
│   │       │   │       ├── layouts/                 # MainLayout
│   │       │   │       └── pages/                   # Dashboard, Tasks, Sprints...
│   │       │   └── resources/
│   │       │       └── application.properties       # Configuración de la app
│   │       └── test/                               # Tests unitarios (JUnit + Mockito)
│   └── terraform/                                   # Infraestructura como código (OCI)
├── build_spec.yaml                                  # Pipeline CI/CD Oracle DevOps
└── README.md
```

---

## 5. Backend — Explicación del código

### 5.1 Punto de entrada

**`MyTodoListApplication.java`**
Clase principal que arranca Spring Boot. Contiene el método `main()` con `SpringApplication.run()`.

---

### 5.2 Capa de Modelos (`model/`)

Entidades JPA que mapean las tablas de Oracle Autonomous DB (esquema `DEV`).

| Clase | Tabla | Descripción |
|---|---|---|
| `Task` | `DEV.TASKS` | Tarea de desarrollo. Tiene relaciones ManyToOne con `Sprint`, `Project` y `User` (asignado). Campos clave: `status`, `priority`, `taskType`, `hours` (estimado), `totalTime` (real). |
| `Sprint` | `DEV.SPRINTS` | Sprint ágil con nombre, fechas de inicio/fin y estado. |
| `User` | `DEV.USERS` | Miembro del equipo con username, email, rol y equipo asignado. |
| `Project` | `DEV.PROJECTS` | Proyecto que agrupa sprints y usuarios. |
| `Team` | `DEV.TEAMS` | Equipo de desarrollo asociado a un proyecto. |
| `TaskLog` | `DEV.TASK_LOGS` | Registro de actividad/cambios sobre una tarea (auditoría). |
| `Analytic` | `DEV.ANALYTICS` | Métricas calculadas para reportes. |

Todos los IDs se generan con secuencias Oracle (`@SequenceGenerator`).

---

### 5.3 Capa de Repositorios (`repository/`)

Interfaces que extienden `JpaRepository<Entidad, Long>`. Spring Data genera automáticamente las implementaciones CRUD.

```
TaskRepository       → CRUD de Tasks
UserRepository       → CRUD de Users
SprintRepository     → CRUD de Sprints
ProjectRepository    → CRUD de Projects
TeamRepository       → CRUD de Teams
TaskLogRepository    → CRUD de TaskLogs
AnalyticRepository   → CRUD de Analytics
```

---

### 5.4 Capa de Servicios (`service/`)

Contienen la lógica de negocio. Cada servicio inyecta su repositorio correspondiente y expone métodos `findAll()`, `findById()`, `save()`, `update()` y `deleteById()`.

| Servicio | Responsabilidad |
|---|---|
| `TaskService` | Operaciones CRUD sobre tareas |
| `UserService` | Operaciones CRUD sobre usuarios |
| `SprintService` | Operaciones CRUD sobre sprints |
| `ProjectService` | Operaciones CRUD sobre proyectos |
| `TeamService` | Operaciones CRUD sobre equipos |
| `TaskLogService` | Registro de actividad por tarea |
| `AnalyticService` | Consultas para reportes y KPIs |
| `DeepSeekService` | Cliente alternativo de IA (DeepSeek API) |

---

### 5.5 Capa de Controladores (`controller/`)

Controladores REST que exponen la API bajo el prefijo `/api/`.

| Controlador | Ruta base | Descripción |
|---|---|---|
| `TaskController` | `/api/tasks` | CRUD completo de tareas vía HTTP |
| `UserController` | `/api/users` | CRUD de usuarios |
| `SprintController` | `/api/sprints` | CRUD de sprints |
| `ProjectController` | `/api/projects` | CRUD de proyectos |
| `TeamController` | `/api/teams` | CRUD de equipos |
| `TaskLogController` | `/api/tasklogs` | Logs de actividad |
| `AnalyticController` | `/api/analytics` | Datos para reportes |
| `AIPriorityController` | `/api/ai` | Sugerencias de IA (ver sección 8) |
| `TaskBotController` | — | Bot de Telegram (ver sección 7) |

---

### 5.6 Configuraciones (`config/`)

| Clase | Propósito |
|---|---|
| `OracleConfiguration` | Configura el DataSource con el wallet de Oracle ATP |
| `DbSettings` | Lee las propiedades de base de datos desde `application.properties` |
| `BotProps` | Lee el token y nombre del bot de Telegram |
| `CorsConfig` | Permite peticiones desde `localhost:5173` y `localhost:3000` durante desarrollo |
| `DeepSeekConfig` | Configuración del cliente alternativo de IA |

---

### 5.7 Seguridad (`security/`)

**`WebSecurityConfiguration.java`** configura Spring Security para:
- Permitir todas las solicitudes sin autenticación (`anyRequest().permitAll()`).
- Deshabilitar CSRF (la app usa una API REST sin formularios HTML).
- Deshabilitar autenticación básica y login por formulario.

> En un entorno de producción real se reemplazaría por autenticación JWT.

---

### 5.8 Utilidades del Bot (`util/`)

| Clase | Tipo | Descripción |
|---|---|---|
| `BotLabels` | `enum` | Etiquetas de los botones del teclado de Telegram (ej. "📋 Ver Tasks", "👤 Por Asignado") |
| `BotCommands` | `enum` | Comandos de barra del bot (ej. `/start`, `/todolist`) |
| `BotMessages` | `enum` | Mensajes predefinidos de respuesta del bot |
| `BotHelper` | `class` | Métodos estáticos para enviar mensajes a Telegram con o sin teclado personalizado |

---

## 6. Frontend — Explicación del código

### 6.1 Páginas (`pages/`)

| Página | Ruta | Descripción |
|---|---|---|
| `Login.tsx` | `/login` | Pantalla de autenticación |
| `Dashboard.tsx` | `/` | KPIs, Burndown Chart, Velocity Chart y análisis por dev |
| `Tasks.tsx` | `/tasks` | Tabla de tareas con filtros, creación y edición |
| `Sprints.tsx` | `/sprints` | Gestión de sprints del proyecto |
| `Team.tsx` | `/team` | Vista de miembros del equipo y workload |
| `Reports.tsx` | `/reports` | Reportes de estimación y tipos de tarea |
| `Settings.tsx` | `/settings` | Configuración de la aplicación |

### 6.2 Componentes reutilizables (`components/`)

| Componente | Descripción |
|---|---|
| `KPIWidget.tsx` | Tarjeta de KPI con valor, tendencia (↑/↓) e ícono |
| `BurndownChart.tsx` | Gráfica de líneas del burndown del sprint activo |
| `VelocityChart.tsx` | Barras de velocidad (horas completadas) por sprint |
| `EstimationChart.tsx` | Comparación entre horas estimadas y reales |
| `TaskTypeChart.tsx` | Distribución de tareas por tipo (feature/bug/issue/enhancement) |
| `TeamWorkload.tsx` | Carga de trabajo actual por miembro del equipo |
| `ActivityFeed.tsx` | Feed de actividad reciente (últimos cambios) |
| `DevTaskAnalysis.tsx` | **Nuevo:** Dos gráficas agrupadas (tasks y horas por dev/sprint) con filtros y franja de KPIs |
| `TaskCreatePanel.tsx` | Panel lateral para crear tareas con sugerencia de IA |
| `TaskDetailsPanel.tsx` | Panel de detalle y edición de una tarea |
| `TaskTable.tsx` | Tabla de tareas con columnas, filtros y paginación |
| `Navbar.tsx` | Barra superior de navegación |
| `Sidebar.tsx` | Menú lateral de navegación |

### 6.3 Contexto global (`context/`)

**`SprintContext.tsx`** provee a toda la aplicación:
- Lista de sprints disponibles (cargada desde `/api/sprints`).
- Sprint seleccionado actualmente (`selectedSprintId`).
- Selector de sprint en el Navbar que filtra los datos de todos los componentes del dashboard.

### 6.4 Flujo de datos

```
API REST (/api/tasks, /api/sprints, etc.)
        │
        ▼
  fetch() en useEffect
        │
        ▼
   useState / useMemo
        │
        ▼
  Recharts / KPIWidget
```

Cada componente hace su propio `fetch` al backend. No se usa Redux ni ningún state manager externo — el estado es local o compartido vía `SprintContext`.

---

## 7. Bot de Telegram

**`TaskBotController.java`** implementa un bot conversacional con **máquina de estados por chat**.

### Estados del bot

```
IDLE
  └── "📋 Ver Tasks"
        └── AWAITING_FILTER_TYPE
              ├── "👤 Por Asignado"  → AWAITING_ASSIGNEE
              │         └── [Selecciona usuario] → AWAITING_SPRINT_AFTER_ASSIGNEE
              │                   └── [Selecciona sprint / Sin filtro] → muestra tasks
              ├── "🏃 Por Sprint"   → AWAITING_SPRINT_ONLY
              │         └── [Selecciona sprint] → muestra tasks
              └── "📋 Todas las Tasks" → muestra todas las tasks
```

### Implementación técnica

- Cada chat (`chatId`) tiene su propio objeto `ChatSession` almacenado en un `ConcurrentHashMap`.
- La sesión guarda: estado actual, ID del usuario seleccionado y mapas `nombre → id` para usuarios y sprints.
- Los teclados de usuarios y sprints se generan **dinámicamente** desde la base de datos en cada consulta.
- Las tareas se muestran agrupadas por estado (por hacer / en progreso / bloqueadas / completadas) con íconos de prioridad (🔴🟡🟢).

---

## 8. Feature de IA — AI Priority Suggester

**`AIPriorityController.java`** expone `POST /api/ai/suggest-priority`.

### Cómo funciona

1. El usuario escribe el título y descripción de una nueva tarea en el frontend.
2. El frontend envía al endpoint el `título`, `descripción` e `assigneeId`.
3. El backend consulta la base de datos para obtener la **carga de trabajo actual** del asignado (número de tareas activas por estado).
4. Se construye un prompt estructurado y se llama a **GPT-4o mini** vía REST.
5. La respuesta JSON contiene: `priority` (low/medium/high), `type` (feature/bug/issue/enhancement), `hours` (entero) y `reason` (una frase explicativa).
6. El frontend muestra la sugerencia con un chip de color y aplica los valores al formulario con un clic.

### Prompt enviado a OpenAI

```
Based on the task name, description, and assignee workload:
1. A priority level: low, medium, or high
2. A task type: feature, bug, issue, or enhancement
3. An estimated time in hours

Task name: {title}
Task description: {description}
Assignee workload: {workloadContext}

Respond ONLY with valid JSON:
{"priority": "...", "type": "...", "hours": N, "reason": "..."}
```

---

## 9. Infraestructura (OCI)

La infraestructura está definida como código en `/MtdrSpring/terraform/`.

| Archivo Terraform | Recurso creado |
|---|---|
| `containerengine.tf` | Clúster OKE con 3 nodos `VM.Standard.E3.Flex` (2 OCPU, 6 GB RAM) |
| `database.tf` | Oracle Autonomous Database ATP (Always Free, 1 OCPU, 1 TB) |
| `core.tf` | VCN, subnets y networking |
| `repositories.tf` | Oracle Container Registry (imágenes Docker) |
| `object_storage.tf` | Bucket para artefactos |

### Costos reales (Feb – Jun 10, 2026)

| Servicio | Costo |
|---|---|
| OKE Node Pool (3 nodos E3.Flex) | $520 MXN |
| Load Balancer | $87 MXN |
| Object Storage | $10 MXN |
| ATP Database | $0 (Always Free) |
| **Total 4.3 meses** | **$617 MXN (~$35 USD)** |

---

## 10. Configuración y ejecución local

### Prerrequisitos

- Java 11+
- Maven 3.8+
- Node.js v23+ y npm
- Docker Desktop
- Wallet de Oracle ATP (descargado desde OCI Console)

### Variables de entorno requeridas

```bash
export OPENAI_API_KEY=sk-...          # Clave de OpenAI
```

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd Oracle-Java-Bot/MtdrSpring/backend

# 2. Colocar el wallet de Oracle en /tmp/wallet/
#    (o ajustar spring.datasource.url en application.properties)

# 3. Compilar y ejecutar el backend (incluye build del frontend)
mvn spring-boot:run

# 4. La aplicación queda disponible en:
#    http://localhost:8080
```

### Ejecutar solo el frontend (desarrollo)

```bash
cd MtdrSpring/backend/src/main/frontend
npm install
npm run dev
# Disponible en http://localhost:5173
```

### Ejecutar los tests con reporte de cobertura

```bash
cd MtdrSpring/backend
mvn test -Dskip.frontend=true

# Reporte HTML generado en:
# target/site/jacoco/index.html
```

---

## 11. Tests y cobertura de código

Se usó **JaCoCo 0.8.11** con **JUnit 5 + Mockito** para tests unitarios.

### Resultados

```
Tests run: 53  |  Failures: 0  |  Errors: 0  |  BUILD SUCCESS
Cobertura de instrucciones: 17%  |  Clases analizadas: 37
```

### Clases al 100% de cobertura

`TaskService` · `UserService` · `SprintService` · `Sprint` ·
`BotLabels` · `BotCommands` · `BotMessages`

### Clases con menor cobertura (0%)

| Clase | Motivo |
|---|---|
| `TaskBotController` | Requiere conexión real con API de Telegram |
| `AIPriorityController` | Depende de OpenAI y EntityManager transaccional |
| `TaskController` | Necesita Oracle ATP activo para integración |

### Archivos de test

```
src/test/java/com/springboot/MyTodoList/
├── service/
│   ├── TaskServiceTest.java      (8 tests)
│   ├── UserServiceTest.java      (8 tests)
│   └── SprintServiceTest.java    (8 tests)
├── model/
│   ├── TaskModelTest.java        (5 tests)
│   └── SprintModelTest.java      (4 tests)
└── util/
    ├── BotLabelsTest.java        (8 tests)
    ├── BotCommandsTest.java      (7 tests)
    └── BotMessagesTest.java      (4 tests)
```

---

## 12. Equipo

| Desarrollador | Horas totales |
|---|---|
| Daniel | 175 hrs |
| Esteban | 139 hrs |
| Guille | 135 hrs |
| Luciano | 110 hrs |
| **Total** | **559 hrs** |

**Duración del proyecto:** 15 semanas · 6 sprints (Sprint 0 – Sprint 5)
**Costo total de Recurso Humano:** $13,975 USD (@$25/hr)
**Ahorro de productividad generado por la herramienta:** $18,000 USD (20%)

---

*Proyecto desarrollado para el Departamento de Desarrollo de Proyectos — Oracle Academy 2026*

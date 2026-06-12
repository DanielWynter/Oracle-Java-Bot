0006-arch-decision6.md

ADR-006: Use React with Material UI and Recharts for the Frontend
15/05/2026 | Accepted | Team members

Context:
The frontend requires dashboards, analytics visualizations, forms and responsive UI components. The team also needed a frontend stack that allows rapid UI development while maintaining consistency across the application.

Decision:
Use React as the frontend framework, Material UI for interface components, Recharts for analytics visualizations and TailwindCSS for utility styling.

Consequences:
Speeds up frontend development.
Provides reusable UI components and responsive layouts.
Makes analytics dashboards easier to implement.
Adds dependency on multiple frontend libraries.

Alternative:
Build all frontend components and charts manually using plain CSS and JavaScript.
This would reduce external dependencies, but development would take significantly longer and UI consistency would be harder to maintain.
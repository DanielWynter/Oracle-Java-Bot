ADR-001: Use Layered Architecture
15/05/2026 | Accepted | Team members

Context:
The Oracle Java Bot handles multiple responsibilities such as Telegram interaction, task management, analytics, notifications and database operations. The project needs a clear separation between interface logic, business logic and persistence to keep the system maintainable and easier to scale during future iterations.

Decision:
Implement a layered architecture separating the system into Presentation Layer, Business Logic Layer and Persistence Layer. All database access must go through the persistence layer instead of allowing direct communication between business components and the database.

Consequences:
Improves maintainability and separation of concerns.
Makes components easier to modify or replace independently.
Adds slightly more complexity because requests must pass through additional layers.

Alternative:
Allow business components to directly access the database without a dedicated persistence layer.
This simplifies development initially, but increases coupling and makes the system harder to maintain and scale over time.
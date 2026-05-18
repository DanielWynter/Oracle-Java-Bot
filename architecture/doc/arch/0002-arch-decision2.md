ADR-002: Use Modular Component-Based Architecture  
15/05/2026 | Accepted | Team members

Context:  
The Oracle Java Bot is command driven and supports different user actions such as task tracking, deployment requests, report generation and repository notifications. These features involve different responsibilities and external integrations.

Decision:  
Partition the system into cohesive modules based on actors and actions. Components such as ActivityLogger, TaskManager, DeploymentManager, ReportGenerator and Notifier will operate independently while communicating through clearly defined interfaces.

Consequences:  
Improves modularity and organization of the system.  
Makes testing and future feature expansion easier.  
Allows individual components to evolve independently.  
Requires more planning for communication between modules.

Alternative:  
Implement the entire application as a single monolithic module with shared logic and responsibilities.  
This reduces initial setup complexity, but makes the project harder to maintain, extend and debug as the application grows.
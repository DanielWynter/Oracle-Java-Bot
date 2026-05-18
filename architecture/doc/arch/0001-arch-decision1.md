ADR-001: Use Monolithic Spring Boot Architecture  
18/05/2026 | Accepted | Team members

Context:  
The project combines several features such as task management, Telegram bot integration, AI-based task analysis, analytics and database access. Since the team is still developing the platform and the application is not extremely large yet, we needed an architecture that was easier to develop, test and deploy.

Decision:  
Use a monolithic Spring Boot application where the REST API, Telegram bot logic, AI integrations and database access are all part of the same deployable application. The frontend is developed separately in React, but it gets bundled into the same Spring Boot application during deployment.

Consequences:  
Simplifies deployment because only one application needs to be executed.  
Makes development easier since all business logic stays in one place.  
Reduces infrastructure complexity during early development stages.  
Can become harder to scale independently if the system grows too much in the future.

Alternative:  
Split the application into multiple microservices for task management, analytics, notifications and AI integrations.  
This would improve scalability and service isolation, but would add significantly more complexity for communication, deployment and infrastructure management.
0004-arch-decision4.md

ADR-004: Use OpenAI GPT-4o-mini for Task Intelligence
15/05/2026 | Accepted | Team members

Context:
The project includes AI-assisted task management features such as automatic priority suggestions, estimated hours and task classification. The system needed a fast and easy-to-integrate AI service that could be connected directly into the task creation workflow.

Decision:
Use OpenAI GPT-4o-mini to process task descriptions and generate suggested priorities, task types and estimated completion hours.

Consequences:
Improves task organization and automation.
Provides smarter task creation workflows for users.
Adds dependency on an external AI API and usage costs.
Requires internet connectivity for AI-assisted features.

Alternative:
Implement manual task classification without AI support.
This would remove external dependencies, but task management would become slower and less automated for users.
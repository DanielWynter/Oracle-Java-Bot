0007-arch-decision7.md

ADR-007: Maintain Dual Frontend Build Support During Migration
15/05/2026 | Accepted | Team members

Context:
The frontend currently contains both react-scripts and Vite configurations. The project appears to be transitioning from Create React App to Vite for faster development and build performance.

Decision:
Temporarily maintain support for both React Scripts and Vite during the migration process.

Consequences:
Allows gradual migration without breaking the frontend.
Lets the team continue development while transitioning build systems.
Adds temporary build configuration complexity.

Alternative:
Completely replace the old frontend build setup immediately.
This would simplify configuration faster, but risks breaking the frontend during migration.
0008-arch-decision8.md

ADR-008: Use Terraform for Infrastructure Provisioning
15/05/2026 | Accepted | Team members

Context:
The project infrastructure is deployed on Oracle Cloud Infrastructure and may require reproducible environments for development and deployment. Manual infrastructure configuration could lead to inconsistencies between environments.

Decision:
Use Terraform to provision and manage Oracle Cloud infrastructure resources.

Consequences:
Makes infrastructure reproducible and easier to maintain.
Reduces manual cloud configuration errors.
Improves deployment consistency between environments.
Requires learning and maintaining infrastructure-as-code configuration files.

Alternative:
Configure infrastructure manually through the Oracle Cloud console.
This would simplify initial setup, but increases the risk of inconsistent environments and manual configuration mistakes.
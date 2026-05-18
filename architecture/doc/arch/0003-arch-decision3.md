ADR-003: Use Telegram Long-Polling Instead of Webhooks  
15/05/2026 | Accepted | Team members

Context:  
The Oracle Java Bot needs to receive Telegram updates continuously during development and testing. Since the project is developed locally most of the time, exposing a public HTTPS endpoint for Telegram webhooks would complicate local development and testing.

Decision:  
Use Telegram long-polling through SpringLongPollingBot instead of Telegram webhooks.

Consequences:  
Simplifies local development because no public HTTPS endpoint is required.  
Makes testing easier during development.  
Slightly increases resource usage because the bot continuously polls Telegram servers for updates.

Alternative:  
Use Telegram webhooks with a public HTTPS endpoint.  
This would reduce polling overhead, but would require additional infrastructure, HTTPS certificates and public server exposure during development.
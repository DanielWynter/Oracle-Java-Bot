ADR-002: Use Telegram Long-Polling Instead of Webhooks  
18/05/2026 | Accepted | Team members

Context:  
The Oracle Java Bot needs to receive Telegram messages and commands from developers and managers. During development, the application is usually executed locally and does not always have a public HTTPS endpoint available.

Decision:  
Implement the Telegram bot using long-polling through SpringLongPollingBot instead of using Telegram webhooks. The bot continuously checks for new updates directly from Telegram servers.

Consequences:  
Simplifies local development and testing because no public server or HTTPS configuration is required.  
Makes the bot easier to execute during development stages.  
Slightly less efficient than webhooks because the application constantly polls Telegram for updates.

Alternative:  
Use Telegram webhooks with a public HTTPS endpoint.  
This would be more efficient in production environments, but would require additional infrastructure, SSL certificates and public network configuration even during local development.
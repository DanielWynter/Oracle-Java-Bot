workspace {
    name "Oracle Java Bot - Architecture (C4)"
    description "Structurizr DSL model for the Oracle Java Bot system using the C4 model. Includes System Landscape, System Context, Container, Component, Deployment and Dynamic views." 

    model {
        /* People / Actors */
        developer = person "Developer" "Writes code and logs tasks via Telegram"
        manager = person "Manager" "Team manager who reviews reports and status"

        /* External systems */
        jira = softwareSystem "Jira API" "Issue tracking system (external)"
        github = softwareSystem "GitHub API" "Source code hosting API (external)"
        cicd = softwareSystem "CI/CD Pipeline" "Continuous integration and delivery system (external)"
        telegram = softwareSystem "Telegram Cloud" "Telegram messaging platform (cloud)"
        gitSystem = softwareSystem "Git Repository / CI System" "Git repository and CI tooling (represents repo + pipeline)"

        /* Main system with nested containers and components (DSL-friendly) */
        oracleBot = softwareSystem "Oracle Java Bot" "Main system that manages tasks, deployments and reports for Java projects (C4 modeled)" {
            telegramBot = container "Telegram Bot Interface" "Node.js / Bot API" "Receives messages from Telegram and forwards them to the core services; returns confirmations to users."
            core = container "Core Business Services" "Java / Spring Boot" "Core layered services: business logic and orchestration (contains components)." {
                activityLogger = component "ActivityLogger" "Logs developer and system activity into the Oracle Database." "Java service"
                taskManager = component "TaskManager" "Handles task creation, update, synchronization with Jira and business logic." "Java service"
                deploymentManager = component "DeploymentManager" "Coordinates deployments and integration with GitHub and CI/CD." "Java service"
                reportGenerator = component "ReportGenerator" "Produces reports and orchestrates analytics queries." "Java service"
                notifier = component "Notifier" "Sends notifications to users (via Telegram and other channels)." "Java service"
            }
            analytics = container "Analytics Service" "Python / Flask" "Processes analytics, aggregates metrics and generates data for reports."
            db = container "Oracle Database" "Oracle DB" "Primary relational datastore for tasks, activities and reports."
            integrations = container "External Integrations" "Adapter layer" "Adapters for third-party APIs (Jira, GitHub, CI/CD)."
        }

        /* Relationships: actors -> system/containers/components */
        developer -> telegramBot "Sends task or command via Telegram" "Telegram Bot API"
        manager -> oracleBot "Views reports and status" "Web UI / Telegram"

        telegram -> telegramBot "Delivers messages to the bot" "Telegram Bot API"

        telegramBot -> taskManager "Forwards incoming task payloads" "HTTPS/JSON"
        telegramBot -> notifier "Receives outgoing notifications to send" "HTTP/JSON"

        taskManager -> jira "Creates / updates issues" "REST API"
        taskManager -> activityLogger "Records task-related events" "in-process call"
        taskManager -> db "Reads/writes task metadata" "JDBC"

        deploymentManager -> github "Interacts with repo to trigger deployments" "REST API"
        deploymentManager -> cicd "Triggers CI/CD pipelines" "Webhook / REST API"
        deploymentManager -> db "Stores deployment records" "JDBC"

        activityLogger -> db "Persists activity logs" "JDBC"
        reportGenerator -> analytics "Requests aggregated metrics" "HTTP/JSON"
        analytics -> db "Reads analytics data" "JDBC"

        notifier -> telegramBot "Sends messages to be delivered to users" "HTTP/JSON"
        notifier -> developer "Sends notifications" "Telegram"
        notifier -> manager "Sends notifications" "Telegram / Email"

        integrations -> jira "Adapter to Jira API" "REST API"
        integrations -> github "Adapter to GitHub API" "REST API"
        integrations -> cicd "Adapter to CI/CD" "REST API / Webhooks"

        /* Additional model relationships used by the dynamic scenario */
        jira -> taskManager "Returns issue creation result" "REST API"
        db -> taskManager "Acknowledges persistence" "JDBC"
        taskManager -> telegramBot "Sends confirmation payload" "HTTPS/JSON"
        telegramBot -> developer "Delivers confirmation message" "Telegram Bot API"

        /* Tags (optional) - removed addTags calls to keep DSL compatibility; add tags inside declarations if needed */

        /* Deployment nodes removed temporarily to allow export; add later if needed */
    }

    views {
        /* System Landscape */
        systemLandscape {
            include *
            autolayout lr
            description "System Landscape: all systems and people relevant to Oracle Java Bot."
        }

        /* System Context for Oracle Java Bot */
        systemContext oracleBot {
            include oracleBot
            include developer
            include manager
            include telegram
            include jira
            include github
            include cicd
            include gitSystem
            autolayout lr
            description "System Context: shows how the Oracle Java Bot fits into the wider environment."
        }

        /* Container view for Oracle Java Bot */
        container oracleBot {
            include *
            autolayout lr
            description "Container diagram: shows containers inside Oracle Java Bot and relationships to users and external systems."
        }

        /* Component view for Core Business Services */
        component core {
            include *
            autolayout lr
            description "Component diagram: internal components of the Core Business Services container."
        }

        /* Deployment view (removed temporarily to allow export; can be re-added with a declared environment) */

        /* Dynamic diagram modelling the use case: Developer logs a task through Telegram */
          dynamic core {
              title "Developer logs a task via Telegram"
              description "Sequence: Developer -> Telegram Bot -> TaskManager -> Jira API -> Oracle Database -> Response back to Developer"

            developer -> telegramBot "Sends 'create task' message" "Telegram Bot API"
            telegramBot -> taskManager "Forwards task payload" "HTTPS/JSON"
            taskManager -> jira "Creates issue in Jira" "REST API"
            jira -> taskManager "Returns issue creation result" "REST API"
            taskManager -> db "Persists canonical task data" "JDBC"
            db -> taskManager "Acknowledges persistence" "JDBC"
            taskManager -> telegramBot "Sends confirmation payload" "HTTPS/JSON"
            telegramBot -> developer "Delivers confirmation message" "Telegram Bot API"
        }

        styles {
            element "Person" {
                shape person
            }
            element "Software System" {
                shape roundedBox
            }
            element "Container" {
                shape component
            }
            element "Component" {
                shape hexagon
            }
            element "Database" {
                shape cylinder
            }
        }
    }

}
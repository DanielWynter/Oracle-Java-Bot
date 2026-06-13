workspace {

    name "Oracle Java Bot - C4 Architecture Model"
    description "Architecture model for the Oracle Java Bot project using Structurizr DSL and the C4 model."

    model {

        /*
         * PEOPLE
         */

        developer = person "Developer" "Developer that uses the bot to manage tasks, deployments and daily activity through Telegram."

        manager = person "Manager" "Manager that monitors sprint progress, productivity and team reports."

        devTeam = person "Development Team" "Team responsible for software development activities."

        management = person "Management Team" "Team responsible for monitoring productivity and project progress."


        /*
         * EXTERNAL SYSTEMS
         */

        telegram = softwareSystem "Telegram Cloud" "Telegram messaging platform."

        jira = softwareSystem "Jira" "Platform used for project and sprint management."

        github = softwareSystem "GitHub" "Repository and source code platform."

        cicd = softwareSystem "CI/CD Platform" "Testing and deployment services."

        oci = softwareSystem "Oracle Cloud Infrastructure" "Cloud platform hosting the application infrastructure."

        reporting = softwareSystem "Reporting Services" "External reporting and analytics services used by the organization."


        /*
         * MAIN SYSTEM
         */

        oracleBot = softwareSystem "Oracle Java Bot" "Productivity and project management assistant for development teams." {

            /*
             * CONTAINERS
             */

            telegramBot = container "Telegram Bot Interface" "Node.js" "Receives Telegram commands and returns responses to users."

            core = container "Core Business Services" "Java / Spring Boot" "Handles the main business logic of the system." {

                commandProcessor = component "CommandProcessor" "Processes Telegram commands and routes them to the correct service." "Spring Component"

                taskManager = component "TaskManager" "Handles tasks, sprint assignments and Jira synchronization." "Spring Service"

                deploymentManager = component "DeploymentManager" "Handles deployment and testing requests." "Spring Service"

                activityLogger = component "ActivityLogger" "Stores developer activity and task history." "Spring Service"

                reportGenerator = component "ReportGenerator" "Generates productivity and sprint reports." "Spring Service"

                notifier = component "Notifier" "Sends alerts and notifications to Telegram users." "Spring Service"
            }

            analytics = container "Analytics Service" "Python / Flask" "Processes analytics and productivity metrics."

            integrations = container "External Integrations Service" "Java Adapters" "Handles integrations with Jira, GitHub and CI/CD services."

            db = container "Oracle Database" "Oracle Database" "Stores users, teams, projects, sprints, tasks, logs and analytics." {
                tags "Database"
            }


            /*
             * RELATIONSHIPS
             */

            developer -> telegramBot "Uses Telegram commands"

            manager -> telegramBot "Requests reports and sprint status"

            telegram -> telegramBot "Delivers Telegram messages"

            telegramBot -> core "Sends commands"

            core -> db "Reads and writes data"

            core -> analytics "Requests analytics"

            core -> integrations "Uses external integrations"

            integrations -> jira "Synchronizes tasks and sprints"

            integrations -> github "Retrieves repository activity"

            integrations -> cicd "Triggers deployments and testing"

            analytics -> db "Reads analytics data"


            /*
             * COMPONENT RELATIONSHIPS
             */

            commandProcessor -> taskManager "Routes task commands"

            taskManager -> notifier "Requests confirmation notification"

            commandProcessor -> deploymentManager "Routes deployment requests"

            commandProcessor -> reportGenerator "Routes report requests"

            taskManager -> activityLogger "Stores activity"

            taskManager -> integrations "Synchronizes Jira issues"

            deploymentManager -> integrations "Triggers CI/CD workflows"

            reportGenerator -> analytics "Requests analytics metrics"

            activityLogger -> db "Stores activity logs"

            taskManager -> db "Stores task and sprint data"

            deploymentManager -> db "Stores deployment history"

            reportGenerator -> db "Reads report data"

            notifier -> telegramBot "Sends notifications"

            telegramBot -> commandProcessor "Processes command"
        }


        /*
         * ENTERPRISE RELATIONSHIPS
         */

        devTeam -> oracleBot "Uses the platform for development workflow"

        management -> oracleBot "Monitors project productivity"

        oracleBot -> oci "Runs on cloud infrastructure"

        oracleBot -> reporting "Exports productivity metrics"



        /*
         * DEPLOYMENT MODEL
         */

        production = deploymentEnvironment "Production" {

            cloud = deploymentNode "Oracle Cloud Infrastructure" "Cloud Platform" {

                webServer = deploymentNode "Application Server" "Linux VM" {
                    containerInstance telegramBot
                    containerInstance core
                }

                analyticsNode = deploymentNode "Analytics Server" "Linux VM" {
                    containerInstance analytics
                }

                integrationNode = deploymentNode "Integration Server" "Linux VM" {
                    containerInstance integrations
                }

                databaseNode = deploymentNode "Oracle DB Server" "Oracle Database Server" {
                    containerInstance db
                }
            }
        }
    }


    /*
     * VIEWS
     */

    views {

        /*
         * SYSTEM LANDSCAPE
         */

        systemLandscape {

            include devTeam
            include management

            include oracleBot

            include telegram
            include jira
            include github
            include cicd
            include oci
            include reporting

            autolayout lr

            description "Enterprise-level view showing the Oracle Java Bot ecosystem and related systems."
        }


        /*
         * SYSTEM CONTEXT
         */

        systemContext oracleBot {

            include developer
            include manager

            include oracleBot

            include telegram
            include jira
            include github
            include cicd

            autolayout lr

            description "Shows how users and external systems interact with Oracle Java Bot."
        }


        /*
         * CONTAINER VIEW
         */

        container oracleBot {

            include *

            autolayout lr

            description "Shows the main containers, database and integrations inside the system."
        }


        /*
         * COMPONENT VIEW
         */

        component core {

            include *

            autolayout lr

            description "Shows the internal components of the Core Business Services container."
        }


        /*
         * DEPLOYMENT VIEW
         */

        deployment oracleBot production {

            include *

            autolayout lr

            description "Shows how the application is deployed in the production environment."
        }


        /*
         * DYNAMIC VIEW
         */

        dynamic core {

            title "Developer creates a task through Telegram"

            description "Flow showing task creation and Jira synchronization."

            developer -> telegramBot "Sends /createTask command"

            telegramBot -> commandProcessor "Processes command"

            commandProcessor -> taskManager "Validates request"

            taskManager -> integrations "Requests Jira issue creation"

            integrations -> jira "Creates Jira issue"

            jira -> integrations "Returns issue ID"

            taskManager -> db "Stores task data"

            taskManager -> activityLogger "Stores activity log"

            activityLogger -> db "Persists logs"

            taskManager -> notifier "Requests notification"

            notifier -> telegramBot "Sends confirmation"

            telegramBot -> developer "Returns confirmation"
        }


        /*
         * STYLES
         */

        styles {

            element "Person" {
                shape person
                background #08427b
                color #ffffff
            }

            element "Software System" {
                shape roundedbox
                background #1168bd
                color #ffffff
            }

            element "Container" {
                shape roundedbox
                background #438dd5
                color #ffffff
            }

            element "Component" {
                shape hexagon
                background #85bbf0
                color #000000
            }

            element "Database" {
                shape cylinder
                background #ffcc66
                color #000000
            }
        }
    }
}
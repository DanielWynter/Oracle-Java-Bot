Create a complete professional web application frontend design for a SaaS productivity management platform called "Oracle Dev Productivity Portal".

The system is a cloud-native project management and productivity intelligence dashboard used by software development teams and managers.

This is NOT a simple CRUD interface. It must look like an enterprise-level SaaS product similar to Jira, Linear, or modern Oracle Cloud dashboards.

Design Requirements:

GENERAL STYLE:
- Modern, clean, corporate
- Inspired by Oracle design system
- Minimalist but powerful
- Strong hierarchy and spacing
- Professional typography
- Subtle shadows
- Soft rounded corners (8px–12px)
- Responsive design (desktop-first, tablet support)

COLOR PALETTE (Oracle-inspired modern theme):
Primary Red: #C74634
Dark Red: #9E2A1F
Accent Orange: #FF6B35
Background Light: #F7F8FA
Background White: #FFFFFF
Dark Text: #1A1A1A
Muted Text: #6B7280
Border/Subtle Gray: #E5E7EB
Success: #16A34A
Warning: #F59E0B
Danger: #DC2626
Info Blue: #2563EB

Use red only for primary actions and highlights, not everywhere.
The UI must feel balanced and not aggressive.

--------------------------------------------------

APPLICATION STRUCTURE:

1) AUTHENTICATION SCREENS

Design:
- Login page
- Modern card centered layout
- Logo area
- Email + password fields
- Role selector (Manager / Developer)
- Primary red login button
- Subtle background gradient
- Clean error states
- Loading state
- Password visibility toggle

--------------------------------------------------

2) MAIN APP LAYOUT (After Login)

Create a professional SaaS layout with:

- Fixed left sidebar
- Top navbar
- Main content area

SIDEBAR:
- Logo at top
- Navigation items with icons:
    - Dashboard
    - Sprints
    - Tasks
    - Team
    - Reports
    - Settings
- Active state highlight (red accent bar)
- Hover states
- Collapsible version

TOP NAVBAR:
- Current Sprint Indicator
- Global Search
- Notifications icon
- User profile dropdown
- Logout button

--------------------------------------------------

3) DASHBOARD PAGE (Core Intelligence View)

This must be the strongest page visually.

Include:

Top KPI Cards (4-6 cards):
- Sprint Completion %
- Total Tasks
- Completed Tasks
- Overdue Tasks
- Velocity
- Avg Estimation Accuracy %

Each card:
- Icon
- Large metric number
- Small description
- Trend indicator (up/down arrow)
- Subtle shadow

Charts Section:
- Burndown Chart (Line chart)
- Team Velocity Chart (Bar chart)
- Estimation vs Real Time Comparison (Grouped bar chart)
- Tasks by Type (Donut chart)

Team Workload Section:
- Horizontal bar per developer
- Color-coded load level

Recent Activity Feed:
- Task completed
- Task assigned
- Sprint started

--------------------------------------------------

4) TASK MANAGEMENT PAGE

Professional table layout with:

- Filters (status, sprint, developer, type)
- Search bar
- Status badges:
    - To Do (gray)
    - In Progress (blue)
    - Done (green)
    - Blocked (red)
- Task Type badges:
    - Feature
    - Bug
    - Issue
- Estimation column
- Real time column
- Deviation indicator
- Row hover effect
- Click to open slide-over panel

Task Details Panel:
- Title
- Description
- Assigned developer
- Status dropdown
- Estimation input
- Real time input
- Activity log
- Comments section

--------------------------------------------------

5) SPRINT MANAGEMENT PAGE

- Sprint selector dropdown
- Sprint timeline
- Progress bar
- Burndown chart
- Sprint metrics summary
- Sprint comparison cards

--------------------------------------------------

6) TEAM PAGE

- Developer cards grid
- Avatar
- Role
- Current sprint workload
- Productivity score
- Tasks completed
- Estimation accuracy
- Click to open detailed developer view

--------------------------------------------------

7) REPORTS PAGE

Enterprise analytics layout:

- Filters by date range
- Productivity trends line chart
- Individual performance comparison
- Team performance heatmap
- Export to PDF button
- Export to CSV button

--------------------------------------------------

8) SETTINGS PAGE

- Profile settings
- Notification preferences
- Theme toggle (light/dark mode)
- Role management

--------------------------------------------------

UX REQUIREMENTS:

- Include loading states
- Include empty states
- Include error states
- Include hover interactions
- Include subtle animations
- Responsive layout grid
- Professional spacing system (8px scale)
- Clear typography hierarchy

--------------------------------------------------

TECHNICAL SPECIFICATION FOR EXPORT:

Structure it as if it will be implemented using:

- React
- TypeScript
- Component-based architecture
- Reusable components (Cards, Tables, Charts, Buttons, Badges, Modals)
- Clean layout separation
- Dashboard widgets modular

Name components clearly:
- Sidebar
- Navbar
- KPIWidget
- BurndownChart
- TaskTable
- DeveloperCard
- SprintOverview
- ReportsAnalytics

--------------------------------------------------

FINAL GOAL:

The final design must look like a real enterprise cloud product ready for production deployment in Oracle Cloud Infrastructure.

It must feel powerful, intelligent, modern, and executive-level.

Avoid childish UI.
Avoid overuse of red.
Avoid clutter.

This is a productivity intelligence system, not a school project.
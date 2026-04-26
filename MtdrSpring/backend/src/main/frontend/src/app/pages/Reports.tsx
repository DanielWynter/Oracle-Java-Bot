import { useEffect, useState } from "react";
import { Download, FileText, Calendar } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useSprint } from "../context/SprintContext.tsx";

interface TaskRaw {
  taskId: number;
  taskName: string;
  status: string;
  hours: number;
  totalTime: number;
  createdAt: string;
  sprint: { sprintId: number; sprintName: string } | null;
  assignee: { userId: number; username: string } | null;
}

interface UserRaw {
  userId: number;
  username: string;
}

const isDone = (s: string) =>
  ["done", "completed", "finished"].includes(s?.toLowerCase() ?? "");

function filterByRange(tasks: TaskRaw[], range: string): TaskRaw[] {
  if (range === "all") return tasks;
  const now = new Date();
  const cutoff = new Date();
  if (range === "last-7-days") cutoff.setDate(now.getDate() - 7);
  else if (range === "last-30-days") cutoff.setDate(now.getDate() - 30);
  else if (range === "last-quarter") cutoff.setMonth(now.getMonth() - 3);
  else if (range === "last-year") cutoff.setFullYear(now.getFullYear() - 1);
  else return tasks;
  return tasks.filter((t) => t.createdAt && new Date(t.createdAt) >= cutoff);
}

function computeAccuracy(tasks: TaskRaw[]): number {
  const valid = tasks.filter(
    (t) => isDone(t.status) && (t.hours || 0) > 0 && (t.totalTime || 0) > 0
  );
  if (!valid.length) return 0;
  return Math.round(
    (valid.reduce(
      (s, t) => s + Math.max(0, 1 - Math.abs(t.totalTime - t.hours) / t.hours),
      0
    ) /
      valid.length) *
      100
  );
}

function exportCSV(tasks: TaskRaw[]) {
  const headers = ["ID", "Name", "Status", "Assignee", "Sprint", "Estimated (h)", "Actual (h)"];
  const rows = tasks.map((t) => [
    t.taskId,
    `"${(t.taskName ?? "").replace(/"/g, '""')}"`,
    t.status,
    t.assignee?.username ?? "Unassigned",
    t.sprint?.sprintName ?? "No Sprint",
    t.hours ?? 0,
    t.totalTime ?? 0,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `report_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const { sprints, selectedSprintId } = useSprint();
  const [allTasks, setAllTasks] = useState<TaskRaw[]>([]);
  const [users, setUsers] = useState<UserRaw[]>([]);
  const [dateRange, setDateRange] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/tasks").then((r) => r.json()),
      fetch("/api/users").then((r) => r.json()),
    ])
      .then(([t, u]) => { setAllTasks(t); setUsers(u); })
      .finally(() => setLoading(false));
  }, []);

  // Apply filters
  const byDate = filterByRange(allTasks, dateRange);
  const filtered = selectedSprintId
    ? byDate.filter((t) => t.sprint?.sprintId === selectedSprintId)
    : byDate;

  // Summary metrics
  const totalDone = filtered.filter((t) => isDone(t.status)).length;
  const productivity = filtered.length > 0
    ? Math.round((totalDone / filtered.length) * 100) : 0;
  const accuracy = computeAccuracy(filtered);
  const sprintCount = new Set(filtered.map((t) => t.sprint?.sprintId).filter(Boolean)).size || 1;
  const avgVelocity = Math.round(
    filtered.filter((t) => isDone(t.status)).reduce((s, t) => s + (t.hours || 0), 0) / sprintCount
  );

  // Productivity Trends — per sprint (always all sprints for trend view)
  const sortedSprints = [...sprints].sort((a, b) => a.sprintId - b.sprintId);
  const trendData = sortedSprints.map((s) => {
    const st = allTasks.filter((t) => t.sprint?.sprintId === s.sprintId);
    const done = st.filter((t) => isDone(t.status));
    return {
      sprint: s.sprintName,
      productivity: st.length > 0 ? Math.round((done.length / st.length) * 100) : 0,
      tasks: done.length,
    };
  });

  // Weeks in the selected period (used for hours/week KPI)
  const weeksInPeriod = (() => {
    if (selectedSprintId) {
      const sp = sprints.find((s) => s.sprintId === selectedSprintId);
      if (sp) {
        const [sy, sm, sd] = sp.startDate.split("-").map(Number);
        const [ey, em, ed] = sp.endDate.split("-").map(Number);
        const days = Math.max(
          7,
          Math.ceil((new Date(ey, em - 1, ed).getTime() - new Date(sy, sm - 1, sd).getTime()) / 86_400_000)
        );
        return days / 7;
      }
    }
    if (dateRange === "last-7-days") return 1;
    if (dateRange === "last-30-days") return 30 / 7;
    if (dateRange === "last-quarter") return 13;
    if (dateRange === "last-year") return 52;
    // "all" — derive from earliest createdAt in the whole dataset
    const timestamps = allTasks.map((t) => t.createdAt).filter(Boolean).map((d) => new Date(d).getTime());
    if (!timestamps.length) return 1;
    const days = Math.max(7, (Date.now() - Math.min(...timestamps)) / 86_400_000);
    return days / 7;
  })();

  // Individual Performance — from filtered tasks
  const perfData = users
    .map((u) => {
      const ut = filtered.filter((t) => t.assignee?.userId === u.userId);
      const done = ut.filter((t) => isDone(t.status));
      const score = ut.length > 0 ? Math.round((done.length / ut.length) * 100) : 0;
      const hoursTotal = Math.round(ut.reduce((s, t) => s + (t.totalTime || 0), 0) * 10) / 10;
      const hoursPerWeek = Math.round((hoursTotal / weeksInPeriod) * 10) / 10;
      return { name: u.username, score, total: ut.length, hoursTotal, hoursPerWeek };
    })
    .filter((u) => u.total > 0)
    .sort((a, b) => b.score - a.score);

  const handleExportPDF = () => {
    const win = window.open("", "_blank");
    if (!win) return;

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Report — ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; padding: 32px; color: #1A1A1A; font-size: 13px; }
    h1 { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
    .subtitle { color: #6B7280; margin-bottom: 28px; font-size: 12px; }
    h2 { font-size: 14px; font-weight: 700; margin: 28px 0 12px; padding-bottom: 6px; border-bottom: 1px solid #E5E7EB; text-transform: uppercase; letter-spacing: 0.05em; color: #374151; }
    .cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 8px; }
    .card { border: 1px solid #E5E7EB; border-radius: 8px; padding: 14px 16px; }
    .card-value { font-size: 22px; font-weight: 700; margin-bottom: 3px; }
    .card-label { font-size: 11px; color: #6B7280; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 8px 12px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #6B7280; border-bottom: 2px solid #E5E7EB; font-weight: 600; }
    td { padding: 9px 12px; border-bottom: 1px solid #F3F4F6; }
    tr:last-child td { border-bottom: none; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 700; }
    .badge-active { background: #EFF6FF; color: #2563EB; }
    .badge-completed { background: #F0FDF4; color: #16A34A; }
    .perf-bar-bg { background: #F3F4F6; border-radius: 9999px; height: 6px; margin-top: 3px; }
    .perf-bar { height: 6px; border-radius: 9999px; background: #C74634; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>Reports &amp; Analytics</h1>
  <p class="subtitle">Generated on ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} &nbsp;·&nbsp; ${filtered.length} task${filtered.length !== 1 ? "s" : ""} included</p>

  <h2>Summary</h2>
  <div class="cards">
    <div class="card"><div class="card-value">${productivity}%</div><div class="card-label">Avg Team Productivity</div></div>
    <div class="card"><div class="card-value">${totalDone}</div><div class="card-label">Tasks Completed</div></div>
    <div class="card"><div class="card-value">${accuracy > 0 ? `${accuracy}%` : "N/A"}</div><div class="card-label">Estimation Accuracy</div></div>
    <div class="card"><div class="card-value">${avgVelocity}h</div><div class="card-label">Avg Sprint Velocity</div></div>
  </div>

  <h2>Sprint Summary</h2>
  <table>
    <thead>
      <tr>
        <th>Sprint</th><th>Status</th><th>Total</th><th>Done</th><th>In Progress</th><th>Velocity</th><th>Est. Accuracy</th>
      </tr>
    </thead>
    <tbody>
      ${sprintSummary.map((s) => `
      <tr>
        <td style="font-weight:600">${s.name}</td>
        <td><span class="badge ${s.status?.toLowerCase() === "active" ? "badge-active" : "badge-completed"}">${s.status ?? "Unknown"}</span></td>
        <td>${s.total}</td>
        <td style="color:#16A34A;font-weight:600">${s.done}</td>
        <td style="color:#F59E0B;font-weight:600">${s.inProgress}</td>
        <td>${s.velocity}h</td>
        <td>${s.accuracy > 0 ? `${s.accuracy}%` : "N/A"}</td>
      </tr>`).join("")}
    </tbody>
  </table>

  ${perfData.length > 0 ? `
  <h2>Individual Performance</h2>
  <table>
    <thead><tr><th>Team Member</th><th>Tasks Total</th><th>Productivity Score</th><th>Total Hours</th><th>Avg hrs/Week</th></tr></thead>
    <tbody>
      ${perfData.map((p) => `
      <tr>
        <td style="font-weight:600">${p.name}</td>
        <td>${p.total}</td>
        <td>${p.score}%</td>
        <td>${p.hoursTotal}h</td>
        <td style="color:#2563EB;font-weight:600">${p.hoursPerWeek}h</td>
      </tr>`).join("")}
    </tbody>
  </table>` : ""}
</body>
</html>`;

    win.document.write(htmlContent);
    win.document.close();
    win.focus();
    win.print();
  };

  // Sprint summary table — all sprints
  const sprintSummary = sortedSprints.map((s) => {
    const st = allTasks.filter((t) => t.sprint?.sprintId === s.sprintId);
    const done = st.filter((t) => isDone(t.status));
    const inProg = st.filter((t) =>
      ["in-progress", "inprogress", "in progress"].includes(t.status?.toLowerCase() ?? "")
    );
    return {
      name: s.sprintName,
      status: s.status,
      total: st.length,
      done: done.length,
      inProgress: inProg.length,
      velocity: Math.round(done.reduce((sum, t) => sum + (t.hours || 0), 0)),
      accuracy: computeAccuracy(st),
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#1A1A1A] mb-2">
            Reports & Analytics
          </h1>
          <p className="text-[#6B7280]">Comprehensive team performance insights</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => exportCSV(filtered)}
            className="px-4 py-2 bg-white border border-[#E5E7EB] text-[#1A1A1A] rounded-lg hover:bg-[#F7F8FA] transition-colors flex items-center gap-2 shadow-sm"
          >
            <FileText className="w-5 h-5" />
            Export CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-[#C74634] text-white rounded-lg hover:bg-[#9E2A1F] transition-colors flex items-center gap-2 shadow-lg"
          >
            <Download className="w-5 h-5" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-sm">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-[#6B7280]" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="last-7-days">Last 7 Days</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="last-quarter">Last Quarter</option>
            <option value="last-year">Last Year</option>
          </select>
          <span className="text-sm text-[#6B7280]">
            Showing {filtered.length} task{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Avg Team Productivity", value: loading ? "—" : `${productivity}%` },
          { label: "Total Tasks Completed", value: loading ? "—" : `${totalDone}` },
          { label: "Estimation Accuracy", value: loading ? "—" : accuracy > 0 ? `${accuracy}%` : "N/A" },
          { label: "Avg Sprint Velocity", value: loading ? "—" : `${avgVelocity}h` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
            <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-1">{value}</h3>
            <p className="text-sm text-[#6B7280]">{label}</p>
          </div>
        ))}
      </div>

      {/* Productivity Trends */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
            Productivity Trends
          </h3>
          <p className="text-sm text-[#6B7280]">
            Completion rate and tasks done per sprint
          </p>
        </div>
        {loading ? (
          <div className="h-[350px] flex items-center justify-center text-[#6B7280] text-sm">Loading...</div>
        ) : trendData.length === 0 ? (
          <div className="h-[350px] flex items-center justify-center text-[#6B7280] text-sm">No sprint data</div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="sprint" stroke="#6B7280" style={{ fontSize: "12px" }} />
              <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "8px 12px" }}
              />
              <Legend />
              <Line type="monotone" dataKey="productivity" stroke="#C74634" strokeWidth={2}
                name="Productivity %" dot={{ fill: "#C74634", r: 4 }} />
              <Line type="monotone" dataKey="tasks" stroke="#2563EB" strokeWidth={2}
                name="Tasks Completed" dot={{ fill: "#2563EB", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Individual Performance */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
            Individual Performance
          </h3>
          <p className="text-sm text-[#6B7280]">
            Productivity score and hours worked per week per team member
          </p>
        </div>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center text-[#6B7280] text-sm">Loading...</div>
        ) : perfData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-[#6B7280] text-sm">
            No assigned tasks for this sprint
          </div>
        ) : (
          <>
            {/* Productivity Score chart */}
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
              Productivity Score (done / total assigned)
            </p>
            <ResponsiveContainer width="100%" height={Math.max(200, perfData.length * 52)}>
              <BarChart data={perfData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" domain={[0, 100]} stroke="#6B7280"
                  style={{ fontSize: "12px" }} unit="%" />
                <YAxis type="category" dataKey="name" stroke="#6B7280"
                  style={{ fontSize: "12px" }} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "8px 12px" }}
                  formatter={(v: number) => [`${v}%`, "Productivity"]}
                />
                <Bar dataKey="score" fill="#C74634" name="Productivity %" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>

            {/* Hours per Week chart */}
            <div className="mt-8 pt-6 border-t border-[#E5E7EB]">
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
                Avg Hours Worked / Week
              </p>
              {/* KPI summary row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {perfData.map((p) => (
                  <div key={p.name} className="bg-[#F7F8FA] rounded-lg p-3 border border-[#E5E7EB]">
                    <p className="text-xs text-[#6B7280] mb-1 truncate">{p.name}</p>
                    <p className="text-xl font-semibold text-[#2563EB]">{p.hoursPerWeek}h</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{p.hoursTotal}h total</p>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={Math.max(200, perfData.length * 52)}>
                <BarChart data={perfData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#6B7280" style={{ fontSize: "12px" }} unit="h" />
                  <YAxis type="category" dataKey="name" stroke="#6B7280"
                    style={{ fontSize: "12px" }} width={130} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "8px 12px" }}
                    formatter={(v: number) => [`${v}h`, "Avg hrs/week"]}
                  />
                  <Bar dataKey="hoursPerWeek" fill="#2563EB" name="Avg hrs/week" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>

      {/* Sprint Summary Table */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
            Sprint Summary
          </h3>
          <p className="text-sm text-[#6B7280]">Performance breakdown per sprint</p>
        </div>
        {loading ? (
          <div className="py-8 text-center text-[#6B7280] text-sm">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  {["Sprint", "Status", "Total", "Done", "In Progress", "Velocity", "Est. Accuracy"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sprintSummary.map((s) => (
                  <tr key={s.name} className="border-b border-[#F7F8FA] hover:bg-[#F7F8FA] transition-colors">
                    <td className="py-3 px-4 font-medium text-[#1A1A1A]">{s.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.status?.toLowerCase() === "active"
                          ? "bg-[#2563EB]/10 text-[#2563EB]"
                          : "bg-[#16A34A]/10 text-[#16A34A]"
                      }`}>
                        {s.status ?? "Unknown"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#6B7280]">{s.total}</td>
                    <td className="py-3 px-4 text-[#16A34A] font-medium">{s.done}</td>
                    <td className="py-3 px-4 text-[#F59E0B] font-medium">{s.inProgress}</td>
                    <td className="py-3 px-4 text-[#1A1A1A]">{s.velocity}h</td>
                    <td className="py-3 px-4 text-[#1A1A1A]">
                      {s.accuracy > 0 ? `${s.accuracy}%` : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

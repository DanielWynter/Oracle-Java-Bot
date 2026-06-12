import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

// ── Static data — edit here to update all charts and KPIs ────────────────────
const SPRINTS = [
  "Sprint 0", "Sprint 1", "Sprint 2",
  "Sprint 3", "Sprint 4", "Sprint 5",
];

const DEV_DATA: Record<string, { tasks: number[]; hours: number[]; color: string }> = {
  Daniel:  { tasks: [5, 4, 15, 7, 3, 3],  hours: [40, 15, 70, 20, 15, 15], color: "#3b82f6" },
  Guille:  { tasks: [4, 4, 12, 6, 3, 3],  hours: [22, 12, 56, 15, 15, 15], color: "#22a366" },
  Luciano: { tasks: [4, 5, 13, 6, 3, 3],  hours: [22, 12, 34, 12, 15, 15], color: "#e8910c" },
  Esteban: { tasks: [4, 4, 13, 7, 3, 3],  hours: [40, 12, 37, 20, 15, 15], color: "#8b3fe8" },
};

const DEV_NAMES = Object.keys(DEV_DATA);
// ─────────────────────────────────────────────────────────────────────────────

function calcMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    padding: "8px 12px",
  },
};

const SELECT_CLS =
  "text-sm border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#1A1A1A] bg-white " +
  "focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40 cursor-pointer";

export default function DevTaskAnalysis() {
  const [selectedDev, setSelectedDev] = useState("All Devs");
  const [selectedSprint, setSelectedSprint] = useState("All Sprints");

  const activeDev = useMemo(
    () => (selectedDev === "All Devs" ? DEV_NAMES : [selectedDev]),
    [selectedDev],
  );

  const activeSprintIndices = useMemo(
    () =>
      selectedSprint === "All Sprints"
        ? SPRINTS.map((_, i) => i)
        : [SPRINTS.indexOf(selectedSprint)],
    [selectedSprint],
  );

  const activeSprints = useMemo(
    () => activeSprintIndices.map((i) => SPRINTS[i]),
    [activeSprintIndices],
  );

  // Grouped bar data: one row per sprint, one numeric key per active dev
  const taskChartData = useMemo(
    () =>
      activeSprints.map((sprint, si) => {
        const idx = activeSprintIndices[si];
        const row: Record<string, number | string> = { sprint };
        activeDev.forEach((dev) => { row[dev] = DEV_DATA[dev].tasks[idx]; });
        return row;
      }),
    [activeDev, activeSprints, activeSprintIndices],
  );

  const hoursChartData = useMemo(
    () =>
      activeSprints.map((sprint, si) => {
        const idx = activeSprintIndices[si];
        const row: Record<string, number | string> = { sprint };
        activeDev.forEach((dev) => { row[dev] = DEV_DATA[dev].hours[idx]; });
        return row;
      }),
    [activeDev, activeSprints, activeSprintIndices],
  );

  // KPIs — always derived from active selection
  const kpis = useMemo(() => {
    const devTotals = activeDev.map((dev) => ({
      tasks: activeSprintIndices.reduce((s, i) => s + DEV_DATA[dev].tasks[i], 0),
      hours: activeSprintIndices.reduce((s, i) => s + DEV_DATA[dev].hours[i], 0),
    }));
    const n = activeDev.length;
    const completedTasks = devTotals.reduce((s, d) => s + d.tasks, 0);
    const totalHours     = devTotals.reduce((s, d) => s + d.hours, 0);
    return {
      completedTasks,
      totalHours,
      avgTask:     +(completedTasks / n).toFixed(2),
      avgHours:    +(totalHours / n).toFixed(2),
      medianTasks: calcMedian(devTotals.map((d) => d.tasks)),
      medianHours: calcMedian(devTotals.map((d) => d.hours)),
    };
  }, [activeDev, activeSprintIndices]);

  const kpiStrip = [
    { label: "Completed Tasks",  value: String(kpis.completedTasks) },
    { label: "Total Real Hours", value: `${kpis.totalHours}h` },
    { label: "Avg Task/Dev",     value: String(kpis.avgTask) },
    { label: "Avg Hours/Dev",    value: `${kpis.avgHours}h` },
    { label: "Median Task/Dev",  value: String(kpis.medianTasks) },
    { label: "Median Hours/Dev", value: `${kpis.medianHours}h` },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
      {/* ── Header + Filters ── */}
      <div className="px-6 pt-6 pb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
            Análisis de Tasks / Hours
          </h3>
          <p className="text-sm text-[#6B7280]">
            Tareas terminadas y horas reales por desarrollador y sprint
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedSprint}
            onChange={(e) => setSelectedSprint(e.target.value)}
            className={SELECT_CLS}
          >
            <option>All Sprints</option>
            {SPRINTS.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select
            value={selectedDev}
            onChange={(e) => setSelectedDev(e.target.value)}
            className={SELECT_CLS}
          >
            <option>All Devs</option>
            {DEV_NAMES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-[#E5E7EB] border-y border-[#E5E7EB]">
        {kpiStrip.map(({ label, value }) => (
          <div
            key={label}
            className="bg-white px-4 py-4 flex flex-col items-center justify-center text-center"
          >
            <span className="text-2xl font-semibold text-[#1A1A1A]">{value}</span>
            <span className="text-xs text-[#6B7280] mt-1 leading-tight">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#E5E7EB]">
        {/* Tasks */}
        <div className="p-6">
          <p className="text-sm font-medium text-[#1A1A1A] mb-4">
            Tasks Terminadas por Desarrollador / Sprint
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={taskChartData} barCategoryGap="22%" barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="sprint"
                stroke="#6B7280"
                style={{ fontSize: "11px" }}
                tick={{ fill: "#6B7280" }}
              />
              <YAxis
                stroke="#6B7280"
                style={{ fontSize: "11px" }}
                tick={{ fill: "#6B7280" }}
                label={{
                  value: "Tareas",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  style: { fontSize: "11px", fill: "#6B7280" },
                }}
              />
              <Tooltip {...TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
              {activeDev.map((dev) => (
                <Bar
                  key={dev}
                  dataKey={dev}
                  name={dev}
                  fill={DEV_DATA[dev].color}
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList
                    dataKey={dev}
                    position="top"
                    style={{ fontSize: "10px", fill: "#374151", fontWeight: 600 }}
                  />
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hours */}
        <div className="p-6">
          <p className="text-sm font-medium text-[#1A1A1A] mb-4">
            Horas Reales por Desarrollador / Sprint
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={hoursChartData} barCategoryGap="22%" barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="sprint"
                stroke="#6B7280"
                style={{ fontSize: "11px" }}
                tick={{ fill: "#6B7280" }}
              />
              <YAxis
                stroke="#6B7280"
                style={{ fontSize: "11px" }}
                tick={{ fill: "#6B7280" }}
                label={{
                  value: "hrs",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  style: { fontSize: "11px", fill: "#6B7280" },
                }}
              />
              <Tooltip
                {...TOOLTIP_STYLE}
                formatter={(v: number, name: string) => [`${v}h`, name]}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
              {activeDev.map((dev) => (
                <Bar
                  key={dev}
                  dataKey={dev}
                  name={dev}
                  fill={DEV_DATA[dev].color}
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList
                    dataKey={dev}
                    position="top"
                    formatter={(v: number) => `${v}h`}
                    style={{ fontSize: "10px", fill: "#374151", fontWeight: 600 }}
                  />
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

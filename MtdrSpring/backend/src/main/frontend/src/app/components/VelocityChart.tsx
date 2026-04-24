import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { sprint: "Sprint 18", velocity: 35 },
  { sprint: "Sprint 19", velocity: 38 },
  { sprint: "Sprint 20", velocity: 42 },
  { sprint: "Sprint 21", velocity: 40 },
  { sprint: "Sprint 22", velocity: 45 },
  { sprint: "Sprint 23", velocity: 43 },
  { sprint: "Sprint 24", velocity: 47 },
];

export default function VelocityChart() {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
          Team Velocity Trend
        </h3>
        <p className="text-sm text-[#6B7280]">
          Story points completed per sprint
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="sprint"
            stroke="#6B7280"
            style={{ fontSize: "12px" }}
          />
          <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "8px 12px",
            }}
          />
          <Legend />
          <Bar
            dataKey="velocity"
            fill="#2563EB"
            name="Velocity"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

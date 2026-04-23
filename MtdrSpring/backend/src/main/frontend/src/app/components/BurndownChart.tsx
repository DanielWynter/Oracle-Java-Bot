import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Day 1", ideal: 100, actual: 100 },
  { day: "Day 2", ideal: 90, actual: 92 },
  { day: "Day 3", ideal: 80, actual: 85 },
  { day: "Day 4", ideal: 70, actual: 78 },
  { day: "Day 5", ideal: 60, actual: 65 },
  { day: "Day 6", ideal: 50, actual: 52 },
  { day: "Day 7", ideal: 40, actual: 38 },
  { day: "Day 8", ideal: 30, actual: 28 },
  { day: "Day 9", ideal: 20, actual: 18 },
  { day: "Day 10", ideal: 10, actual: 8 },
  { day: "Day 11", ideal: 0, actual: 0 },
];

export default function BurndownChart() {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
          Sprint Burndown Chart
        </h3>
        <p className="text-sm text-[#6B7280]">
          Track remaining work vs ideal progress
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="day" stroke="#6B7280" style={{ fontSize: "12px" }} />
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
          <Line
            type="monotone"
            dataKey="ideal"
            stroke="#6B7280"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Ideal"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#C74634"
            strokeWidth={2}
            name="Actual"
            dot={{ fill: "#C74634", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

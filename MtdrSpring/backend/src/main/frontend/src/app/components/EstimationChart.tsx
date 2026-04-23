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
  { task: "Task 1", estimated: 8, actual: 7 },
  { task: "Task 2", estimated: 5, actual: 6 },
  { task: "Task 3", estimated: 13, actual: 12 },
  { task: "Task 4", estimated: 3, actual: 3 },
  { task: "Task 5", estimated: 8, actual: 10 },
  { task: "Task 6", estimated: 5, actual: 4 },
];

export default function EstimationChart() {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
          Estimation vs Actual Time
        </h3>
        <p className="text-sm text-[#6B7280]">
          Comparing estimated vs actual hours
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="task" stroke="#6B7280" style={{ fontSize: "12px" }} />
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
            dataKey="estimated"
            fill="#F59E0B"
            name="Estimated"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="actual"
            fill="#16A34A"
            name="Actual"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

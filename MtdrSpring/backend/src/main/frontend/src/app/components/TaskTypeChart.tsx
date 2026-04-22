import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Feature", value: 45 },
  { name: "Bug", value: 28 },
  { name: "Issue", value: 18 },
  { name: "Enhancement", value: 12 },
];

const COLORS = ["#C74634", "#2563EB", "#F59E0B", "#16A34A"];

export default function TaskTypeChart() {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
          Tasks by Type
        </h3>
        <p className="text-sm text-[#6B7280]">Distribution of task categories</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "8px 12px",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

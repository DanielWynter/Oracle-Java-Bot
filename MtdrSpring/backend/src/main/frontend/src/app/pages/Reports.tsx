import { useState } from "react";
import { Download, FileText, Calendar } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const productivityData = [
  { week: "Week 1", productivity: 85, tasks: 32 },
  { week: "Week 2", productivity: 88, tasks: 35 },
  { week: "Week 3", productivity: 82, tasks: 30 },
  { week: "Week 4", productivity: 90, tasks: 38 },
  { week: "Week 5", productivity: 87, tasks: 34 },
  { week: "Week 6", productivity: 92, tasks: 40 },
];

const performanceData = [
  { name: "Sarah Chen", score: 95 },
  { name: "David Kim", score: 92 },
  { name: "Emily Thompson", score: 90 },
  { name: "Robert Johnson", score: 89 },
  { name: "Michael Rodriguez", score: 88 },
  { name: "Jessica Martinez", score: 86 },
];

export default function Reports() {
  const [dateRange, setDateRange] = useState("last-30-days");

  const handleExportPDF = () => {
    alert("Exporting report as PDF...");
  };

  const handleExportCSV = () => {
    alert("Exporting report as CSV...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#1A1A1A] mb-2">
            Reports & Analytics
          </h1>
          <p className="text-[#6B7280]">
            Comprehensive team performance insights
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
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
            <option value="last-7-days">Last 7 Days</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="last-quarter">Last Quarter</option>
            <option value="last-year">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-1">88%</h3>
          <p className="text-sm text-[#6B7280]">Avg Team Productivity</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-1">209</h3>
          <p className="text-sm text-[#6B7280]">Total Tasks Completed</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-1">89%</h3>
          <p className="text-sm text-[#6B7280]">Estimation Accuracy</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-1">42</h3>
          <p className="text-sm text-[#6B7280]">Avg Sprint Velocity</p>
        </div>
      </div>

      {/* Productivity Trends */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
            Productivity Trends
          </h3>
          <p className="text-sm text-[#6B7280]">
            Weekly productivity and task completion
          </p>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={productivityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="week" stroke="#6B7280" style={{ fontSize: "12px" }} />
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
              dataKey="productivity"
              stroke="#C74634"
              strokeWidth={2}
              name="Productivity %"
              dot={{ fill: "#C74634", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="tasks"
              stroke="#2563EB"
              strokeWidth={2}
              name="Tasks Completed"
              dot={{ fill: "#2563EB", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Individual Performance */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
            Individual Performance Comparison
          </h3>
          <p className="text-sm text-[#6B7280]">
            Team member productivity scores
          </p>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={performanceData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" stroke="#6B7280" style={{ fontSize: "12px" }} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
              width={150}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                padding: "8px 12px",
              }}
            />
            <Bar dataKey="score" fill="#C74634" name="Score" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Team Performance Heatmap */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
            Team Performance Heatmap
          </h3>
          <p className="text-sm text-[#6B7280]">
            Daily activity and task completion
          </p>
        </div>

        {/* Heatmap Grid */}
        <div className="space-y-2">
          <div className="flex gap-2 text-xs text-[#6B7280] mb-4">
            <div className="w-32" />
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
              <div key={day} className="flex-1 text-center">
                {day}
              </div>
            ))}
          </div>
          {["Week 1", "Week 2", "Week 3", "Week 4"].map((week, weekIdx) => (
            <div key={week} className="flex gap-2 items-center">
              <div className="w-32 text-sm text-[#6B7280]">{week}</div>
              {[85, 92, 78, 88, 95].map((intensity, dayIdx) => (
                <div
                  key={dayIdx}
                  className="flex-1 h-12 rounded-lg flex items-center justify-center text-sm font-medium transition-all hover:scale-105"
                  style={{
                    backgroundColor: `rgba(199, 70, 52, ${intensity / 100})`,
                    color: intensity > 50 ? "#FFFFFF" : "#1A1A1A",
                  }}
                >
                  {intensity}%
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-[#E5E7EB]">
          <span className="text-sm text-[#6B7280]">Low Activity</span>
          <div className="flex gap-1">
            {[20, 40, 60, 80, 100].map((opacity) => (
              <div
                key={opacity}
                className="w-8 h-8 rounded"
                style={{
                  backgroundColor: `rgba(199, 70, 52, ${opacity / 100})`,
                }}
              />
            ))}
          </div>
          <span className="text-sm text-[#6B7280]">High Activity</span>
        </div>
      </div>
    </div>
  );
}

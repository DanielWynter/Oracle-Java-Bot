import { useState } from "react";
import { Calendar, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const sprintData = [
  { id: "sprint-24", name: "Sprint 24", status: "active", progress: 78, startDate: "Feb 20", endDate: "Mar 6" },
  { id: "sprint-23", name: "Sprint 23", status: "completed", progress: 100, startDate: "Feb 6", endDate: "Feb 19" },
  { id: "sprint-22", name: "Sprint 22", status: "completed", progress: 100, startDate: "Jan 23", endDate: "Feb 5" },
];

const burndownData = [
  { day: "Day 1", remaining: 100 },
  { day: "Day 2", remaining: 92 },
  { day: "Day 3", remaining: 85 },
  { day: "Day 4", remaining: 78 },
  { day: "Day 5", remaining: 65 },
  { day: "Day 6", remaining: 52 },
  { day: "Day 7", remaining: 38 },
  { day: "Day 8", remaining: 28 },
];

export default function Sprints() {
  const [selectedSprint, setSelectedSprint] = useState(sprintData[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-[#1A1A1A] mb-2">
          Sprint Management
        </h1>
        <p className="text-[#6B7280]">Track and manage sprint progress</p>
      </div>

      {/* Sprint Selector */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
        <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
          Select Sprint
        </label>
        <select
          value={selectedSprint.id}
          onChange={(e) =>
            setSelectedSprint(
              sprintData.find((s) => s.id === e.target.value) || sprintData[0]
            )
          }
          className="w-full md:w-64 px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C74634] focus:border-transparent"
        >
          {sprintData.map((sprint) => (
            <option key={sprint.id} value={sprint.id}>
              {sprint.name} {sprint.status === "active" ? "(Active)" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Sprint Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#2563EB]" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-1">
            {selectedSprint.progress}%
          </h3>
          <p className="text-sm text-[#6B7280]">Sprint Progress</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#16A34A]/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#16A34A]" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-1">97/124</h3>
          <p className="text-sm text-[#6B7280]">Tasks Completed</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#FF6B35]" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-1">42</h3>
          <p className="text-sm text-[#6B7280]">Velocity Points</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#F59E0B]" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-1">5 days</h3>
          <p className="text-sm text-[#6B7280]">Days Remaining</p>
        </div>
      </div>

      {/* Sprint Timeline */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">
          Sprint Timeline
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Start Date</span>
            <span className="font-medium text-[#1A1A1A]">
              {selectedSprint.startDate}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">End Date</span>
            <span className="font-medium text-[#1A1A1A]">
              {selectedSprint.endDate}
            </span>
          </div>
          <div className="pt-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-[#6B7280]">Progress</span>
              <span className="font-medium text-[#C74634]">
                {selectedSprint.progress}%
              </span>
            </div>
            <div className="h-3 bg-[#F7F8FA] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C74634] rounded-full transition-all"
                style={{ width: `${selectedSprint.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Burndown Chart */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
            Sprint Burndown
          </h3>
          <p className="text-sm text-[#6B7280]">Remaining work over time</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={burndownData}>
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
            <Line
              type="monotone"
              dataKey="remaining"
              stroke="#C74634"
              strokeWidth={2}
              dot={{ fill: "#C74634", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sprint Comparison */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">
          Sprint Comparison
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sprintData.map((sprint) => (
            <div
              key={sprint.id}
              className="p-4 bg-[#F7F8FA] rounded-lg border border-[#E5E7EB]"
            >
              <h4 className="font-medium text-[#1A1A1A] mb-2">{sprint.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Status</span>
                  <span
                    className={`font-medium ${
                      sprint.status === "active"
                        ? "text-[#2563EB]"
                        : "text-[#16A34A]"
                    }`}
                  >
                    {sprint.status === "active" ? "Active" : "Completed"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Progress</span>
                  <span className="font-medium text-[#1A1A1A]">
                    {sprint.progress}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

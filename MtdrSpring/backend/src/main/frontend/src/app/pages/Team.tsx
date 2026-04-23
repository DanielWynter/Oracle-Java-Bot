import { useState } from "react";
import { Users, TrendingUp, Target, CheckCircle2 } from "lucide-react";

interface Developer {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  workload: number;
  tasksCompleted: number;
  tasksInProgress: number;
  estimationAccuracy: number;
  productivityScore: number;
}

const developers: Developer[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Senior Frontend Developer",
    email: "sarah.chen@oracle.com",
    avatar: "SC",
    workload: 85,
    tasksCompleted: 42,
    tasksInProgress: 3,
    estimationAccuracy: 92,
    productivityScore: 95,
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    role: "Backend Developer",
    email: "michael.rodriguez@oracle.com",
    avatar: "MR",
    workload: 72,
    tasksCompleted: 38,
    tasksInProgress: 2,
    estimationAccuracy: 87,
    productivityScore: 88,
  },
  {
    id: "3",
    name: "Emily Thompson",
    role: "Full Stack Developer",
    email: "emily.thompson@oracle.com",
    avatar: "ET",
    workload: 68,
    tasksCompleted: 35,
    tasksInProgress: 2,
    estimationAccuracy: 89,
    productivityScore: 90,
  },
  {
    id: "4",
    name: "David Kim",
    role: "DevOps Engineer",
    email: "david.kim@oracle.com",
    avatar: "DK",
    workload: 90,
    tasksCompleted: 45,
    tasksInProgress: 4,
    estimationAccuracy: 85,
    productivityScore: 92,
  },
  {
    id: "5",
    name: "Jessica Martinez",
    role: "QA Engineer",
    email: "jessica.martinez@oracle.com",
    avatar: "JM",
    workload: 55,
    tasksCompleted: 28,
    tasksInProgress: 1,
    estimationAccuracy: 94,
    productivityScore: 86,
  },
  {
    id: "6",
    name: "Robert Johnson",
    role: "Backend Developer",
    email: "robert.johnson@oracle.com",
    avatar: "RJ",
    workload: 78,
    tasksCompleted: 40,
    tasksInProgress: 3,
    estimationAccuracy: 88,
    productivityScore: 89,
  },
];

export default function Team() {
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(
    null,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-[#1A1A1A] mb-2">Team</h1>
        <p className="text-[#6B7280]">Monitor team members and performance</p>
      </div>

      {/* Team Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-[#2563EB]" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-1">
            {developers.length}
          </h3>
          <p className="text-sm text-[#6B7280]">Team Members</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#16A34A]/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#16A34A]" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-1">228</h3>
          <p className="text-sm text-[#6B7280]">Total Tasks Completed</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-[#F59E0B]" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-1">89%</h3>
          <p className="text-sm text-[#6B7280]">Avg Estimation Accuracy</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#C74634]/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#C74634]" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-1">90%</h3>
          <p className="text-sm text-[#6B7280]">Avg Productivity Score</p>
        </div>
      </div>

      {/* Developer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {developers.map((dev) => (
          <div
            key={dev.id}
            onClick={() => setSelectedDeveloper(dev)}
            className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm hover:shadow-lg transition-all cursor-pointer"
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-[#C74634] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-semibold text-white">
                  {dev.avatar}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#1A1A1A] mb-1">
                  {dev.name}
                </h3>
                <p className="text-sm text-[#6B7280] mb-1">{dev.role}</p>
                <p className="text-xs text-[#6B7280] truncate">{dev.email}</p>
              </div>
            </div>

            {/* Workload */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-[#6B7280]">Current Workload</span>
                <span
                  className="font-medium"
                  style={{
                    color:
                      dev.workload > 80
                        ? "#DC2626"
                        : dev.workload > 60
                          ? "#F59E0B"
                          : "#16A34A",
                  }}
                >
                  {dev.workload}%
                </span>
              </div>
              <div className="h-2 bg-[#F7F8FA] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${dev.workload}%`,
                    backgroundColor:
                      dev.workload > 80
                        ? "#DC2626"
                        : dev.workload > 60
                          ? "#F59E0B"
                          : "#16A34A",
                  }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E5E7EB]">
              <div>
                <p className="text-2xl font-semibold text-[#1A1A1A]">
                  {dev.tasksCompleted}
                </p>
                <p className="text-xs text-[#6B7280] mt-1">Tasks Completed</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-[#1A1A1A]">
                  {dev.tasksInProgress}
                </p>
                <p className="text-xs text-[#6B7280] mt-1">In Progress</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-[#1A1A1A]">
                  {dev.estimationAccuracy}%
                </p>
                <p className="text-xs text-[#6B7280] mt-1">Est. Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-[#1A1A1A]">
                  {dev.productivityScore}%
                </p>
                <p className="text-xs text-[#6B7280] mt-1">Productivity</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Developer Detail Modal */}
      {selectedDeveloper && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSelectedDeveloper(null)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-xl shadow-2xl z-50 p-8">
            <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-6">
              Developer Details
            </h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-[#C74634] rounded-full flex items-center justify-center">
                  <span className="text-2xl font-semibold text-white">
                    {selectedDeveloper.avatar}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1A1A1A]">
                    {selectedDeveloper.name}
                  </h3>
                  <p className="text-[#6B7280]">{selectedDeveloper.role}</p>
                  <p className="text-sm text-[#6B7280]">
                    {selectedDeveloper.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#F7F8FA] rounded-lg">
                  <p className="text-sm text-[#6B7280] mb-1">
                    Tasks Completed (Sprint)
                  </p>
                  <p className="text-2xl font-semibold text-[#1A1A1A]">
                    {selectedDeveloper.tasksCompleted}
                  </p>
                </div>
                <div className="p-4 bg-[#F7F8FA] rounded-lg">
                  <p className="text-sm text-[#6B7280] mb-1">
                    Current Workload
                  </p>
                  <p className="text-2xl font-semibold text-[#1A1A1A]">
                    {selectedDeveloper.workload}%
                  </p>
                </div>
                <div className="p-4 bg-[#F7F8FA] rounded-lg">
                  <p className="text-sm text-[#6B7280] mb-1">
                    Estimation Accuracy
                  </p>
                  <p className="text-2xl font-semibold text-[#1A1A1A]">
                    {selectedDeveloper.estimationAccuracy}%
                  </p>
                </div>
                <div className="p-4 bg-[#F7F8FA] rounded-lg">
                  <p className="text-sm text-[#6B7280] mb-1">
                    Productivity Score
                  </p>
                  <p className="text-2xl font-semibold text-[#1A1A1A]">
                    {selectedDeveloper.productivityScore}%
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDeveloper(null)}
                className="w-full px-4 py-2 bg-[#C74634] text-white rounded-lg hover:bg-[#9E2A1F] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

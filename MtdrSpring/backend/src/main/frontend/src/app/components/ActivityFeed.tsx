import { CheckCircle2, UserPlus, Play, GitBranch } from "lucide-react";

export default function ActivityFeed() {
  const activities = [
    {
      type: "completed",
      icon: CheckCircle2,
      color: "#16A34A",
      text: "Sarah Chen completed",
      subject: "User Authentication",
      time: "5 min ago",
    },
    {
      type: "assigned",
      icon: UserPlus,
      color: "#2563EB",
      text: "Task assigned to",
      subject: "Michael Rodriguez",
      time: "12 min ago",
    },
    {
      type: "started",
      icon: Play,
      color: "#F59E0B",
      text: "Sprint 24 started",
      subject: "by Project Manager",
      time: "1 hour ago",
    },
    {
      type: "completed",
      icon: CheckCircle2,
      color: "#16A34A",
      text: "Emily Thompson completed",
      subject: "API Integration",
      time: "2 hours ago",
    },
    {
      type: "branch",
      icon: GitBranch,
      color: "#6B7280",
      text: "David Kim created branch",
      subject: "feature/dashboard",
      time: "3 hours ago",
    },
    {
      type: "completed",
      icon: CheckCircle2,
      color: "#16A34A",
      text: "Jessica Martinez completed",
      subject: "Bug Fix #234",
      time: "4 hours ago",
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
          Recent Activity
        </h3>
        <p className="text-sm text-[#6B7280]">Latest team updates</p>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${activity.color}15` }}
            >
              <activity.icon
                className="w-4 h-4"
                style={{ color: activity.color }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#1A1A1A]">
                {activity.text}{" "}
                <span className="font-medium">{activity.subject}</span>
              </p>
              <p className="text-xs text-[#6B7280] mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

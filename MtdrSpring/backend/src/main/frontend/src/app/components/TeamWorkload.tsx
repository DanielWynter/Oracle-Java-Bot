export default function TeamWorkload() {
  const developers = [
    { name: "Sarah Chen", load: 85, tasks: 12, hours: 34, color: "#DC2626" },
    { name: "Michael Rodriguez", load: 72, tasks: 10, hours: 28, color: "#F59E0B" },
    { name: "Emily Thompson", load: 68, tasks: 9, hours: 25, color: "#16A34A" },
    { name: "David Kim", load: 90, tasks: 14, hours: 38, color: "#DC2626" },
    { name: "Jessica Martinez", load: 55, tasks: 7, hours: 20, color: "#16A34A" },
    { name: "Robert Johnson", load: 78, tasks: 11, hours: 30, color: "#F59E0B" },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
          Team Workload
        </h3>
        <p className="text-sm text-[#6B7280]">
          Current capacity utilization and hours worked per developer
        </p>
      </div>
      <div className="space-y-4">
        {developers.map((dev) => (
          <div key={dev.name}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C74634]/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-[#C74634]">
                    {dev.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">
                    {dev.name}
                  </p>
                  {/* AQUÍ ESTÁ EL PARCHE DE LA RÚBRICA */}
                  <p className="text-xs text-[#6B7280]">
                    {dev.tasks} tasks | {dev.hours} hours worked
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium" style={{ color: dev.color }}>
                {dev.load}%
              </span>
            </div>
            <div className="h-2 bg-[#F7F8FA] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${dev.load}%`, backgroundColor: dev.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
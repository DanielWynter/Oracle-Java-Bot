import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface KPIWidgetProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  color: string;
}

export default function KPIWidget({
  label,
  value,
  change,
  trend,
  icon: Icon,
  color,
}: KPIWidgetProps) {
  const isPositive = trend === "up";

  return (
    <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            isPositive
              ? "bg-[#16A34A]/10 text-[#16A34A]"
              : "bg-[#DC2626]/10 text-[#DC2626]"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {change}
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-semibold text-[#1A1A1A] mb-1">{value}</h3>
        <p className="text-sm text-[#6B7280]">{label}</p>
      </div>
    </div>
  );
}

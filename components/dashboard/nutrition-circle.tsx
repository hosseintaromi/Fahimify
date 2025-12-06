import { useId } from "react"

interface NutritionCircleProps {
  label: string
  percentage: number
  current: string | number
  target: string | number
  unit: string
  size?: "small" | "large"
}

export default function NutritionCircle({
  label,
  percentage,
  current,
  target,
  unit,
  size = "small",
}: NutritionCircleProps) {
  const getHeatmapColor = (percent: number) => {
    if (percent < 25) return { start: "#f87171", end: "#ef4444" }
    if (percent < 50) return { start: "#fb923c", end: "#f97316" }
    if (percent < 75) return { start: "#facc15", end: "#f59e0b" }
    if (percent < 90) return { start: "#a3e635", end: "#84cc16" }
    return { start: "#34d399", end: "#10b981" }
  }

  const isBig = size === "large"
  const circleSize = isBig ? 168 : 104
  const strokeWidth = isBig ? 14 : 10
  const radius = (circleSize - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  const colors = getHeatmapColor(percentage)
  const gradientId = useId()

  return (
    <div className="flex flex-col items-center">
      <div
        style={{ width: circleSize, height: circleSize }}
        className="relative mb-2 flex items-center justify-center rounded-full bg-white/40 p-3 shadow-[inset_0_12px_40px_rgba(15,118,110,0.12),0_10px_30px_rgba(15,118,110,0.08)] backdrop-blur"
      >
        <svg width={circleSize} height={circleSize} className="absolute">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.start} />
              <stop offset="100%" stopColor={colors.end} />
            </linearGradient>
          </defs>
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            fill="none"
            stroke="rgba(226, 232, 240, 0.6)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transform: `rotate(-90deg)`,
              transformOrigin: `${circleSize / 2}px ${circleSize / 2}px`,
              transition: "stroke-dashoffset 0.6s ease, stroke 0.4s ease",
            }}
          />
        </svg>
        <div className="text-center">
          <p className={`font-semibold tracking-tight ${isBig ? "text-3xl" : "text-lg"}`} style={{ color: colors.end }}>
            {percentage}%
          </p>
          {isBig && <p className="text-xs text-slate-500">{label}</p>}
        </div>
      </div>
      <p className={`text-center font-semibold ${isBig ? "text-sm" : "text-xs"}`}>{label}</p>
      <p className="text-xs text-slate-500">
        {current}/{target} {unit}
      </p>
    </div>
  )
}

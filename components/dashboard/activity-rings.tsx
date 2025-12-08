"use client"

interface RingConfig {
  label: string
  percentage: number
  color: string
}

interface ActivityRingsProps {
  rings: RingConfig[]
  size?: number
}

export default function ActivityRings({ rings, size = 220 }: ActivityRingsProps) {
  const strokeWidth = 12
  const gap = 12

  const computed = rings.map((ring, index) => {
    const radius = (size - strokeWidth) / 2 - index * (strokeWidth + gap)
    const circumference = 2 * Math.PI * radius
    const clamped = Math.min(ring.percentage, 100)
    const offset = circumference - (clamped / 100) * circumference
    return { ring, radius, circumference, offset }
  })

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {computed.map(({ radius }, index) => (
          <circle
            key={`bg-${index}`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(226,232,240,0.6)"
            strokeWidth={strokeWidth}
          />
        ))}
        {computed.map(({ radius, circumference, offset, ring }, index) => (
          <circle
            key={`ring-${index}`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ring.color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
              transition: "stroke-dashoffset 0.6s ease",
            }}
          />
        ))}
      </svg>
      <div className="absolute text-center">
        <p className="text-4xl font-semibold text-slate-900">{rings[0].percentage}%</p>
        <p className="text-sm font-medium text-slate-500">{rings[0].label}</p>
      </div>
    </div>
  )
}




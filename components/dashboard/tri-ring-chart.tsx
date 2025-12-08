"use client"

interface RingLayer {
  label: string
  current: number
  target: number
  color: string
}

interface TriRingChartProps {
  layers: RingLayer[]
  size?: number
}

export default function TriRingChart({ layers, size = 150 }: TriRingChartProps) {
  const strokeWidth = 10
  const gap = 8

  const ringData = layers.map((layer, index) => {
    const radius = (size - strokeWidth) / 2 - index * (strokeWidth + gap)
    const circumference = 2 * Math.PI * radius
    const progress = Math.min(layer.current / layer.target, 1)
    return {
      radius,
      circumference,
      offset: circumference - progress * circumference,
      color: layer.color,
    }
  })

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {ringData.map(({ radius }, index) => (
          <circle
            key={`bg-${index}`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(148,163,184,0.25)"
            strokeWidth={strokeWidth}
          />
        ))}
        {ringData.map(({ radius, circumference, offset, color }, index) => (
          <circle
            key={`fg-${index}`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 0.6s ease" }}
          />
        ))}
      </svg>
    </div>
  )
}




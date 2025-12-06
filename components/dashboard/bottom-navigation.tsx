"use client"

import { Home, Calendar, Beaker, Zap } from "lucide-react"

interface BottomNavigationProps {
  currentTab: string
  onTabChange: (tab: string) => void
}

export default function BottomNavigation({ currentTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "plan", label: "Plan", icon: Calendar },
    { id: "nutrition", label: "Nutrition", icon: Zap },
    { id: "nourish", label: "Labs", icon: Beaker },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white to-white/95 pt-2 pb-safe">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-center gap-2 rounded-[28px] border border-white/60 bg-white/90 px-4 py-2 shadow-[0_20px_40px_rgba(15,118,110,0.1)] backdrop-blur">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = currentTab === id
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex items-center gap-2 rounded-[24px] px-3 py-2 text-xs font-semibold transition ${active ? "bg-gradient-to-r from-teal-500 to-sky-500 text-white shadow" : "text-slate-500 hover:text-teal-500"
                }`}
            >
              <Icon size={18} className={active ? "text-white" : "text-slate-400"} />
              <span>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

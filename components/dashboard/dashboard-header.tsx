"use client"

import { Settings, User } from "lucide-react"

interface DashboardHeaderProps {
  onSettingsClick: () => void
  onProfileClick: () => void
}

export default function DashboardHeader({ onSettingsClick, onProfileClick }: DashboardHeaderProps) {
  return (
    <div className="sticky top-0 z-50 border-b border-white/70 bg-gradient-to-r from-white/95 via-white/90 to-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-4">
        <button
          onClick={onSettingsClick}
          className="rounded-2xl bg-white/80 p-2 text-slate-600 shadow-sm transition hover:bg-white"
        >
          <Settings size={24} />
        </button>

        <h1 className="text-2xl font-semibold text-slate-900">Fahimify</h1>

        <button
          onClick={onProfileClick}
          className="rounded-2xl bg-white/80 p-2 text-slate-600 shadow-sm transition hover:bg-white"
        >
          <User size={24} />
        </button>
      </div>
    </div>
  )
}

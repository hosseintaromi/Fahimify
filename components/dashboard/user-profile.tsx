"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Upload, Calculator } from "lucide-react"

interface UserProfileProps {
  onBack: () => void
}

export default function UserProfile({ onBack }: UserProfileProps) {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [userName, setUserName] = useState("Alex Thompson")
  const [email] = useState("alex.thompson@email.com")
  const [registeredDate] = useState("January 15, 2024")
  const [lastActivity] = useState("Today at 2:30 PM")

  // Optional health metrics
  const [age, setAge] = useState<number | "">("")
  const [height, setHeight] = useState<number | "">("")
  const [weight, setWeight] = useState<number | "">("")
  const [bodyType, setBodyType] = useState("")
  const [bmi, setBmi] = useState<number | null>(null)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setProfilePhoto(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const calculateBMI = () => {
    if (height && weight) {
      // BMI = weight (kg) / (height (m))^2
      const heightInMeters = (height as number) / 100
      const bmiValue = (weight as number) / (heightInMeters * heightInMeters)
      setBmi(Math.round(bmiValue * 10) / 10)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dff7ef] via-[#e7f5ff] to-white pb-20">
      <div className="sticky top-0 z-10 border-b border-white/70 bg-gradient-to-r from-white/95 via-white/90 to-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <button onClick={onBack} className="rounded-2xl bg-white/80 p-2 shadow-sm transition hover:bg-white">
            <ArrowLeft size={24} className="text-slate-700" />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Profile</p>
            <h1 className="text-3xl font-semibold text-slate-900">My Profile</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Your identity</p>
          <h2 className="text-2xl font-semibold text-slate-900">Make it yours</h2>
          <p className="text-sm text-slate-500">
            Refresh your avatar, confirm your contact info, or track optional health metrics to personalize plans.
          </p>
        </div>

        <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 text-center shadow-lg space-y-4">
          <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white shadow-lg">
            {profilePhoto ? (
              <img src={profilePhoto || "/placeholder.svg"} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-100 to-emerald-50 text-3xl font-semibold text-slate-600">
                {userName.charAt(0)}
              </div>
            )}
          </div>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-teal-500/30">
            <Upload size={16} />
            Add Photo
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">User name</p>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Registered email</p>
            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-slate-500"
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Registered date</p>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
              {registeredDate}
            </div>
          </div>
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Last activity</p>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
              {lastActivity}
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-lg space-y-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Health metrics</p>
            <h3 className="text-xl font-semibold text-slate-900">Optional wellness inputs</h3>
            <p className="text-sm text-slate-500">Share what you’re comfortable with to generate smarter nutrition nudges.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs text-slate-500">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number.parseInt(e.target.value) : "")}
                placeholder="Enter age"
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-500">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value ? Number.parseInt(e.target.value) : "")}
                placeholder="Enter height"
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-500">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value ? Number.parseInt(e.target.value) : "")}
                placeholder="Enter weight"
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-500">Body type</label>
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <option value="">Select body type</option>
                <option value="ectomorph">Ectomorph</option>
                <option value="mesomorph">Mesomorph</option>
                <option value="endomorph">Endomorph</option>
              </select>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={calculateBMI}
              disabled={!height || !weight}
              className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="inline-flex items-center gap-2 justify-center">
                <Calculator size={16} />
                Calculate BMI
              </span>
            </button>

            {bmi !== null && (
              <div className="rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 to-sky-50 p-4 text-left">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Your BMI</p>
                <p className="text-3xl font-semibold text-teal-600">{bmi}</p>
                <p className="text-xs text-slate-500">
                  {bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal weight" : bmi < 30 ? "Overweight" : "Obese"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

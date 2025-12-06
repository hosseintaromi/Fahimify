"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import OnboardingFlow, { type OnboardingData } from "@/components/onboarding/onboarding-flow"
import DashboardHome from "@/components/dashboard/dashboard-home"
import { AUTH_STORAGE_KEY, ONBOARDING_STORAGE_KEY, readClientFlag, writeClientFlag } from "@/lib/storage"

export default function Home() {
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = readClientFlag(AUTH_STORAGE_KEY) === "true"
    if (!isAuthenticated) {
      router.replace("/login")
      return
    }

    const hasOnboarded = readClientFlag(ONBOARDING_STORAGE_KEY) === "true"
    setOnboardingComplete(hasOnboarded)
    setIsCheckingSession(false)
  }, [router])

  const handleOnboardingComplete: (data: OnboardingData) => void = () => {
    writeClientFlag(ONBOARDING_STORAGE_KEY, "true")
    setOnboardingComplete(true)
  }

  if (isCheckingSession) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading your kitchen...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {!onboardingComplete ? <OnboardingFlow onComplete={handleOnboardingComplete} /> : <DashboardHome />}
    </main>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import OnboardingFlow, { type OnboardingData } from "@/components/onboarding/onboarding-flow"
import DashboardHome from "@/components/dashboard/dashboard-home"
import { getCurrentUser } from "@/app/actions/user"

export default function Home() {
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser()
      
      if (!user) {
        router.replace("/login")
        return
      }

      setOnboardingComplete(user.hasCompletedOnboarding)
      setIsCheckingSession(false)
    }

    checkAuth()
  }, [router])

  const handleOnboardingComplete: (data: OnboardingData) => void = () => {
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

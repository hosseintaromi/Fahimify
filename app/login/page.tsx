"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AUTH_STORAGE_KEY, readClientFlag, writeClientFlag } from "@/lib/storage"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const isAuthenticated = readClientFlag(AUTH_STORAGE_KEY) === "true"
    if (isAuthenticated) {
      router.replace("/")
    }
  }, [router])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) {
      return
    }
    setIsSubmitting(true)
    writeClientFlag(AUTH_STORAGE_KEY, "true")
    router.replace("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dff7ef] via-[#e8f2ff] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_25px_80px_rgba(8,47,73,0.12)] p-8 space-y-8">
        <div className="space-y-2 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-teal-600">Fahimify</p>
          <h1 className="text-3xl font-semibold text-slate-900">Step into your kitchen</h1>
          <p className="text-sm text-slate-500">Use any credentials. We only track whether you have completed onboarding.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-600">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              required
              placeholder="you@email.com"
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 rounded-2xl bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-teal-400"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-600">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              required
              placeholder="••••••••"
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 rounded-2xl bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-400"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-teal-500 via-sky-500 to-blue-600 font-semibold text-white shadow-lg shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Opening..." : "Enter Fahimify"}
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500">
          First-time cooks will move through onboarding automatically after login.
        </div>
      </div>
    </div>
  )
}


"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        router.push("/")
      } else {
        setError(data.error || "Signup failed")
        setIsSubmitting(false)
      }
    } catch (err) {
      setError("An error occurred during signup")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dff7ef] via-[#e8f2ff] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_25px_80px_rgba(8,47,73,0.12)] p-8 space-y-8">
        <div className="space-y-2 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-teal-600">Fahimify</p>
          <h1 className="text-3xl font-semibold text-slate-900">Create your account</h1>
          <p className="text-sm text-slate-500">
            Start your personalized meal planning journey
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-slate-600">
              Username
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              value={username}
              required
              placeholder="your_username"
              onChange={(event) => setUsername(event.target.value)}
              className="h-12 rounded-2xl bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-teal-400"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-600">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              required
              placeholder="your.email@example.com"
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 rounded-2xl bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-400"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-600">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              required
              minLength={6}
              placeholder="••••••••"
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 rounded-2xl bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-400"
            />
            <p className="text-xs text-slate-500">At least 6 characters</p>
          </div>

          {error && (
            <div className="text-sm text-red-600 text-center bg-red-50 rounded-lg p-3">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-teal-500 via-sky-500 to-blue-600 font-semibold text-white shadow-lg shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-teal-600 hover:text-teal-700">
              Log in
            </Link>
          </p>
        </div>

        <div className="text-center text-xs text-slate-500">
          After signing up, you'll complete a quick onboarding to personalize your meal plans.
        </div>
      </div>
    </div>
  )
}

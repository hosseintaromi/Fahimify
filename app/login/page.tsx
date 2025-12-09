"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { loginUser, registerUser } from "@/app/actions/user"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("login")

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return
    
    setIsSubmitting(true)
    setError("")
    
    const result = await loginUser(username, password)
    
    if (result.success) {
      router.push("/")
      router.refresh()
    } else {
      setError(result.error || "Login failed")
      setIsSubmitting(false)
    }
  }

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return
    
    setIsSubmitting(true)
    setError("")
    
    const result = await registerUser(username, password)
    
    if (result.success) {
      router.push("/")
      router.refresh()
    } else {
      setError(result.error || "Registration failed")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dff7ef] via-[#e8f2ff] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_25px_80px_rgba(8,47,73,0.12)] p-8 space-y-8">
        <div className="space-y-2 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-teal-600">Fahimify</p>
          <h1 className="text-3xl font-semibold text-slate-900">Step into your kitchen</h1>
          <p className="text-sm text-slate-500">
            {activeTab === "login" ? "Welcome back!" : "Create your account to get started"}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="login-username" className="text-sm font-medium text-slate-600">
                  Username
                </label>
                <Input
                  id="login-username"
                  type="text"
                  value={username}
                  required
                  placeholder="your_username"
                  onChange={(event) => setUsername(event.target.value)}
                  className="h-12 rounded-2xl bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-teal-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="login-password" className="text-sm font-medium text-slate-600">
                  Password
                </label>
                <Input
                  id="login-password"
                  type="password"
                  value={password}
                  required
                  placeholder="••••••••"
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 rounded-2xl bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-400"
                />
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
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="register-username" className="text-sm font-medium text-slate-600">
                  Username
                </label>
                <Input
                  id="register-username"
                  type="text"
                  value={username}
                  required
                  placeholder="your_username"
                  onChange={(event) => setUsername(event.target.value)}
                  className="h-12 rounded-2xl bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-teal-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="register-password" className="text-sm font-medium text-slate-600">
                  Password
                </label>
                <Input
                  id="register-password"
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
                {isSubmitting ? "Creating account..." : "Register"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center text-xs text-slate-500">
          First-time users will go through onboarding after registration.
        </div>
      </div>
    </div>
  )
}




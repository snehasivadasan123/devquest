"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { register } from "@/lib/api"

export default function RegisterForm() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!username) {
      newErrors.username = "Username is required"
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      const response = await register({ username, email, password })
      
      localStorage.setItem('token', response.token)
      localStorage.setItem('userId', response.user.id)
      localStorage.setItem('username', response.user.username)
      
      window.location.href = '/'
    } catch (error) {
      console.error("Registration error:", error)
      setErrors({ submit: error instanceof Error ? error.message : "An error occurred during registration" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
     <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join us today and get started</p>
        </div>
    <Card className="border border-primary/30 bg-card/50 backdrop-blur-xl shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg pointer-events-none"></div>

      <CardHeader className="space-y-1 relative z-10">
        <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
        <CardDescription>Create your new account</CardDescription>
      </CardHeader>

      <CardContent className="relative z-10">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground font-medium">
              FullName
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className={`bg-input border transition-all duration-200 ${
                errors.username
                  ? "border-destructive focus:ring-destructive"
                  : "border-border focus:border-primary hover:border-primary/50"
              }`}
            />
            {errors.username && <p className="text-sm text-destructive font-medium">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="abc@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className={`bg-input border transition-all duration-200 ${
                errors.email
                  ? "border-destructive focus:ring-destructive"
                  : "border-border focus:border-primary hover:border-primary/50"
              }`}
            />
            {errors.email && <p className="text-sm text-destructive font-medium">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className={`bg-input border transition-all duration-200 ${
                errors.password
                  ? "border-destructive focus:ring-destructive"
                  : "border-border focus:border-primary hover:border-primary/50"
              }`}
            />
            {errors.password && <p className="text-sm text-destructive font-medium">{errors.password}</p>}
          </div>

          {errors.submit && <p className="text-sm text-destructive font-medium">{errors.submit}</p>}

          <Button
            type="submit"
            
            className="w-full mt-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold py-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-border/30 pt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:text-accent transition-colors duration-200">
              Log in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
    </div>
    </main>
  )
}

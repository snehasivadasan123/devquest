"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = "Email is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await login({ email, password });
      console.log("Login successful:", response.user.id);

      toast.success("Login successful!");

      // Store token in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("userId", response.user.id);
      localStorage.setItem("username", response.user.username);

      // Redirect to home page
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setErrors({
        submit:
          error instanceof Error ? error.message : "Invalid login credentials",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border border-primary/30 bg-card/50 backdrop-blur-xl shadow-2xl max-w-md mx-auto mt-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg pointer-events-none" />

      <CardHeader className="space-y-1 relative z-10">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Login to continue</CardDescription>
      </CardHeader>

      <CardContent className="relative z-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              Email
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
            {errors.email && (
              <p className="text-sm text-destructive font-medium">
                {errors.email}
              </p>
            )}
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
            {errors.password && (
              <p className="text-sm text-destructive font-medium">
                {errors.password}
              </p>
            )}
          </div>

          {errors.submit && (
            <p className="text-sm text-destructive font-medium">
              {errors.submit}
            </p>
          )}

          {/* Button */}
          <Button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold py-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center border-t border-border/30 pt-6">
          <p className="text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:text-accent transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthSplitLayout } from "@/components/layout/auth-split-layout";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ROUTES } from "@/lib/constants";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  // const router = useRouter() // Temporarily commented, will be used for future navigation
  const { login } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);

  // Form state
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = React.useState({
    email: "",
    password: "",
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({ email: "", password: "" });

    // Basic validation
    let hasErrors = false;
    const newErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      hasErrors = true;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      hasErrors = true;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    // Simulate login
    setIsLoading(true);

    // Mock API call
    setTimeout(async () => {
      // Use the auth context login method
      await login(formData.email, formData.password);
      setIsLoading(false);
      // The auth context will handle the redirect
    }, 1500);
  };

  const slides = [
    {
      title: "Welcome to the Future of HR",
      subtitle: "Streamline your recruitment with AI",
      description:
        "Transform your hiring process with intelligent automation, data-driven insights, and seamless candidate management.",
    },
    {
      title: "Smart Candidate Matching",
      subtitle: "Find the perfect fit faster",
      description:
        "Our AI analyzes skills, experience, and cultural fit to match you with ideal candidates in seconds, not days.",
    },
    {
      title: "Data-Driven Decisions",
      subtitle: "Hire with confidence",
      description:
        "Access real-time analytics and insights that help you make informed hiring decisions and improve your recruitment strategy.",
    },
  ];

  return (
    <AuthSplitLayout slides={slides}>
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Sign in!!!!
          </h1>
          <p className="text-sm text-slate-600">
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="name@vtb.com"
                className="pl-10 h-11"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#1B4F8C] hover:text-[#2563EB] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10 h-11"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              disabled={isLoading}
            />
            <Label
              htmlFor="remember"
              className="text-sm font-normal cursor-pointer select-none"
            >
              Remember me for 30 days
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="vtbPrimary"
            className="w-full h-11"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </span>
            ) : (
              <span className="flex items-center">
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              href={ROUTES.REGISTER}
              className="font-medium text-[#1B4F8C] hover:text-[#2563EB] transition-colors"
            >
              Create your account
            </Link>
          </p>
        </div>

        {/* Help Link */}
        <div className="mt-6 text-center">
          <Link
            href="/contact"
            className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
          >
            Need help? Contact support
          </Link>
        </div>
      </div>
    </AuthSplitLayout>
  );
}

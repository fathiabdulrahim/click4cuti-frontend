import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLogin } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Eye,
  EyeOff,
  Loader2,
  Clock,
  Users,
  CheckCircle2,
  BarChart3,
} from 'lucide-react'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormValues = z.infer<typeof schema>

const features = [
  { icon: Clock, title: 'Leave Tracking', desc: 'Real-time balance & history' },
  { icon: Users, title: 'Team Calendar', desc: 'See who is in and who is out' },
  { icon: CheckCircle2, title: 'Quick Approvals', desc: 'One-click approve or reject' },
  { icon: BarChart3, title: 'HR Analytics', desc: 'Insights at a glance' },
]

export default function LoginPage() {
  const login = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = (data: FormValues) => {
    login.mutate(data)
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-5">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:col-span-3 flex-col justify-between relative overflow-hidden bg-[#FE4E01] p-12 text-white">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/[0.06]" />
          <div className="absolute top-1/3 -left-16 h-64 w-64 rounded-full bg-white/[0.06]" />
          <div className="absolute bottom-20 right-1/4 h-48 w-48 rounded-full bg-black/[0.04]" />
          <div className="absolute top-1/2 right-12 h-32 w-32 rounded-full border border-white/10" />
        </div>

        {/* Logo */}
        <div className="relative">
          <img
            src="/logo-navbar-white.svg"
            alt="Click4Cuti"
            className="h-8"
          />
        </div>

        {/* Hero content */}
        <div className="relative space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight xl:text-5xl">
              Leave management,
              <br />
              <span className="text-white/80">made effortless.</span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-white/70">
              Streamline your HR workflows — from leave requests to approvals, all in one unified platform built for modern teams.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-3 max-w-lg">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-3 rounded-xl bg-white/10 p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <f.icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{f.title}</p>
                  <p className="text-xs text-white/60">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative text-sm text-white/50">
          &copy; {new Date().getFullYear()} Click4Cuti. All rights reserved.
        </p>
      </div>

      {/* Right panel - Form */}
      <div className="flex flex-col lg:col-span-2 items-center justify-center px-6 py-12 bg-white">
        {/* Mobile logo */}
        <div className="mb-10 lg:hidden">
          <img
            src="/logo-navbar.svg"
            alt="Click4Cuti"
            className="h-8"
          />
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-500">
              Sign in to access your leave dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                {...register('email')}
                className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-gray-400 hover:text-[#FE4E01] transition-colors cursor-pointer"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register('password')}
                  className={
                    errors.password
                      ? 'border-destructive focus-visible:ring-destructive pr-10'
                      : 'pr-10'
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {login.error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                Invalid email or password
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 cursor-pointer font-semibold bg-[#FE4E01] hover:bg-[#E54400] text-white transition-colors"
              disabled={login.isPending}
            >
              {login.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="text-center text-xs text-gray-400">
            Secure login powered by Click4Cuti
          </div>
        </div>
      </div>
    </div>
  )
}

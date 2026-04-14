import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAdminLogin } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Shield,
  Eye,
  EyeOff,
  Loader2,
  Settings,
  Building2,
  UserCog,
  Lock,
} from 'lucide-react'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormValues = z.infer<typeof schema>

const capabilities = [
  { icon: Building2, label: 'Organization Management' },
  { icon: UserCog, label: 'User & Role Configuration' },
  { icon: Settings, label: 'System Settings' },
  { icon: Lock, label: 'Access Control & Policies' },
]

export default function AdminLoginPage() {
  const login = useAdminLogin()
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
      {/* Left panel - Admin branding */}
      <div className="hidden lg:flex lg:col-span-3 flex-col justify-between relative overflow-hidden bg-gray-950 p-12 text-white">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[#FE4E01]/[0.07]" />
          <div className="absolute top-1/2 -left-12 h-56 w-56 rounded-full bg-[#FE4E01]/[0.05]" />
          <div className="absolute bottom-16 right-1/3 h-40 w-40 rounded-full border border-white/5" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <img
            src="/logo-navbar-white.svg"
            alt="Click4Cuti"
            className="h-8"
          />
          <span className="inline-flex items-center rounded-md bg-[#FE4E01]/20 px-2.5 py-1 text-xs font-semibold text-[#FE4E01]">
            Admin
          </span>
        </div>

        {/* Hero content */}
        <div className="relative space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight xl:text-5xl">
              System
              <br />
              <span className="text-white/60">Administration</span>
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-white/40">
              Configure organizations, manage users, and oversee the entire leave management ecosystem.
            </p>
          </div>

          {/* Capabilities list */}
          <div className="space-y-2.5 max-w-sm">
            {capabilities.map((c) => (
              <div
                key={c.label}
                className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3"
              >
                <c.icon className="h-4.5 w-4.5 text-[#FE4E01]" />
                <span className="text-sm font-medium text-white/70">{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative text-sm text-white/25">
          &copy; {new Date().getFullYear()} Click4Cuti. Authorized access only.
        </p>
      </div>

      {/* Right panel - Form */}
      <div className="flex flex-col lg:col-span-2 items-center justify-center px-6 py-12 bg-white">
        {/* Mobile logo */}
        <div className="mb-10 flex items-center gap-3 lg:hidden">
          <img
            src="/logo-navbar.svg"
            alt="Click4Cuti"
            className="h-8"
          />
          <span className="inline-flex items-center rounded-md bg-gray-900 px-2.5 py-1 text-xs font-semibold text-white">
            Admin
          </span>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-5 w-5 text-[#FE4E01]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FE4E01]">
                Admin Portal
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Admin Sign In</h2>
            <p className="text-sm text-gray-500">
              Enter your credentials to access the admin portal
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@company.com"
                autoComplete="email"
                {...register('email')}
                className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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
                Invalid email or password.
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 cursor-pointer font-semibold bg-gray-900 hover:bg-gray-800 text-white transition-colors"
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
            Restricted to authorized administrators
          </div>
        </div>
      </div>
    </div>
  )
}

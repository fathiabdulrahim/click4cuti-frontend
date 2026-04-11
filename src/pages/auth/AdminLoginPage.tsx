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
      {/* Left panel - Admin branding (3/5 width) */}
      <div className="hidden lg:flex lg:col-span-3 flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-12 text-white">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[#0F766E]/10" />
          <div className="absolute top-1/2 -left-12 h-56 w-56 rounded-full bg-[#0F766E]/8" />
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
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xl font-semibold tracking-tight">Click4Cuti</span>
            <span className="ml-2 inline-flex items-center rounded-md bg-[#0F766E]/30 px-2 py-0.5 text-xs font-medium text-[#5EEAD4]">
              Admin
            </span>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
              System
              <br />
              <span className="text-white/70">Administration</span>
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-white/50">
              Configure organizations, manage users, and oversee the entire leave management ecosystem.
            </p>
          </div>

          {/* Capabilities list */}
          <div className="space-y-3 max-w-sm">
            {capabilities.map((c) => (
              <div
                key={c.label}
                className="flex items-center gap-3 rounded-lg bg-white/[0.05] px-4 py-3 backdrop-blur-sm"
              >
                <c.icon className="h-4.5 w-4.5 text-[#5EEAD4]" />
                <span className="text-sm font-medium text-white/80">{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative text-sm text-white/30">
          &copy; {new Date().getFullYear()} Click4Cuti. Authorized access only.
        </p>
      </div>

      {/* Right panel - Form (2/5 width) */}
      <div className="flex flex-col lg:col-span-2 items-center justify-center px-6 py-12 bg-[#FAFBFC]">
        {/* Mobile logo */}
        <div className="mb-10 flex items-center gap-3 lg:hidden">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F172A] text-white">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xl font-semibold tracking-tight">Click4Cuti</span>
            <span className="ml-2 inline-flex items-center rounded-md bg-[#0F766E]/15 px-2 py-0.5 text-xs font-medium text-[#0F766E]">
              Admin
            </span>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Admin Sign In</h2>
            <p className="text-sm text-muted-foreground">
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                Invalid email or password.
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-10 cursor-pointer font-medium"
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

          {/* Divider */}
          <div className="text-center text-xs text-muted-foreground/60">
            Restricted to authorized administrators
          </div>
        </div>
      </div>
    </div>
  )
}

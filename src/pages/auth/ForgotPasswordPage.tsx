import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForgotPassword } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CalendarDays, ArrowLeft, Loader2, MailCheck, KeyRound } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Invalid email address'),
})

type FormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const forgotPassword = useForgotPassword()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormValues) => {
    forgotPassword.mutate(data.email, { onSuccess: () => setSent(true) })
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-5">
      {/* Left panel - Branding (3/5 width) */}
      <div className="hidden lg:flex lg:col-span-3 flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#FE4E01] via-[#0D6B63] to-[#134E4A] p-12 text-white">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5" />
          <div className="absolute top-1/3 -left-16 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute bottom-20 right-1/4 h-48 w-48 rounded-full bg-white/[0.03]" />
          <div className="absolute top-1/2 right-12 h-32 w-32 rounded-full border border-white/10" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <CalendarDays className="h-6 w-6" />
          </div>
          <span className="text-xl font-semibold tracking-tight">Click4Cuti</span>
        </div>

        {/* Hero content */}
        <div className="relative space-y-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <KeyRound className="h-10 w-10 text-white/80" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
              Reset your
              <br />
              <span className="text-white/80">password</span>
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-white/60">
              It happens to the best of us. We'll help you get back into your account in no time.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="relative text-sm text-white/40">
          &copy; {new Date().getFullYear()} Click4Cuti. All rights reserved.
        </p>
      </div>

      {/* Right panel - Form (2/5 width) */}
      <div className="flex flex-col lg:col-span-2 items-center justify-center px-6 py-12 bg-[#FAFBFC]">
        {/* Mobile logo */}
        <div className="mb-10 flex items-center gap-3 lg:hidden">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FE4E01] text-white">
            <CalendarDays className="h-6 w-6" />
          </div>
          <span className="text-xl font-semibold tracking-tight">Click4Cuti</span>
        </div>

        <div className="w-full max-w-sm space-y-8">
          {sent ? (
            /* Success state */
            <div className="space-y-8">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FE4E01]/10">
                  <MailCheck className="h-8 w-8 text-[#FE4E01]" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight">Check your email</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    We've sent password reset instructions to your email address. Check your inbox and follow the link to create a new password.
                  </p>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full h-10 cursor-pointer font-medium">
                <Link to="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign In
                </Link>
              </Button>
            </div>
          ) : (
            /* Form state */
            <>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Forgot password?</h2>
                <p className="text-sm text-muted-foreground">
                  Enter your email and we'll send you a link to reset your password.
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
                    className={
                      errors.email ? 'border-destructive focus-visible:ring-destructive' : ''
                    }
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 cursor-pointer font-medium"
                  disabled={forgotPassword.isPending}
                >
                  {forgotPassword.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Sign In
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

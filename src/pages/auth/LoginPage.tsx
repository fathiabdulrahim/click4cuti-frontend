import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLogin } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/useToast'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: login, isPending } = useLogin()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginForm) => {
    login(data, {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Logged in successfully',
          variant: 'success',
        })
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Invalid email or password',
          variant: 'destructive',
        })
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3F1] to-[#F0EBE6]">
      <div className="w-full max-w-md mx-auto flex flex-col justify-center min-h-screen px-4">
        <div>
          {/* Header */}
          <div className="text-center mb-8">
            <img src="/logo-navbar.svg" alt="Click4Cuti" className="h-10 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#1a1410] mb-1">User Portal</h1>
            <p className="text-sm text-gray-500">Log in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@company.com"
                {...register('email')}
                className={errors.email ? 'border-red-500 focus:ring-red-200' : ''}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`pr-10 ${errors.password ? 'border-red-500 focus:ring-red-200' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#1a1410] hover:bg-[#2d2620] text-white font-semibold py-2 rounded-md transition-colors"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Log In'
                )}
              </Button>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              Secure login powered by Click4Cuti
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/"
                className="inline-flex text-xs font-medium text-gray-500 hover:text-[#FE4E01] transition-colors cursor-pointer"
              >
                Back to homepage
              </Link>
              <span className="text-gray-300">·</span>
              <Link
                to="/admin/login"
                className="inline-flex text-xs font-medium text-gray-400 hover:text-[#FE4E01] transition-colors cursor-pointer"
              >
                Admin login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

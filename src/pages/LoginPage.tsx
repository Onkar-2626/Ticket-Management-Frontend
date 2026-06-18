import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Target route fallback (dashboard)
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (error) {
      // Errors are handled globally inside AuthContext via toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="glass-card shadow-2xl relative" glass>
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-500/10 dark:bg-brand-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-400 dark:text-dark-500">
            Sign in to access your flight booking console
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            icon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-[38px] text-slate-400 hover:text-slate-600 dark:text-dark-500 dark:hover:text-dark-300 focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>

          <div className="flex justify-end pt-1">
            <a
              href="#forgot-password"
              onClick={(e) => e.preventDefault()}
              className="text-xs font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400 transition-colors"
            >
              Forgot Password?
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            className="w-full py-3"
            icon={<LogIn className="h-4 w-4" />}
          >
            Sign In
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-slate-400 dark:text-dark-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-brand-600 hover:text-brand-500 dark:text-brand-400 transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;

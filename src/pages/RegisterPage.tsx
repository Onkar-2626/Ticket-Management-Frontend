import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { Mail, Lock, User, Phone, Activity, ArrowLeft, ArrowRight, UserPlus, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Form validation schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone_no: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  gender: z.enum(['Male', 'Female', 'Other']),
  age: z
    .number({ message: 'Age must be a number' })
    .int('Age must be a whole number')
    .min(18, 'Must be at least 18 years old')
    .max(100, 'Must be 100 years old or younger'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'Very Weak', color: 'bg-red-500' });

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone_no: '',
      gender: 'Male',
    },
  });

  const watchedPassword = watch('password');

  // Dynamic Password Strength Meter
  React.useEffect(() => {
    if (!watchedPassword) {
      setPasswordStrength({ score: 0, label: 'Very Weak', color: 'bg-red-500' });
      return;
    }

    let score = 0;
    if (watchedPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(watchedPassword)) score += 1;
    if (/[0-9]/.test(watchedPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(watchedPassword)) score += 1;

    let label = 'Very Weak';
    let color = 'bg-red-500';

    if (score === 2) {
      label = 'Weak';
      color = 'bg-orange-500';
    } else if (score === 3) {
      label = 'Medium';
      color = 'bg-yellow-500';
    } else if (score === 4) {
      label = 'Strong';
      color = 'bg-emerald-500';
    }

    setPasswordStrength({ score, label, color });
  }, [watchedPassword]);

  // Handle Step transitions & triggering section validation
  const nextStep = async () => {
    const isStepValid = await trigger(['name', 'email', 'password']);
    if (isStepValid) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await signup(data);
      navigate('/login');
    } catch (err) {
      // Handled globally inside AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="glass-card shadow-2xl overflow-hidden relative" glass>
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-500/10 dark:bg-brand-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Create Account
          </h2>
          <p className="text-sm text-slate-400 dark:text-dark-500">
            {step === 1 ? 'Step 1: Account credentials' : 'Step 2: Personal details'}
          </p>
          
          {/* Step indicators */}
          <div className="flex justify-center space-x-2 pt-2 select-none">
            <div className={`h-1.5 w-10 rounded-full transition-colors ${step === 1 ? 'bg-brand-600' : 'bg-sl ate-200 dark:bg-dark-800'}`} />
            <div className={`h-1.5 w-10 rounded-full transition-colors ${step === 2 ? 'bg-brand-600' : 'bg-slate-200 dark:bg-dark-800'}`} />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Enter Name"
                  icon={<User className="h-4 w-4" />}
                  error={errors.name?.message}
                  {...register('name')}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Aeroflow@gmail.com"
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

                {/* Password Strength meter */}
                {watchedPassword && (
                  <div className="space-y-1.5 pt-1 text-left">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 dark:text-dark-550 font-medium">Strength:</span>
                      <span className="font-bold text-slate-500 dark:text-dark-400">{passwordStrength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-dark-800 rounded-full overflow-hidden flex space-x-0.5">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-full flex-1 transition-colors duration-300 ${
                            i < passwordStrength.score ? passwordStrength.color : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={nextStep}
                    className="w-full py-3"
                    icon={<ArrowRight className="h-4 w-4" />}
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="9876543210"
                  icon={<Phone className="h-4 w-4" />}
                  error={errors.phone_no?.message}
                  {...register('phone_no')}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-left space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-dark-400 uppercase tracking-wider">
                      Gender
                    </label>
                    <select
                      className="block w-full rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 focus:ring-brand-500/20 focus:border-brand-500 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-4 transition-all duration-200"
                      {...register('gender')}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="text-xs text-red-500 dark:text-red-400 font-medium">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>

                  <Input
                    label="Age"
                    type="number"
                    placeholder="25"
                    icon={<Activity className="h-4 w-4" />}
                    error={errors.age?.message}
                    {...register('age', { valueAsNumber: true })}
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 py-3"
                    icon={<ArrowLeft className="h-4 w-4" />}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isSubmitting}
                    className="flex-1 py-3"
                    icon={<UserPlus className="h-4 w-4" />}
                  >
                    Register
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-slate-400 dark:text-dark-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-brand-600 hover:text-brand-500 dark:text-brand-400 transition-colors"
            >
              Sign In here
            </Link>
          </p>
        </div>
      </Card>
    </AuthLayout>
  );
};

export default RegisterPage;

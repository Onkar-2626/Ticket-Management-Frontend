import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { User, Mail, Phone, Activity, Save, Settings, KeyRound, ShieldAlert } from 'lucide-react';

// Form validation schema
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone_no: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  gender: z.string(),
  age: z
    .number({ message: 'Age must be a number' })
    .int('Age must be a whole number')
    .min(18, 'Must be at least 18 years old')
    .max(100, 'Must be 100 years old or younger'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: user
      ? {
          name: user.name,
          email: user.email,
          phone_no: user.phone_no || '9876543210',
          gender: user.gender || 'Male',
          age: user.age || 25,
        }
      : undefined,
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    // Artificially delay slightly for UX feel
    await new Promise((resolve) => setTimeout(resolve, 800));
    updateProfile(data);
    setIsSubmitting(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        {/* Left column: Avatar card */}
        <div className="space-y-6">
          <Card className="text-center flex flex-col items-center py-10 relative overflow-hidden" hoverable={false}>
            {/* Background design */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-brand-600 to-indigo-600" />
            
            {/* Avatar */}
            <div className="relative z-10 w-24 h-24 rounded-2xl bg-white dark:bg-dark-900 p-1.5 shadow-xl mt-8">
              <div className="w-full h-full rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold select-none shadow-inner">
                {getInitials(user.name)}
              </div>
            </div>

            <div className="mt-5 space-y-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {user.name}
              </h3>
              <p className="text-xs text-slate-400 dark:text-dark-500">
                Account ID: <span className="font-mono font-semibold">#{user.cust_id}</span>
              </p>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 mt-2 select-none">
                Registered Customer
              </div>
            </div>

            <div className="w-full border-t border-slate-100 dark:border-dark-800 mt-8 pt-6 space-y-4">
              <div className="flex justify-between text-xs">
                <span className="text-slate-450 dark:text-dark-550 font-semibold">Email</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium select-all">{user.email}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-450 dark:text-dark-550 font-semibold">System Tier</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Standard Client</span>
              </div>
            </div>
          </Card>

          <Card className="space-y-4 border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/5 select-none" hoverable={false}>
            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
              <ShieldAlert className="h-4.5 w-4.5" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Security Notice</h4>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-400/80 leading-relaxed">
              Modifying your profile credentials (name, email) updates your digital boarding tickets automatically. Keep this information accurate for validation at gate terminals.
            </p>
          </Card>
        </div>

        {/* Right column: Update form & configurations */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-6" hoverable={false}>
            <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100 dark:border-dark-900">
              <Settings className="h-5 w-5 text-slate-400" />
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Profile Configuration
                </h3>
                <p className="text-xs text-slate-400 dark:text-dark-500 mt-0.5">
                  Manage personal passenger information stored in AeroFlow database.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  icon={<User className="h-4 w-4" />}
                  error={errors.name?.message}
                  {...register('name')}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  icon={<Mail className="h-4 w-4" />}
                  error={errors.email?.message}
                  {...register('email')}
                />

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
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting}
                  icon={<Save className="h-4 w-4" />}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Credentials security panel mockup */}
          <Card className="space-y-5" hoverable={false}>
            <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100 dark:border-dark-900">
              <KeyRound className="h-5 w-5 text-slate-400" />
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Password and Security
                </h3>
                <p className="text-xs text-slate-400 dark:text-dark-500 mt-0.5">
                  Update your authentication parameters.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Account Password
                </p>
                <p className="text-xs text-slate-400 dark:text-dark-500">
                  Password has not been changed since registration.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert('Password modification modal mockup!')}
              >
                Change Password
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;

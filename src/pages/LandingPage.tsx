import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlaneTakeoff, ShieldCheck, Zap, BarChart3, ArrowRight, Star, Globe2, HeartHandshake } from 'lucide-react';
import Button from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-brand-600 dark:text-brand-400" />,
      title: 'Ultra-Fast Booking',
      desc: 'Reserve flights, choose seats, and generate digital boarding passes in under 60 seconds with our optimized booking flows.',
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      title: 'Supabase Authentication',
      desc: 'Keep your payment records and personal account settings secure with robust, enterprise-grade authentication standards.',
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-violet-600 dark:text-violet-400" />,
      title: 'Dashboard Analytics',
      desc: 'Track recent activity, view monthly transaction statements, and audit details from a centralized client workspace.',
    },
    {
      icon: <Globe2 className="h-6 w-6 text-sky-600 dark:text-sky-400" />,
      title: 'Global Connectivity',
      desc: 'Access booking operations for over 120 global airlines operating across 4,500 routes worldwide.',
    },
  ];

  const statistics = [
    { value: '99.99%', label: 'API Uptime' },
    { value: '4.8/5', label: 'App Rating' },
    { value: '250k+', label: 'Tickets Issued' },
    { value: '180+', label: 'Countries Covered' },
  ];

  const testimonials = [
    {
      quote: 'AeroFlow has completely overhauled our travel booking process. The UI is clean, light-speed, and dark mode looks incredible.',
      author: 'David Chen',
      role: 'Operations Lead at Global Tech',
      rating: 5,
    },
    {
      quote: 'Integrating the API was seamless. The booking status updates are instantaneous and the support is exceptional.',
      author: 'Sophia Martinez',
      role: 'Product Manager at Voyage Partners',
      rating: 5,
    },
  ];

  const containerVariants: any = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden mesh-bg bg-slate-50 dark:bg-dark-950 transition-colors duration-300">
      {/* Decorative Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-brand-500/5 dark:bg-brand-500/10 blur-[90px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[450px] h-[450px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-slate-200/50 dark:border-white/5 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <PlaneTakeoff className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-800 dark:text-white leading-none">
                AeroFlow
              </span>
              <p className="text-[9px] font-bold text-brand-500 tracking-wider uppercase">
                Ticketing
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/login')}
              className="border-slate-200 hover:border-slate-355 text-slate-700 hover:text-slate-900"
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto flex flex-col items-center justify-center text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center space-x-2 bg-brand-500/10 dark:bg-brand-500/15 border border-brand-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-brand-600 dark:text-brand-400 select-none">
            <HeartHandshake className="h-3.5 w-3.5" />
            <span>Next-Generation Ticket Management System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto text-slate-900 dark:text-white leading-[1.15]">
            Seamless Travel Booking <br />
            <span className="text-gradient">For Enterprise Flights</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 dark:text-dark-400 max-w-2xl mx-auto">
            Experience the ultimate management dashboard for booking flights, tracking payment histories, and auditing customer operations. Beautifully integrated, secure, and blazing fast.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
              icon={<ArrowRight className="h-4.5 w-4.5" />}
            >
              Create Account
            </Button>
            <Button
              variant="glass"
              size="lg"
              onClick={() => navigate('/login')}
            >
              Access Dashboard
            </Button>
          </div>
        </motion.div>

        {/* Hero Interactive Screen Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 80 }}
          className="mt-16 w-full max-w-4xl rounded-2xl border border-slate-200/60 dark:border-dark-850 bg-white/40 dark:bg-dark-900/30 shadow-2xl p-3.5 overflow-hidden backdrop-blur-sm relative"
        >
          <div className="rounded-xl border border-slate-200/50 dark:border-dark-800 bg-white dark:bg-dark-950/80 shadow-inner overflow-hidden aspect-[16/9] flex flex-col">
            {/* Window bar */}
            <div className="h-9 border-b border-slate-100 dark:border-dark-900 px-4 bg-slate-50/50 dark:bg-dark-950/50 flex items-center justify-between">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
              </div>
              <div className="h-5 w-48 bg-slate-100 dark:bg-dark-900 rounded-md text-[9px] text-slate-400 dark:text-dark-500 flex items-center justify-center font-mono">
                aeroflow.com/dashboard
              </div>
              <div className="w-8" />
            </div>
            
            {/* Screen layout mockup */}
            <div className="flex-1 flex text-left p-5 gap-5 bg-slate-50 dark:bg-dark-950 overflow-hidden">
              <div className="w-36 border-r border-slate-200/50 dark:border-dark-900 space-y-4 pr-3 shrink-0">
                <div className="h-6 w-20 bg-slate-200 dark:bg-dark-900 rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-6 w-full bg-brand-500/10 rounded-lg" />
                  <div className="h-6 w-full bg-slate-100 dark:bg-dark-900 rounded-lg" />
                  <div className="h-6 w-full bg-slate-100 dark:bg-dark-900 rounded-lg" />
                </div>
              </div>
              <div className="flex-1 space-y-5">
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-16 bg-white dark:bg-dark-900 border border-slate-200/30 dark:border-dark-850 rounded-xl p-3 space-y-1.5 shadow-sm">
                    <div className="h-3 w-16 bg-slate-100 dark:bg-dark-800 rounded" />
                    <div className="h-5 w-8 bg-slate-200 dark:bg-dark-750 rounded-md" />
                  </div>
                  <div className="h-16 bg-white dark:bg-dark-900 border border-slate-200/30 dark:border-dark-850 rounded-xl p-3 space-y-1.5 shadow-sm">
                    <div className="h-3 w-16 bg-slate-100 dark:bg-dark-800 rounded" />
                    <div className="h-5 w-12 bg-slate-200 dark:bg-dark-750 rounded-md" />
                  </div>
                  <div className="h-16 bg-white dark:bg-dark-900 border border-slate-200/30 dark:border-dark-850 rounded-xl p-3 space-y-1.5 shadow-sm">
                    <div className="h-3 w-16 bg-slate-100 dark:bg-dark-800 rounded" />
                    <div className="h-5 w-6 bg-slate-200 dark:bg-dark-750 rounded-md" />
                  </div>
                </div>
                <div className="h-28 bg-white dark:bg-dark-900 border border-slate-200/30 dark:border-dark-850 rounded-xl p-4 space-y-3 shadow-sm flex-1">
                  <div className="h-4 w-32 bg-slate-200 dark:bg-dark-800 rounded" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-full bg-slate-100 dark:bg-dark-850 rounded" />
                    <div className="h-3.5 w-5/6 bg-slate-100 dark:bg-dark-850 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-white/40 dark:bg-dark-900/30 border-y border-slate-250/15 dark:border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {statistics.map((stat, index) => (
              <div key={index} className="space-y-1">
                <h3 className="text-2xl md:text-3.5xl font-extrabold text-slate-800 dark:text-slate-100 select-all leading-none">
                  {stat.value}
                </h3>
                <p className="text-xs font-semibold text-slate-400 dark:text-dark-500 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Designed for Modern Flight Operations
          </h2>
          <p className="text-sm text-slate-450 dark:text-dark-500 leading-relaxed">
            Everything you need to orchestrate complex booking cycles, secure transaction histories, and analyze customer behaviors from one unified panel.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 gap-8"
        >
          {features.map((feat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass-card rounded-2xl p-6 flex items-start space-x-5"
            >
              <div className="p-3.5 bg-slate-100 dark:bg-dark-850 rounded-xl shadow-sm shrink-0 border border-slate-200/20">
                {feat.icon}
              </div>
              <div className="space-y-1.5 text-left">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-dark-450 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-100/50 dark:bg-dark-900/10 border-t border-slate-250/10 dark:border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Trusted by Travel Professionals
            </h2>
            <p className="text-sm text-slate-450 dark:text-dark-500">
              Hear why organizations depend on AeroFlow for travel ticket bookings.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((test, index) => (
              <div key={index} className="glass-card p-8 rounded-2xl flex flex-col justify-between space-y-6 text-left">
                <div className="flex space-x-1">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-sm italic text-slate-600 dark:text-dark-350 leading-relaxed">
                  "{test.quote}"
                </p>
                <div className="border-t border-slate-150/60 dark:border-dark-850 pt-4">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-250">
                    {test.author}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-dark-550">
                    {test.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 max-w-6xl mx-auto relative z-10">
        <div className="glass-card p-12 rounded-3xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-brand-500/15 blur-[60px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-indigo-500/15 blur-[60px] pointer-events-none" />
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Ready to Streamline Flight Bookings?
          </h2>
          <p className="text-sm text-slate-450 dark:text-dark-500 max-w-lg mx-auto leading-relaxed">
            Create a customer account today to access live status checks, make instant payments, and manage booking sheets in real-time.
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
            >
              Sign Up Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 dark:border-dark-900/60 bg-white/20 dark:bg-dark-950/20 py-12 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white">
              <PlaneTakeoff className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-white">
              AeroFlow Aviation
            </span>
          </div>
          <p className="text-xs text-slate-450 dark:text-dark-600">
            © {new Date().getFullYear()} AeroFlow. Designed for modern flight systems. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, ArrowLeft, Home } from 'lucide-react';
import Button from '../components/Button';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center p-6 overflow-hidden mesh-bg bg-slate-50 dark:bg-dark-950 transition-colors duration-300">
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-brand-500/10 blur-[90px] pointer-events-none animate-pulse" />

      <div className="relative z-10 text-center space-y-6 max-w-md mx-auto select-none">
        
        {/* Animated Flying Plane Vector illustration */}
        <div className="flex justify-center relative">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 4, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: 'easeInOut',
            }}
            className="p-6 bg-white dark:bg-dark-900 border border-slate-200/50 dark:border-dark-800 rounded-3xl shadow-xl flex items-center justify-center relative"
          >
            <Plane className="h-16 w-16 text-brand-500 rotate-45" />
            
            {/* Animated signal dots */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-500"></span>
            </span>
          </motion.div>
        </div>

        <div className="space-y-2">
          <h1 className="text-7xl font-extrabold text-gradient leading-none tracking-tight">
            404
          </h1>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            Route Not Found
          </h2>
          <p className="text-sm text-slate-400 dark:text-dark-500 max-w-xs mx-auto leading-relaxed">
            The flight path you requested does not exist or has been redirected to another terminal.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate(-1)}
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/')}
            icon={<Home className="h-4 w-4" />}
          >
            Return Home
          </Button>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest font-mono">
          AeroFlow Navigation System
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;

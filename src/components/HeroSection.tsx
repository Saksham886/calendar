'use client';

import { useState } from 'react';
import useCalendarStore from '@/store/calendarStore';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export default function HeroSection() {
  const { theme } = useCalendarStore();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        'relative overflow-hidden rounded-3xl mb-8 h-64 sm:h-80 lg:h-96 group',
        'backdrop-blur-xl border shadow-2xl',
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-indigo-900/40 border-slate-700/50 shadow-indigo-500/10'
          : 'bg-gradient-to-br from-white/50 via-blue-100/40 to-indigo-100/40 border-white/70 shadow-indigo-500/20'
      )}
    >
      {/* Hero image with parallax effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='1200' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%236366f1;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%238b5cf6;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%236b7280;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='400' fill='url(%23grad1)'/%3E%3Ccircle cx='200' cy='100' r='60' opacity='0.1' fill='white'/%3E%3Ccircle cx='1000' cy='300' r='80' opacity='0.1' fill='white'/%3E%3Cpolygon points='600,50 700,150 500,150' fill='white' opacity='0.05'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `perspective(1000px) rotateX(${mousePosition.y * 5 - 2.5}deg) rotateY(${mousePosition.x * 5 - 2.5}deg)`,
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 30 }}
      />

      {/* Noise texture overlay for depth */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='2'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '400px 400px',
        }}
      />

      {/* Gradient overlay */}
      <div
        className={cn(
          'absolute inset-0',
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-900/50 via-blue-900/40 to-indigo-900/60'
            : 'bg-gradient-to-br from-white/40 via-blue-50/40 to-indigo-100/50'
        )}
      />

      {/* Top binding strip effect */}
      <motion.div
        className={cn(
          'absolute top-0 left-0 right-0 h-8 backdrop-blur-md border-b',
          'flex items-center justify-center',
          theme === 'dark'
            ? 'bg-slate-900/80 border-slate-700/50 shadow-lg shadow-black/20'
            : 'bg-white/60 border-slate-200/50 shadow-lg shadow-black/5'
        )}
      >
        <div className={cn(
          'w-full h-1 bg-gradient-to-r rounded-full',
          theme === 'dark'
            ? 'from-amber-600/60 via-orange-500/40 to-amber-600/60'
            : 'from-amber-700/60 via-orange-600/40 to-amber-700/60'
        )} />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          <h1
            className={cn(
              'text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent',
              'bg-gradient-to-r drop-shadow-lg',
              theme === 'dark'
                ? 'from-white via-blue-100 to-indigo-100'
                : 'from-slate-900 via-blue-700 to-indigo-700'
            )}
          >
            Interactive Calendar
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className={cn(
            'text-lg sm:text-xl font-light max-w-2xl',
            theme === 'dark'
              ? 'text-slate-200'
              : 'text-slate-700'
          )}
        >
          Select dates, annotate events, and organize your time with elegance
        </motion.p>

        {/* Decorative line */}
        <motion.div
          className={cn(
            'mt-8 h-0.5 rounded-full',
            theme === 'dark'
              ? 'bg-gradient-to-r from-transparent via-indigo-400 to-transparent'
              : 'bg-gradient-to-r from-transparent via-indigo-500 to-transparent'
          )}
          initial={{ width: 0 }}
          animate={{ width: 120 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
      </div>

      {/* Subtle glow effect on hover */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-3xl pointer-events-none',
          'bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/0'
        )}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import useCalendarStore from '@/store/calendarStore';
import { motion } from 'framer-motion';
import HeroSection from './HeroSection';
import Calendar from './Calendar';
import NotesPanel from './NotesPanel';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

export default function CalendarPage() {
  const { theme, loadFromLocalStorage } = useCalendarStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // Enable keyboard navigation
  useKeyboardNavigation();

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  return (
    <div
      ref={containerRef}
      className={`min-h-screen transition-colors duration-500 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950'
          : 'bg-gradient-to-br from-white via-blue-50 to-slate-100'
      }`}
    >
      {/* Noise texture overlay for added depth */}
      <div
        className="fixed inset-0 pointer-events-none mix-blend-overlay opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' seed='1' /%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '400px 400px',
        }}
      />
      {/* Animated background elements with enhanced choreography */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary floating element */}
        <motion.div
          className={`absolute top-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-25 ${
            theme === 'dark' ? 'bg-blue-600' : 'bg-blue-300'
          }`}
          animate={{
            x: [0, 100, 0],
            y: [0, 150, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Secondary floating element */}
        <motion.div
          className={`absolute bottom-40 right-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-25 ${
            theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-300'
          }`}
          animate={{
            x: [0, -100, 0],
            y: [0, -150, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Tertiary accent element */}
        <motion.div
          className={`absolute top-1/2 left-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-10 ${
            theme === 'dark' ? 'bg-purple-600' : 'bg-purple-300'
          }`}
          animate={{
            x: [0, 60, 0],
            y: [0, -80, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Content with proper z-index and stagger animations */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <HeroSection />
          </motion.div>

          {/* Main Calendar and Notes Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {/* Calendar Section - takes 2/3 on desktop */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            >
              <Calendar />
            </motion.div>

            {/* Notes Section - takes 1/3 on desktop */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
            >
              <div className="sticky top-8">
                <NotesPanel />
              </div>
            </motion.div>
          </motion.div>

          {/* Footer hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={cn(
              'mt-16 text-center text-xs sm:text-sm font-medium py-4',
              theme === 'dark' ? 'text-slate-500' : 'text-slate-600'
            )}
          >
            <p>💡 Click or drag to select dates • Use keyboard arrows to navigate months</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Fix for missing import
import { cn } from '@/utils/cn';

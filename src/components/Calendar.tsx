'use client';

import { useCallback, useRef, useEffect, useMemo, useState } from 'react';
import useCalendarStore from '@/store/calendarStore';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { formatDateRange } from '@/utils/dateUtils';
import MonthNavigator from './MonthNavigator';
import CalendarGrid from './CalendarGrid';
import ThemeToggle from './ThemeToggle';
import InsightsPanel from './InsightsPanel';

export default function Calendar() {
  const {
    startDate,
    endDate,
    theme,
    currentMonth,
    isDragging,
    setIsDragging,
    resetSelection,
    toggleHeatmap,
    showHeatmap,
  } = useCalendarStore();

  const [showCursor, setShowCursor] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const monthKey = currentMonth.toISOString(); // Track month changes for flip animation

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const daysSelected = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return (
      Math.abs(
        Math.ceil(
          (new Date(endDate).getTime() - new Date(startDate).getTime()) /
          (1000 * 60 * 60 * 24)
        )
      ) + 1
    );
  }, [startDate, endDate]);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [setIsDragging]);

  const handleResetSelection = useCallback(() => {
    resetSelection();
  }, [resetSelection]);

  return (
    <div className="space-y-6">
      {/* Code header comment */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05 }}
        className={cn(
          'text-sm font-mono',
          theme === 'dark' ? 'text-slate-500' : 'text-slate-600'
        )}
      >
        {'// const calendar = new DeveloperCalendar()'}
      </motion.div>

      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={cn(
          'rounded-3xl backdrop-blur-xl border shadow-2xl overflow-hidden',
          'relative group perspective',
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/50 border-slate-700/60 shadow-slate-900/50'
            : 'bg-gradient-to-br from-white/60 via-slate-50/50 to-white/40 border-slate-300/60 shadow-slate-300/30'
        )}
      >
        {/* Premium glass gradient overlay */}
        <div
          className={cn(
            'absolute inset-0 rounded-3xl pointer-events-none',
            'bg-gradient-to-br from-white/5 via-white/0 to-white/0 opacity-0 group-hover:opacity-20',
            'transition-opacity duration-300'
          )}
        />

        {/* Code block styling */}
        <div className="p-6 sm:p-8 relative z-10">
          {/* Header section with developer theme */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className={cn(
                    'text-3xl font-bold font-mono tracking-tight',
                    theme === 'dark' ? 'text-green-400' : 'text-green-700'
                  )}
                  style={{ textShadow: theme === 'dark' ? '0 0 10px rgba(74, 222, 128, 0.3)' : 'none' }}
                >
                  {'// calendar.render()'}
                  <motion.span
                    animate={{ opacity: showCursor ? 1 : 0 }}
                    transition={{ duration: 0.05 }}
                    className={cn(
                      'inline-block ml-1 w-1 h-8 rounded-sm',
                      theme === 'dark' ? 'bg-green-400' : 'bg-green-700'
                    )}
                  />
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className={cn(
                    'mt-2 inline-block px-4 py-2 rounded-lg backdrop-blur-sm font-mono text-xs tracking-wide',
                    theme === 'dark'
                      ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300'
                      : 'bg-blue-400/20 border border-blue-400/40 text-blue-700'
                  )}
                >
                  <p className="font-medium">
                    {formatDateRange(startDate, endDate) || 'range: null'}
                  </p>
                </motion.div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleHeatmap}
                  title={showHeatmap ? 'Disable heatmap' : 'Enable heatmap'}
                  className={cn(
                    'px-3 py-2 rounded-lg text-xs font-mono font-medium transition-all',
                    showHeatmap
                      ? theme === 'dark'
                        ? 'bg-green-600/50 border border-green-500/60 text-green-300'
                        : 'bg-green-500/40 border border-green-400/60 text-green-700'
                      : theme === 'dark'
                        ? 'bg-slate-700/40 border border-slate-600/40 text-slate-400'
                        : 'bg-slate-300/40 border border-slate-200/40 text-slate-700',
                    'hover:scale-105'
                  )}
                >
                  {showHeatmap ? '📊 heatmap' : '📈 heatmap'}
                </motion.button>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>

          {/* Month Navigator with flip animation on month change */}
          <motion.div
            key={monthKey}
            initial={{ opacity: 0, rotateX: -90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            exit={{ opacity: 0, rotateX: 90 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ perspective: '1000px' }}
            className="mb-8"
          >
            <MonthNavigator />
          </motion.div>

          {/* Terminal logs effect */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={cn(
              'mb-6 px-4 py-3 rounded-lg backdrop-blur-sm border text-xs font-mono leading-relaxed',
              theme === 'dark'
                ? 'bg-slate-900/40 border-slate-700/40'
                : 'bg-slate-100/40 border-slate-300/40'
            )}
          >
            <div className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
              <div className={theme === 'dark' ? 'text-green-500' : 'text-green-700'}>
                {'> initializing calendar...'}
              </div>
              <div className="mt-1">
                {'✓ loaded'}
              </div>
              <div>
                {'✓ ready'}
              </div>
            </div>
          </motion.div>

          {/* Calendar Grid with flip animation */}
          <motion.div
            key={`grid-${monthKey}`}
            initial={{ opacity: 0, rotateX: -90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            exit={{ opacity: 0, rotateX: 90 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
            style={{ perspective: '1000px' }}
            className="mb-8"
          >
            <CalendarGrid />
          </motion.div>

          {/* Insights Panel */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8"
          >
            <InsightsPanel />
          </motion.div>

          {/* Selection summary and action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={cn(
              'pt-6 border-t',
              theme === 'dark' ? 'border-slate-700/40' : 'border-slate-300/40'
            )}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <AnimatePresence mode="wait">
                {startDate && endDate ? (
                  <motion.div
                    key="selected"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm font-mono text-xs',
                      theme === 'dark'
                        ? 'bg-green-600/30 border border-green-500/40 text-green-300'
                        : 'bg-green-500/30 border border-green-400/40 text-green-700'
                    )}
                  >
                    <span className="font-semibold">
                      {'>'} {daysSelected} {daysSelected === 1 ? 'day' : 'days'} selected
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={cn(
                      'text-xs font-mono font-medium',
                      theme === 'dark' ? 'text-slate-500' : 'text-slate-600'
                    )}
                  >
                    {'// select a date range'}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {startDate && endDate && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleResetSelection}
                    className={cn(
                      'px-4 py-2 rounded-lg font-medium text-xs font-mono transition-all',
                      'hover:scale-105 active:scale-95',
                      theme === 'dark'
                        ? 'bg-red-600/60 hover:bg-red-600/80 border border-red-500/50 text-red-300 shadow-lg shadow-red-500/20'
                        : 'bg-red-500/60 hover:bg-red-500/80 border border-red-400/50 text-red-700 shadow-lg shadow-red-400/20'
                    )}
                  >
                    {'// clear()'}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

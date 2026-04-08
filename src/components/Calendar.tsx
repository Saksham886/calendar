'use client';

import { useCallback, useRef, useEffect, useMemo } from 'react';
import useCalendarStore from '@/store/calendarStore';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp } from 'lucide-react';
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

  const containerRef = useRef<HTMLDivElement>(null);
  const monthKey = currentMonth.toISOString(); // Track month changes for flip animation

  // Blinking cursor effect is now CSS-based for performance
  // Removed setInterval to prevent constant re-renders

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
          theme === 'dark' ? 'text-[#94A3B8]' : 'text-[#64748B]'
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
            ? 'bg-gradient-to-br from-[#1E293B]/60 via-[#0F172A]/40 to-[#1E293B]/50 border-[#334155]/60 shadow-[#0F172A]/50'
            : 'bg-gradient-to-br from-[#FFFFFF]/60 via-[#F8FAFC]/50 to-[#FFFFFF]/40 border-[#E2E8F0]/60 shadow-[#0F172A]/10'
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
                    theme === 'dark' ? 'text-[#60A5FA]' : 'text-[#3B82F6]'
                  )}
                  style={{ textShadow: theme === 'dark' ? '0 0 10px rgba(96, 165, 250, 0.3)' : 'none' }}
                >
                  {'// calendar.render()'}
                  <span
                    className={cn(
                      'inline-block ml-1 w-1 h-8 rounded-sm animate-blink',
                      theme === 'dark' ? 'bg-[#60A5FA]' : 'bg-[#3B82F6]'
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
                      ? 'bg-[#60A5FA]/20 border border-[#60A5FA]/40 text-[#60A5FA]'
                      : 'bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#3B82F6]'
                  )}
                >
                  <p className="font-medium">
                    {formatDateRange(startDate, endDate) || 'range: null'}
                  </p>
                </motion.div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={toggleHeatmap}
                  title={showHeatmap ? 'Disable heatmap' : 'Enable heatmap'}
                  className={cn(
                    'px-3 py-2 rounded-lg text-xs font-mono font-medium transition-all hover:scale-105 active:scale-95',
                    showHeatmap
                      ? theme === 'dark'
                        ? 'bg-[#60A5FA]/50 border border-[#60A5FA]/60 text-[#E2E8F0]'
                        : 'bg-[#3B82F6]/40 border border-[#3B82F6]/60 text-[#0F172A]'
                      : theme === 'dark'
                        ? 'bg-[#334155]/40 border border-[#334155]/40 text-[#94A3B8]'
                        : 'bg-[#E2E8F0]/40 border border-[#E2E8F0]/40 text-[#0F172A]'
                  )}
                >
                  {showHeatmap ? '📊 heatmap' : '📈 heatmap'}
                </button>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>

          {/* Month Navigator with simple fade animation */}
          <motion.div
            key={monthKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
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
                ? 'bg-[#0F172A]/40 border-[#334155]/40'
                : 'bg-[#F8FAFC]/40 border-[#E2E8F0]/40'
            )}
          >
            <div className={theme === 'dark' ? 'text-[#94A3B8]' : 'text-[#64748B]'}>
              <div className={theme === 'dark' ? 'text-[#34D399]' : 'text-[#22C55E]'}>
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

          {/* Calendar Grid with simple fade animation */}
          <motion.div
            key={`grid-${monthKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
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
              theme === 'dark' ? 'border-[#334155]/40' : 'border-[#E2E8F0]/40'
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
                        ? 'bg-[#60A5FA]/30 border border-[#60A5FA]/40 text-[#60A5FA]'
                        : 'bg-[#3B82F6]/30 border border-[#3B82F6]/40 text-[#3B82F6]'
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
                      theme === 'dark' ? 'text-[#94A3B8]' : 'text-[#64748B]'
                    )}
                  >
                    {'// select a date range'}
                  </motion.div>
                )}
              </AnimatePresence>

              {startDate && endDate && (
                <button
                  onClick={handleResetSelection}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium text-xs font-mono transition-all',
                    'hover:scale-105 active:scale-95',
                    theme === 'dark'
                      ? 'bg-[#60A5FA]/60 hover:bg-[#60A5FA]/80 border border-[#60A5FA]/50 text-[#E2E8F0] shadow-lg shadow-[#60A5FA]/20'
                      : 'bg-[#3B82F6]/60 hover:bg-[#3B82F6]/80 border border-[#3B82F6]/50 text-[#FFFFFF] shadow-lg shadow-[#3B82F6]/20'
                  )}
                >
                  {'// clear()'}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

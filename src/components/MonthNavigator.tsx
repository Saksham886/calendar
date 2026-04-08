'use client';

import { useCallback } from 'react';
import useCalendarStore from '@/store/calendarStore';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { cn } from '@/utils/cn';
import { nextMonth, prevMonth, getMonthYear } from '@/utils/dateUtils';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';

export default function MonthNavigator() {
  const { currentMonth, setCurrentMonth, theme, resetSelection } = useCalendarStore();

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth(prevMonth(currentMonth));
  }, [currentMonth, setCurrentMonth]);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(nextMonth(currentMonth));
  }, [currentMonth, setCurrentMonth]);

  const handleToday = useCallback(() => {
    setCurrentMonth(new Date());
    resetSelection();
  }, [setCurrentMonth, resetSelection]);

  // Add swipe gesture support for mobile
  useSwipeGesture({
    onSwipeLeft: handleNextMonth,
    onSwipeRight: handlePrevMonth,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={cn(
        'flex items-center justify-between px-4 sm:px-6 py-4 rounded-2xl backdrop-blur-xl border shadow-lg',
        'group transition-all font-mono',
        theme === 'dark'
          ? 'bg-gradient-to-r from-[#1E293B]/60 to-[#0F172A]/50 border-[#334155]/60 hover:shadow-[#60A5FA]/15'
          : 'bg-gradient-to-r from-[#FFFFFF]/60 to-[#F8FAFC]/50 border-[#E2E8F0]/60 hover:shadow-[#3B82F6]/15'
      )}
    >
      {/* Previous month button */}
      <button
        onClick={handlePrevMonth}
        title="Previous month (← or swipe)"
        className={cn(
          'p-2.5 rounded-lg transition-all font-bold text-lg hover:scale-105 active:scale-95',
          theme === 'dark'
            ? 'hover:bg-[#60A5FA]/40 text-[#60A5FA] hover:text-[#A78BFA] border border-transparent hover:border-[#60A5FA]/40'
            : 'hover:bg-[#3B82F6]/40 text-[#3B82F6] hover:text-[#6366F1] border border-transparent hover:border-[#3B82F6]/40'
        )}
      >
        &lt;
      </button>

      {/* Month/Year display as code */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-center">
        <motion.div
          key={getMonthYear(currentMonth)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2"
        >
          <span
            className={cn(
              'text-xs font-mono font-light',
              theme === 'dark' ? 'text-[#94A3B8]' : 'text-[#64748B]'
            )}
          >
            {'const month ='}
          </span>
          <motion.h2
            className={cn(
              'text-lg sm:text-xl font-bold font-mono tracking-tight',
              theme === 'dark' ? 'text-[#60A5FA]' : 'text-[#3B82F6]'
            )}
            style={{
              textShadow: theme === 'dark' ? '0 0 10px rgba(96, 165, 250, 0.2)' : 'none',
            }}
          >
            {`"${getMonthYear(currentMonth)}"`}
          </motion.h2>
        </motion.div>

        {/* Today button */}
        <button
          onClick={handleToday}
          title="Go to today"
          className={cn(
            'p-2 rounded-lg transition-all font-bold text-sm hover:scale-110 active:scale-95',
            theme === 'dark'
              ? 'hover:bg-[#60A5FA]/40 text-[#60A5FA] hover:text-[#A78BFA] border border-transparent hover:border-[#60A5FA]/40'
              : 'hover:bg-[#3B82F6]/40 text-[#3B82F6] hover:text-[#6366F1] border border-transparent hover:border-[#3B82F6]/40'
          )}
        >
          ↻
        </button>
      </div>

      {/* Next month button */}
      <button
        onClick={handleNextMonth}
        title="Next month (→ or swipe)"
        className={cn(
          'p-2.5 rounded-lg transition-all font-bold text-lg hover:scale-105 active:scale-95',
          theme === 'dark'
            ? 'hover:bg-[#60A5FA]/40 text-[#60A5FA] hover:text-[#A78BFA] border border-transparent hover:border-[#60A5FA]/40'
            : 'hover:bg-[#3B82F6]/40 text-[#3B82F6] hover:text-[#6366F1] border border-transparent hover:border-[#3B82F6]/40'
        )}
      >
        &gt;
      </button>
    </motion.div>
  );
}

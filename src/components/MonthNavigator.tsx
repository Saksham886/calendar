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
          ? 'bg-gradient-to-r from-slate-900/60 to-slate-800/50 border-slate-700/60 hover:shadow-blue-500/15'
          : 'bg-gradient-to-r from-white/60 to-slate-50/50 border-slate-300/60 hover:shadow-blue-400/15'
      )}
    >
      {/* Previous month button */}
      <motion.button
        whileHover={{ scale: 1.15, x: -2 }}
        whileTap={{ scale: 0.85 }}
        onClick={handlePrevMonth}
        title="Previous month (← or swipe)"
        className={cn(
          'p-2.5 rounded-lg transition-all font-bold text-lg',
          theme === 'dark'
            ? 'hover:bg-blue-600/40 text-blue-400 hover:text-blue-300 border border-transparent hover:border-blue-500/40'
            : 'hover:bg-blue-500/40 text-blue-600 hover:text-blue-700 border border-transparent hover:border-blue-500/40'
        )}
      >
        &lt;
      </motion.button>

      {/* Month/Year display as code */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-center">
        <motion.div
          key={getMonthYear(currentMonth)}
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: 90 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ perspective: '1000px' }}
          className="flex items-center gap-2"
        >
          <span
            className={cn(
              'text-xs font-mono font-light',
              theme === 'dark' ? 'text-slate-500' : 'text-slate-600'
            )}
          >
            {'const month ='}
          </span>
          <motion.h2
            className={cn(
              'text-lg sm:text-xl font-bold font-mono tracking-tight',
              theme === 'dark' ? 'text-green-400' : 'text-green-700'
            )}
            style={{
              textShadow: theme === 'dark' ? '0 0 10px rgba(74, 222, 128, 0.2)' : 'none',
            }}
          >
            {`"${getMonthYear(currentMonth)}"`}
          </motion.h2>
        </motion.div>

        {/* Today button */}
        <motion.button
          whileHover={{ scale: 1.2, rotate: 180 }}
          whileTap={{ scale: 0.8 }}
          onClick={handleToday}
          title="Go to today"
          className={cn(
            'p-2 rounded-lg transition-all font-bold text-sm',
            theme === 'dark'
              ? 'hover:bg-purple-600/40 text-purple-400 hover:text-purple-300 border border-transparent hover:border-purple-500/40'
              : 'hover:bg-purple-500/40 text-purple-600 hover:text-purple-700 border border-transparent hover:border-purple-500/40'
          )}
        >
          ↻
        </motion.button>
      </div>

      {/* Next month button */}
      <motion.button
        whileHover={{ scale: 1.15, x: 2 }}
        whileTap={{ scale: 0.85 }}
        onClick={handleNextMonth}
        title="Next month (→ or swipe)"
        className={cn(
          'p-2.5 rounded-lg transition-all font-bold text-lg',
          theme === 'dark'
            ? 'hover:bg-blue-600/40 text-blue-400 hover:text-blue-300 border border-transparent hover:border-blue-500/40'
            : 'hover:bg-blue-500/40 text-blue-600 hover:text-blue-700 border border-transparent hover:border-blue-500/40'
        )}
      >
        &gt;
      </motion.button>
    </motion.div>
  );
}

'use client';

import { useMemo, memo } from 'react';
import useCalendarStore from '@/store/calendarStore';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { getWeeks } from '@/utils/dateUtils';
import DayCell from './DayCell';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarGrid = memo(function CalendarGrid() {
  const { currentMonth, theme } = useCalendarStore();

  const weeks = useMemo(() => getWeeks(currentMonth), [currentMonth]);

  return (
    <div className="space-y-4">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {WEEKDAYS.map(day => (
          <motion.div
            key={day}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 }}
            className={cn(
              'text-center text-xs sm:text-sm font-bold font-mono py-2 rounded-lg backdrop-blur-sm border',
              theme === 'dark'
                ? 'text-slate-300 bg-slate-800/30 border-slate-700/50 hover:border-blue-500/40 hover:text-blue-300'
                : 'text-slate-700 bg-slate-200/30 border-slate-300/50 hover:border-blue-400/40 hover:text-blue-700',
              'transition-all duration-200'
            )}
          >
            {day}
          </motion.div>
        ))}
      </div>

      {/* Calendar grid */}
      <motion.div
        layout
        className="space-y-2"
      >
        {weeks.map((week, weekIndex) => (
          <motion.div
            key={`week-${weekIndex}`}
            layout
            className="grid grid-cols-7 gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: weekIndex * 0.05 }}
          >
            {week.map((date, dayIndex) => (
              <DayCell
                key={date.toISOString()}
                date={date}
                currentMonth={currentMonth}
                index={weekIndex * 7 + dayIndex}
              />
            ))}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
});

export default CalendarGrid;


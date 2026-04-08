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
          <div
            key={day}
            className={cn(
              'text-center text-xs sm:text-sm font-bold font-mono py-2 rounded-lg backdrop-blur-sm border',
              theme === 'dark'
                ? 'text-[#E2E8F0] bg-[#1E293B]/30 border-[#334155]/50 hover:border-[#60A5FA]/40 hover:text-[#60A5FA]'
                : 'text-[#0F172A] bg-[#F8FAFC]/30 border-[#E2E8F0]/50 hover:border-[#3B82F6]/40 hover:text-[#3B82F6]',
              'transition-all duration-200'
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-2">
        {weeks.map((week, weekIndex) => (
          <div
            key={`week-${weekIndex}`}
            className="grid grid-cols-7 gap-2"
          >
            {week.map((date, dayIndex) => (
              <DayCell
                key={date.toISOString()}
                date={date}
                currentMonth={currentMonth}
                index={weekIndex * 7 + dayIndex}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

export default CalendarGrid;


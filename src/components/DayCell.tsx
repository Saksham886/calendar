'use client';

import { useCallback, memo, useState, useMemo } from 'react';
import useCalendarStore from '@/store/calendarStore';
import { motion } from 'framer-motion';
import { isSameDay, isSameMonth, isToday, format, formatDistanceToNow } from 'date-fns';
import { FileText, Gift } from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  isDateInRange,
  isDateRangeStart,
  isDateRangeEnd,
  isDateHoliday,
} from '@/utils/dateUtils';
import { HOLIDAYS_US } from '@/constants';
import Tooltip from './Tooltip';
import HeatmapCell from './HeatmapCell';

interface DayCellProps {
  date: Date;
  currentMonth: Date;
  index: number;
}

// Memoized component with custom comparison function for performance
const DayCell = memo(function DayCell({ date, currentMonth, index }: DayCellProps) {
  const {
    startDate,
    endDate,
    hoverDate,
    isDragging,
    theme,
    setStartDate,
    setEndDate,
    selectDateRange,
    setHoverDate,
    setIsDragging,
    hasNotesOnDate,
    getNotesForDate,
  } = useCalendarStore();

  const [showTooltip, setShowTooltip] = useState(false);

  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isTodayDate = isToday(date);
  const isInRange = isDateInRange(date, startDate, endDate);
  const isStart = isDateRangeStart(date, startDate, endDate);
  const isEnd = isDateRangeEnd(date, startDate, endDate);
  const holiday = isDateHoliday(date, HOLIDAYS_US);
  const hasNotes = useMemo(() => hasNotesOnDate(date), [date, hasNotesOnDate]);

  const handleClick = useCallback(() => {
    if (isDragging) return;
    if (!isCurrentMonth) return;
    selectDateRange(date);
  }, [date, isDragging, selectDateRange, isCurrentMonth]);

  const handleMouseEnter = useCallback(() => {
    setHoverDate(date);
    setShowTooltip(isCurrentMonth);
    if (isCurrentMonth && startDate && !endDate && isDragging) {
      setEndDate(date);
    }
  }, [date, startDate, endDate, isDragging, setHoverDate, setEndDate, isCurrentMonth]);

  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false);
  }, []);

  const handleMouseDown = useCallback(() => {
    if (!isCurrentMonth) return;
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setIsDragging(true);
    }
  }, [date, startDate, endDate, setStartDate, setIsDragging, isCurrentMonth]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);

  const isHoveredInRange =
    startDate && !endDate && hoverDate && isDateInRange(date, startDate, hoverDate);

  const isEdge = isStart || isEnd;

  const dateLabel = format(date, 'EEE, MMM d, yyyy');
  const relativeDate = isTodayDate ? 'Today' : formatDistanceToNow(date, { addSuffix: true });

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      className={cn(
        'relative aspect-square rounded-xl p-1 sm:p-2 cursor-pointer transition-all duration-200 hover:scale-105',
        'backdrop-blur-md group',
        !isCurrentMonth && 'opacity-40 cursor-default',
        // Hover glow effect
        isCurrentMonth && theme === 'dark'
          ? 'hover:bg-[#1E293B]/50 hover:shadow-2xl hover:shadow-[#60A5FA]/30 hover:border-[#60A5FA]/50'
          : 'hover:bg-[#F0F4F8]/70 hover:shadow-2xl hover:shadow-[#3B82F6]/40 hover:border-[#3B82F6]/50',
        isCurrentMonth && 'border border-[#334155]/30 dark:border-[#334155]/30 hover:border-[#60A5FA]/50',
        // Today styling
        isTodayDate && !isInRange && !isHoveredInRange && theme === 'dark'
          ? 'bg-gradient-to-br from-[#34D399]/25 to-[#10B981]/15 border border-[#34D399]/60 shadow-lg shadow-[#34D399]/20'
          : isTodayDate && !isInRange && !isHoveredInRange && theme === 'light'
            ? 'bg-gradient-to-br from-[#22C55E]/25 to-[#16A34A]/15 border border-[#22C55E]/60 shadow-lg shadow-[#22C55E]/20'
            : ''
      )}
    >
      {/* Heatmap intensity overlay */}
      <HeatmapCell date={date} currentMonth={currentMonth} />

      {/* Tooltip on hover */}
      <div className="relative">
        <Tooltip
          isVisible={showTooltip && isCurrentMonth}
          content={
            <div className="text-center">
              <div>{dateLabel}</div>
              <div className="text-opacity-70 text-xs">{relativeDate}</div>
              {hasNotes && (
                <div className="text-xs mt-2 max-w-xs">
                  {getNotesForDate(date).slice(0, 2).map((note, i) => (
                    <div key={note.id} className="text-xs opacity-90 truncate flex items-center gap-1">
                      <FileText className="w-3 h-3 flex-shrink-0" /> {note.content}
                    </div>
                  ))}
                  {getNotesForDate(date).length > 2 && (
                    <div className="text-xs opacity-70">+{getNotesForDate(date).length - 2} more</div>
                  )}
                </div>
              )}
            </div>
          }
          position="top"
        />
      </div>

      {/* Range highlight background with premium glass effect */}
      {(isInRange || isHoveredInRange) && (
        <motion.div
          layoutId="rangeHighlight"
          className={cn(
            'absolute inset-0 rounded-xl -z-10 backdrop-blur-sm',
            theme === 'dark'
              ? 'bg-gradient-to-r from-[#60A5FA]/40 via-[#60A5FA]/35 to-[#60A5FA]/40'
              : 'bg-gradient-to-r from-[#3B82F6]/35 via-[#3B82F6]/30 to-[#3B82F6]/35',
            isEdge && theme === 'dark' && 'shadow-lg shadow-[#60A5FA]/40',
            isEdge && theme === 'light' && 'shadow-lg shadow-[#3B82F6]/30'
          )}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Date number with enhanced styling */}
      <div
        className={cn(
          'relative z-10 text-xs sm:text-sm font-bold mb-1 hover:scale-105 transition-transform',
          isCurrentMonth && theme === 'dark'
            ? 'text-[#E2E8F0]'
            : isCurrentMonth && theme === 'light'
              ? 'text-[#0F172A]'
              : theme === 'dark'
                ? 'text-[#64748B]'
                : 'text-[#CBD5E1]',
          isEdge && theme === 'dark' && 'text-white',
          isEdge && theme === 'light' && 'text-[#3B82F6]',
          isInRange && isCurrentMonth && theme === 'dark' && 'text-white',
          isInRange && isCurrentMonth && theme === 'light' && 'text-[#3B82F6]'
        )}
      >
        {format(date, 'd')}
      </div>

      {/* Start/End date indicators */}
      {isEdge && (
        <div
          className={cn(
            'absolute top-1 right-1 w-2 h-2 rounded-full ring-2 ring-offset-1',
            theme === 'dark'
              ? 'bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] ring-[#60A5FA]'
              : 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] ring-[#3B82F6]',
            'shadow-lg'
          )}
        />
      )}

      {/* Holiday/Weekend indicator */}
      {holiday && (
        <div
          className={cn(
            'text-xs font-bold mt-0.5 flex justify-center',
            theme === 'dark' ? 'text-amber-300' : 'text-amber-600'
          )}
          title={holiday}
        >
          <Gift className="w-4 h-4" />
        </div>
      )}

      {/* Notes indicator */}
      {hasNotes && (
        <div
          className={cn(
            'absolute bottom-1 right-1 w-2 h-2 rounded-full',
            theme === 'dark' ? 'bg-[#60A5FA] shadow-lg shadow-[#60A5FA]/50' : 'bg-[#3B82F6] shadow-lg shadow-[#3B82F6]/40'
          )}
        />
      )}

      {/* Today indicator */}
      {isTodayDate && (
        <div
          className={cn(
            'absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full',
            theme === 'dark' ? 'bg-[#34D399] shadow-lg shadow-[#34D399]/50' : 'bg-[#22C55E] shadow-lg shadow-[#22C55E]/40'
          )}
        />
      )}

      {/* Glass effect border for selected dates */}
      {isEdge && (
        <motion.div
          className={cn(
            'absolute inset-0 rounded-xl border-2 pointer-events-none backdrop-blur-sm',
            theme === 'dark'
              ? 'border-[#60A5FA]/90 shadow-[inset_0_1px_3px_rgba(96,165,250,0.3)]'
              : 'border-[#3B82F6]/90 shadow-[inset_0_1px_3px_rgba(59,130,246,0.3)]'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Subtle hover glow */}
      <div
        className={cn(
          'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none',
          'bg-gradient-to-br from-white/10 to-white/0',
          'transition-opacity duration-300'
        )}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if critical props change
  return (
    prevProps.date.getTime() === nextProps.date.getTime() &&
    prevProps.currentMonth.getTime() === nextProps.currentMonth.getTime() &&
    prevProps.index === nextProps.index
  );
});

export default DayCell;

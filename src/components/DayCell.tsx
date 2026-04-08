'use client';

import { useCallback, memo, useState } from 'react';
import useCalendarStore from '@/store/calendarStore';
import { motion } from 'framer-motion';
import { isSameDay, isSameMonth, isToday, format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/utils/cn';
import {
  isDateInRange,
  isDateRangeStart,
  isDateRangeEnd,
  isDateHoliday,
} from '@/utils/dateUtils';
import { HOLIDAYS_US } from '@/constants';
import Tooltip from './Tooltip';

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
    notes,
  } = useCalendarStore();

  const [showTooltip, setShowTooltip] = useState(false);

  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isTodayDate = isToday(date);
  const isInRange = isDateInRange(date, startDate, endDate);
  const isStart = isDateRangeStart(date, startDate, endDate);
  const isEnd = isDateRangeEnd(date, startDate, endDate);
  const holiday = isDateHoliday(date, HOLIDAYS_US);
  const hasNotes = notes.some(
    n =>
      n.range.start &&
      n.range.end &&
      isDateInRange(date, n.range.start, n.range.end)
  );

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
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.01 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      whileHover={isCurrentMonth ? { scale: 1.12, y: -4 } : {}}
      className={cn(
        'relative aspect-square rounded-xl p-1 sm:p-2 cursor-pointer transition-all duration-200',
        'backdrop-blur-md group',
        !isCurrentMonth && 'opacity-40 cursor-default',
        // Hover glow effect - developer style
        isCurrentMonth && theme === 'dark'
          ? 'hover:bg-slate-700/50 hover:shadow-2xl hover:shadow-blue-500/30 hover:border-blue-500/50'
          : 'hover:bg-slate-200/70 hover:shadow-2xl hover:shadow-blue-400/40 hover:border-blue-400/50',
        isCurrentMonth && 'border border-slate-600/30 hover:border-blue-500/50',
        // Today styling with enhanced visual
        isTodayDate && !isInRange && !isHoveredInRange && theme === 'dark'
          ? 'bg-gradient-to-br from-green-500/25 to-emerald-500/15 border border-green-500/60 shadow-lg shadow-green-500/20'
          : isTodayDate && !isInRange && !isHoveredInRange && theme === 'light'
            ? 'bg-gradient-to-br from-green-400/25 to-emerald-400/15 border border-green-500/60 shadow-lg shadow-green-500/20'
            : ''
      )}
    >
      {/* Tooltip on hover */}
      <div className="relative">
        <Tooltip
          isVisible={showTooltip && isCurrentMonth}
          content={
            <div className="text-center">
              <div>{dateLabel}</div>
              <div className="text-opacity-70 text-xs">{relativeDate}</div>
              {hasNotes && <div className="text-xs mt-1">📝 Has notes</div>}
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
              ? 'bg-gradient-to-r from-indigo-500/40 via-blue-500/35 to-indigo-500/40'
              : 'bg-gradient-to-r from-indigo-400/35 via-blue-400/30 to-indigo-400/35',
            isEdge && theme === 'dark' && 'shadow-lg shadow-indigo-500/40',
            isEdge && theme === 'light' && 'shadow-lg shadow-indigo-400/30'
          )}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Date number with enhanced styling */}
      <motion.div
        whileHover={isCurrentMonth ? { scale: 1.2 } : {}}
        className={cn(
          'relative z-10 text-xs sm:text-sm font-bold mb-1',
          isCurrentMonth && theme === 'dark'
            ? 'text-slate-100'
            : isCurrentMonth && theme === 'light'
              ? 'text-slate-900'
              : theme === 'dark'
                ? 'text-slate-600'
                : 'text-slate-400',
          isEdge && theme === 'dark' && 'text-white',
          isEdge && theme === 'light' && 'text-indigo-700',
          isInRange && isCurrentMonth && theme === 'dark' && 'text-white',
          isInRange && isCurrentMonth && theme === 'light' && 'text-indigo-700'
        )}
      >
        {format(date, 'd')}
      </motion.div>

      {/* Start/End date indicators with glow */}
      {isEdge && (
        <motion.div
          layoutId={isStart ? 'startDate' : 'endDate'}
          className={cn(
            'absolute top-1 right-1 w-2 h-2 rounded-full ring-2 ring-offset-1',
            theme === 'dark'
              ? 'bg-gradient-to-r from-indigo-400 to-blue-400 ring-indigo-300'
              : 'bg-gradient-to-r from-indigo-600 to-blue-600 ring-indigo-400',
            'shadow-lg'
          )}
          animate={{
            boxShadow: [
              'inset 0 0 0 0 rgba(99, 102, 241, 0.8)',
              'inset 0 0 0 8px rgba(99, 102, 241, 0)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Holiday/Weekend indicator */}
      {holiday && (
        <div
          className={cn(
            'text-xs font-bold mt-0.5',
            theme === 'dark' ? 'text-amber-300' : 'text-amber-600'
          )}
          title={holiday}
        >
          🎉
        </div>
      )}

      {/* Notes indicator with enhanced dot */}
      {hasNotes && (
        <motion.div
          className={cn(
            'absolute bottom-1 right-1 w-2 h-2 rounded-full',
            theme === 'dark' ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50' : 'bg-cyan-500 shadow-lg shadow-cyan-500/40'
          )}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Today indicator */}
      {isTodayDate && (
        <motion.div
          className={cn(
            'absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full',
            theme === 'dark' ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-green-500 shadow-lg shadow-green-500/40'
          )}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Glass effect border for selected dates */}
      {isEdge && (
        <motion.div
          className={cn(
            'absolute inset-0 rounded-xl border-2 pointer-events-none backdrop-blur-sm',
            theme === 'dark'
              ? 'border-indigo-400/90 shadow-[inset_0_1px_3px_rgba(139,92,246,0.3)]'
              : 'border-indigo-500/90 shadow-[inset_0_1px_3px_rgba(79,70,229,0.3)]'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Subtle hover glow */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none',
          'bg-gradient-to-br from-white/10 to-white/0'
        )}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
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

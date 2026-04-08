'use client';

import { useMemo } from 'react';
import useCalendarStore from '@/store/calendarStore';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface HeatmapCellProps {
  date: Date;
  currentMonth: Date;
}

export default function HeatmapCell({ date, currentMonth }: HeatmapCellProps) {
  const { notes, theme, showHeatmap } = useCalendarStore();

  const intensity = useMemo(() => {
    if (!showHeatmap) return 0;

    // Count notes on this date
    const notesOnDate = notes.filter(note => {
      if (!note.range.start || !note.range.end) return false;
      const start = new Date(note.range.start);
      const end = new Date(note.range.end);
      return date >= start && date <= end;
    }).length;

    return Math.min(notesOnDate, 4); // 0-4 intensity levels
  }, [date, notes, showHeatmap]);

  if (!showHeatmap) return null;

  const intensityColors = {
    0: theme === 'dark' ? 'bg-slate-700/20' : 'bg-slate-200/20',
    1: theme === 'dark' ? 'bg-green-600/40' : 'bg-green-400/40',
    2: theme === 'dark' ? 'bg-green-500/60' : 'bg-green-400/60',
    3: theme === 'dark' ? 'bg-green-400/80' : 'bg-green-400/80',
    4: theme === 'dark' ? 'bg-green-400' : 'bg-green-500',
  };

  const isCurrentMonth = date.getMonth() === currentMonth.getMonth();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'absolute inset-0 rounded-lg transition-all duration-200',
        intensityColors[intensity as keyof typeof intensityColors],
        intensity > 0 && 'ring ring-green-400/50'
      )}
    />
  );
}

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
  const { theme, showHeatmap, getNoteIntensity } = useCalendarStore();

  const intensity = useMemo(() => {
    if (!showHeatmap) return 0;
    return getNoteIntensity(date);
  }, [date, showHeatmap, getNoteIntensity]);

  if (!showHeatmap) return null;

  const intensityColors = {
    0: theme === 'dark' ? 'bg-[#334155]/20' : 'bg-[#E2E8F0]/20',
    1: theme === 'dark' ? 'bg-[#034DB3]/40' : 'bg-[#DBEAFE]/40',
    2: theme === 'dark' ? 'bg-[#0284C7]/60' : 'bg-[#7DD3FC]/60',
    3: theme === 'dark' ? 'bg-[#0EA5E9]/80' : 'bg-[#38BDF8]/80',
    4: theme === 'dark' ? 'bg-[#60A5FA]' : 'bg-[#3B82F6]',
  };

  const isCurrentMonth = date.getMonth() === currentMonth.getMonth();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'absolute inset-0 rounded-lg transition-all duration-200',
        intensityColors[intensity as keyof typeof intensityColors],
        intensity > 0 && 'ring ring-[#60A5FA]/50'
      )}
    />
  );
}

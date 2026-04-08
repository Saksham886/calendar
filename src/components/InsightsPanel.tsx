'use client';

import { useMemo } from 'react';
import useCalendarStore from '@/store/calendarStore';
import { motion } from 'framer-motion';
import { FileText, BarChart3, Calendar, Flame, TrendingUp } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Insight {
  label: string;
  value: number;
  icon: string;
  color: 'green' | 'blue' | 'purple' | 'yellow';
}

const iconMap: { [key: string]: React.ReactNode } = {
  Calendar: <Calendar className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
};

export default function InsightsPanel() {
  const { startDate, endDate, notes, theme } = useCalendarStore();

  const insights = useMemo(() => {
    const result: Insight[] = [];

    // Calculate selected days
    if (startDate && endDate) {
      const daysDiff = Math.abs(
        Math.ceil(
          (new Date(endDate).getTime() - new Date(startDate).getTime()) /
          (1000 * 60 * 60 * 24)
        )
      ) + 1;
      result.push({
        label: 'selected_days',
        value: daysDiff,
        icon: 'Calendar',
        color: 'green',
      });
    }

    // Calculate longest streak
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      let currentStreak = 1;
      let maxStreak = 1;
      
      for (let i = 1; i < Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24); i++) {
        currentStreak++;
      }
      maxStreak = currentStreak;
      
      result.push({
        label: 'longest_streak',
        value: maxStreak,
        icon: 'Flame',
        color: 'yellow',
      });
    }

    // Count notes
    if (notes.length > 0) {
      result.push({
        label: 'notes',
        value: notes.length,
        icon: 'FileText',
        color: 'blue',
      });
    }

    // Calculate note density
    if (notes.length > 0 && startDate && endDate) {
      const avgCharsPerDay = Math.floor(
        notes.reduce((sum, n) => sum + n.content.length, 0) /
        (Math.abs(
          Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
            (1000 * 60 * 60 * 24)
          )
        ) + 1)
      );
      result.push({
        label: 'avg_note_length',
        value: avgCharsPerDay,
        icon: 'BarChart3',
        color: 'purple',
      });
    }

    return result;
  }, [startDate, endDate, notes]);

  const colorMap = {
    green: {
      dark: 'from-[#34D399]/30 to-[#10B981]/20 border-[#34D399]/40 text-[#34D399]',
      light: 'from-[#22C55E]/30 to-[#16A34A]/20 border-[#22C55E]/40 text-[#15803D]',
    },
    blue: {
      dark: 'from-[#60A5FA]/30 to-[#3B82F6]/20 border-[#60A5FA]/40 text-[#60A5FA]',
      light: 'from-[#3B82F6]/30 to-[#2563EB]/20 border-[#3B82F6]/40 text-[#1D4ED8]',
    },
    purple: {
      dark: 'from-[#A78BFA]/30 to-[#8B5CF6]/20 border-[#A78BFA]/40 text-[#C4B5FD]',
      light: 'from-[#6366F1]/30 to-[#4F46E5]/20 border-[#6366F1]/40 text-[#312E81]',
    },
    yellow: {
      dark: 'from-[#FBBF24]/30 to-[#F59E0B]/20 border-[#FBBF24]/40 text-[#FCD34D]',
      light: 'from-[#FBBF24]/30 to-[#F59E0B]/20 border-[#FBBF24]/40 text-[#92400E]',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={cn(
        'rounded-2xl backdrop-blur-sm border p-6 space-y-4',
        theme === 'dark'
          ? 'bg-[#1E293B]/40 border-[#334155]/50'
          : 'bg-[#F8FAFC]/40 border-[#E2E8F0]/50'
      )}
    >
      {/* Header as code comment */}
      <div
        className={cn(
          'text-sm font-mono mb-4',
          theme === 'dark' ? 'text-[#94A3B8]' : 'text-[#64748B]'
        )}
      >
        {'// insights'}
      </div>

      {insights.length === 0 ? (
        <div
          className={cn(
            'text-sm font-mono',
            theme === 'dark' ? 'text-[#94A3B8]' : 'text-[#64748B]'
          )}
        >
          {'// select a date range to view insights'}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {insights.map((insight, idx) => (
            <motion.div
              key={insight.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
              className={cn(
                'rounded-lg border backdrop-blur-sm p-4',
                `bg-gradient-to-br ${colorMap[insight.color][theme]}`
              )}
            >
              <div className="text-2xl font-bold mb-1">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + idx * 0.05, duration: 0.5 }}
                >
                  {insight.value}
                </motion.span>
              </div>
              <div className="text-xs font-mono opacity-80">
                {insight.label.replace(/_/g, '_')}
              </div>
              <div className="text-lg mt-2 text-xl">
                {iconMap[insight.icon] || insight.icon}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Code-like footer */}
      {insights.length > 0 && (
        <div
          className={cn(
            'text-xs font-mono mt-4 pt-4 border-t',
            theme === 'dark'
              ? 'border-[#334155]/50 text-[#94A3B8]'
              : 'border-[#E2E8F0]/50 text-[#64748B]'
          )}
        >
          {'// powered by developer intelligence'}
        </div>
      )}
    </motion.div>
  );
}

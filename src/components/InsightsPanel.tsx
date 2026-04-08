'use client';

import { useMemo } from 'react';
import useCalendarStore from '@/store/calendarStore';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface Insight {
  label: string;
  value: number;
  icon: string;
  color: 'green' | 'blue' | 'purple' | 'yellow';
}

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
        icon: '📅',
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
        icon: '🔥',
        color: 'yellow',
      });
    }

    // Count notes
    result.push({
      label: 'notes',
      value: notes.length,
      icon: '📝',
      color: 'blue',
    });

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
        icon: '📊',
        color: 'purple',
      });
    }

    return result;
  }, [startDate, endDate, notes]);

  const colorMap = {
    green: {
      dark: 'from-emerald-500/30 to-emerald-600/20 border-emerald-500/40 text-emerald-300',
      light: 'from-emerald-400/30 to-emerald-500/20 border-emerald-400/40 text-emerald-700',
    },
    blue: {
      dark: 'from-blue-500/30 to-blue-600/20 border-blue-500/40 text-blue-300',
      light: 'from-blue-400/30 to-blue-500/20 border-blue-400/40 text-blue-700',
    },
    purple: {
      dark: 'from-purple-500/30 to-purple-600/20 border-purple-500/40 text-purple-300',
      light: 'from-purple-400/30 to-purple-500/20 border-purple-400/40 text-purple-700',
    },
    yellow: {
      dark: 'from-amber-500/30 to-amber-600/20 border-amber-500/40 text-amber-300',
      light: 'from-amber-400/30 to-amber-500/20 border-amber-400/40 text-amber-700',
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
          ? 'bg-slate-800/40 border-slate-700/50'
          : 'bg-slate-100/40 border-slate-200/50'
      )}
    >
      {/* Header as code comment */}
      <div
        className={cn(
          'text-sm font-mono mb-4',
          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
        )}
      >
        {'// insights'}
      </div>

      {insights.length === 0 ? (
        <div
          className={cn(
            'text-sm font-mono',
            theme === 'dark' ? 'text-slate-500' : 'text-slate-600'
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
              <div className="text-lg mt-2">{insight.icon}</div>
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
              ? 'border-slate-700/50 text-slate-500'
              : 'border-slate-200/50 text-slate-600'
          )}
        >
          {'// powered by developer intelligence'}
        </div>
      )}
    </motion.div>
  );
}

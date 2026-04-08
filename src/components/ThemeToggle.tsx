'use client';

import { useCallback } from 'react';
import useCalendarStore from '@/store/calendarStore';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useCalendarStore();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={cn(
        'p-2.5 rounded-full transition-colors border',
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700/50 text-yellow-400 hover:bg-slate-700/50'
          : 'bg-slate-200/50 border-slate-300/50 text-slate-700 hover:bg-slate-300/50'
      )}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </motion.div>
    </motion.button>
  );
}

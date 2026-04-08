'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import useCalendarStore from '@/store/calendarStore';

interface TooltipProps {
  isVisible: boolean;
  content: React.ReactNode;
  position?: 'top' | 'bottom';
}

export default function Tooltip({ isVisible, content, position = 'top' }: TooltipProps) {
  const { theme } = useCalendarStore();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: position === 'top' ? 4 : -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: position === 'top' ? 4 : -4 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'absolute z-50 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap backdrop-blur-xl border shadow-xl pointer-events-none font-mono',
            position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
            'left-1/2 -translate-x-1/2',
            theme === 'dark'
              ? 'bg-slate-800/95 border-slate-600/60 text-slate-100 shadow-blue-500/20'
              : 'bg-slate-100/95 border-slate-300/60 text-slate-900 shadow-blue-400/20'
          )}
        >
          {content}
          {/* Tooltip arrow */}
          <div
            className={cn(
              'absolute w-2 h-2 rounded-xs pointer-events-none',
              'left-1/2 -translate-x-1/2',
              position === 'top'
                ? 'top-full border-r border-b'
                : 'bottom-full border-l border-t',
              theme === 'dark'
                ? 'border-slate-700'
                : 'border-slate-300'
            )}
            style={{
              width: '6px',
              height: '6px',
              backgroundColor: theme === 'dark' ? '#1e293b' : '#f1f5f9',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

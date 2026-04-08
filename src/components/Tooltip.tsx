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
              ? 'bg-[#1E293B]/95 border-[#334155]/60 text-[#E2E8F0] shadow-[#60A5FA]/20'
              : 'bg-[#F8FAFC]/95 border-[#E2E8F0]/60 text-[#0F172A] shadow-[#3B82F6]/20'
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
                ? 'border-[#334155]'
                : 'border-[#E2E8F0]'
            )}
            style={{
              width: '6px',
              height: '6px',
              backgroundColor: theme === 'dark' ? '#1E293B' : '#F8FAFC',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

'use client';

import { useCallback } from 'react';
import useCalendarStore from '@/store/calendarStore';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useCalendarStore();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'p-2.5 rounded-full transition-all border hover:scale-110 active:scale-95',
        theme === 'dark'
          ? 'bg-[#1E293B]/50 border-[#334155]/50 text-[#60A5FA] hover:bg-[#0F172A]/50'
          : 'bg-[#F8FAFC]/50 border-[#E2E8F0]/50 text-[#3B82F6] hover:bg-[#E0E7FF]/50'
      )}
    >
      <div
        className={cn(
          'transition-transform duration-300',
          theme === 'dark' && 'rotate-180'
        )}
      >
        {theme === 'dark' ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </div>
    </button>
  );
}

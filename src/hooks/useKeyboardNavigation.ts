'use client';

import { useEffect, useCallback } from 'react';
import useCalendarStore from '@/store/calendarStore';
import { isSameDay, addDays } from 'date-fns';

export function useKeyboardNavigation() {
  const {
    currentMonth,
    startDate,
    setStartDate,
    setEndDate,
    setCurrentMonth,
  } = useCalendarStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Navigate months
      if (e.key === 'ArrowLeft' && e.ctrlKey) {
        e.preventDefault();
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
      } else if (e.key === 'ArrowRight' && e.ctrlKey) {
        e.preventDefault();
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
      }

      // Navigate dates
      if ((e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !e.ctrlKey) {
        e.preventDefault();
        if (!startDate) return;

        let newDate = new Date(startDate);
        if (e.key === 'ArrowLeft') newDate = addDays(newDate, -1);
        else if (e.key === 'ArrowRight') newDate = addDays(newDate, 1);
        else if (e.key === 'ArrowUp') newDate = addDays(newDate, -7);
        else if (e.key === 'ArrowDown') newDate = addDays(newDate, 7);

        setStartDate(newDate);
      }

      // Reset selection
      if ((e.key === 'Escape' || e.key === 'Backspace') && startDate) {
        e.preventDefault();
        setStartDate(null);
        setEndDate(null);
      }
    },
    [currentMonth, startDate, setCurrentMonth, setStartDate, setEndDate]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

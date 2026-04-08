import { create } from 'zustand';
import { CalendarState, Note, SelectionRange } from '@/types';

let saveTimeout: NodeJS.Timeout | null = null;

// Pre-calculate note dates for efficient lookups
const getNoteIntensity = (date: Date, notes: Note[]): number => {
  let intensity = 0;
  for (const note of notes) {
    if (!note.range.start || !note.range.end) continue;
    const start = new Date(note.range.start);
    const end = new Date(note.range.end);
    if (date >= start && date <= end) {
      intensity = Math.min(intensity + 1, 4);
    }
  }
  return intensity;
};

const hasNotesOnDate = (date: Date, notes: Note[]): boolean => {
  return notes.some(n =>
    n.range.start &&
    n.range.end &&
    date >= new Date(n.range.start) &&
    date <= new Date(n.range.end)
  );
};

const getNotesForDate = (date: Date, notes: Note[]): Note[] => {
  return notes.filter(n =>
    n.range.start &&
    n.range.end &&
    date >= new Date(n.range.start) &&
    date <= new Date(n.range.end)
  );
};

let debouncedCallback: (() => void) | null = null;

const debouncedSave = (callback: () => void) => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    callback();
  }, 500);
};

interface CalendarStore extends CalendarState {
  getNoteIntensity: (date: Date) => number;
  hasNotesOnDate: (date: Date) => boolean;
  getNotesForDate: (date: Date) => Note[];
  setCurrentMonth: (date: Date) => void;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  setHoverDate: (date: Date | null) => void;
  setIsDragging: (dragging: boolean) => void;
  selectDateRange: (start: Date, end?: Date) => void;
  resetSelection: () => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  toggleTheme: () => void;
  toggleHeatmap: () => void;
  addSelectionRange: (range: SelectionRange) => void;
  removeSelectionRange: (id: string) => void;
  loadFromLocalStorage: () => void;
  saveToLocalStorage: () => void;
}

const useCalendarStore = create<CalendarStore>((set, get) => ({
  currentMonth: new Date(),
  startDate: null,
  endDate: null,
  hoverDate: null,
  isDragging: false,
  notes: [],
  theme: 'dark',
  showHeatmap: false,
  selectionRanges: [],

  getNoteIntensity: (date: Date) => getNoteIntensity(date, get().notes),
  hasNotesOnDate: (date: Date) => hasNotesOnDate(date, get().notes),
  getNotesForDate: (date: Date) => getNotesForDate(date, get().notes),

  setCurrentMonth: (date: Date) =>
    set({ currentMonth: new Date(date) }),

  setStartDate: (date: Date | null) =>
    set({ startDate: date }),

  setEndDate: (date: Date | null) =>
    set({ endDate: date }),

  setHoverDate: (date: Date | null) =>
    set({ hoverDate: date }),

  setIsDragging: (dragging: boolean) =>
    set({ isDragging: dragging }),

  selectDateRange: (start: Date, end?: Date) => {
    const state = get();
    
    if (!state.startDate) {
      set({ startDate: start });
    } else if (!state.endDate) {
      if (end) {
        set({ endDate: end });
      } else {
        set({ endDate: start });
      }
    } else {
      set({ startDate: start, endDate: undefined });
    }
  },

  resetSelection: () =>
    set({ startDate: null, endDate: null, hoverDate: null, isDragging: false }),

  addNote: (note: Note) => {
    const state = get();
    set({ notes: [...state.notes, note] });
    debouncedSave(() => get().saveToLocalStorage());
  },

  updateNote: (id: string, content: string) => {
    const state = get();
    const updatedNotes = state.notes.map(note =>
      note.id === id
        ? { ...note, content, updatedAt: new Date() }
        : note
    );
    set({ notes: updatedNotes });
    debouncedSave(() => get().saveToLocalStorage());
  },

  deleteNote: (id: string) => {
    const state = get();
    set({ notes: state.notes.filter(note => note.id !== id) });
    debouncedSave(() => get().saveToLocalStorage());
  },

  toggleTheme: () => {
    const state = get();
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    set({ theme: newTheme });
    debouncedSave(() => get().saveToLocalStorage());
  },

  toggleHeatmap: () => {
    const state = get();
    set({ showHeatmap: !state.showHeatmap });
    debouncedSave(() => get().saveToLocalStorage());
  },

  addSelectionRange: (range: SelectionRange) => {
    const state = get();
    set({ selectionRanges: [...state.selectionRanges, range] });
    debouncedSave(() => get().saveToLocalStorage());
  },

  removeSelectionRange: (id: string) => {
    const state = get();
    set({ selectionRanges: state.selectionRanges.filter(r => r.id !== id) });
    debouncedSave(() => get().saveToLocalStorage());
  },

  loadFromLocalStorage: () => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('calendarState');
      if (stored) {
        const parsed = JSON.parse(stored);
        set({
          startDate: parsed.startDate ? new Date(parsed.startDate) : null,
          endDate: parsed.endDate ? new Date(parsed.endDate) : null,
          notes: parsed.notes.map((n: any) => ({
            ...n,
            createdAt: new Date(n.createdAt),
            updatedAt: new Date(n.updatedAt),
            range: {
              start: n.range.start ? new Date(n.range.start) : null,
              end: n.range.end ? new Date(n.range.end) : null,
            },
          })),
          theme: parsed.theme || 'dark',
          showHeatmap: parsed.showHeatmap || false,
          selectionRanges: (parsed.selectionRanges || []).map((r: any) => ({
            ...r,
            start: r.start ? new Date(r.start) : null,
            end: r.end ? new Date(r.end) : null,
          })),
        });
      }
    } catch (error) {
      console.error('Error loading calendar state from localStorage:', error);
    }
  },

  saveToLocalStorage: () => {
    if (typeof window === 'undefined') return;

    try {
      const state = get();
      const toStore = {
        startDate: state.startDate?.toISOString() || null,
        endDate: state.endDate?.toISOString() || null,
        notes: state.notes,
        theme: state.theme,
        showHeatmap: state.showHeatmap,
        selectionRanges: state.selectionRanges.map(r => ({
          ...r,
          start: r.start?.toISOString() || null,
          end: r.end?.toISOString() || null,
        })),
      };
      localStorage.setItem('calendarState', JSON.stringify(toStore));
    } catch (error) {
      console.error('Error saving calendar state to localStorage:', error);
    }
  },
}));

export default useCalendarStore;

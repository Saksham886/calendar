export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface Note {
  id: string;
  range: DateRange;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  color: string;
}

export interface Holiday {
  date: Date;
  name: string;
  type: 'holiday' | 'weekend';
}

export interface SelectionRange {
  id: string;
  start: Date | null;
  end: Date | null;
  color: 'green' | 'blue' | 'purple' | 'yellow';
  label?: string;
}

export interface CalendarState {
  currentMonth: Date;
  startDate: Date | null;
  endDate: Date | null;
  hoverDate: Date | null;
  isDragging: boolean;
  notes: Note[];
  theme: 'light' | 'dark';
  showHeatmap: boolean;
  selectionRanges: SelectionRange[];
}

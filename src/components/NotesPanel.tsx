'use client';

import { useState, useCallback, useMemo } from 'react';
import useCalendarStore from '@/store/calendarStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Edit2, Download, Lock, FileText, BarChart3, Code } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDateRange } from '@/utils/dateUtils';
import { v4 as uuidv4 } from 'uuid';
import { NOTE_COLORS } from '@/constants';
import { downloadNotesAsJSON, downloadNotesAsCSV, downloadNotesAsMarkdown } from '@/utils/exportUtils';

export default function NotesPanel() {
  const {
    startDate,
    endDate,
    theme,
    notes,
    addNote,
    updateNote,
    deleteNote,
  } = useCalendarStore();

  // Map format types to their icons
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'JSON':
        return <Code className="w-3 h-3" />;
      case 'CSV':
        return <BarChart3 className="w-3 h-3" />;
      case 'Markdown':
        return <FileText className="w-3 h-3" />;
      default:
        return <Download className="w-3 h-3" />;
    }
  };

  const [noteContent, setNoteContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);

  const canAddNote = startDate && endDate;

  const notesForSelection = useMemo(() => {
    if (!startDate || !endDate) return [];
    // Show notes that overlap with the current selection
    return notes.filter(n => {
      if (!n.range.start || !n.range.end) return false;
      // Check if note range overlaps with current selection
      // Overlap exists when: noteStart <= selectionEnd AND noteEnd >= selectionStart
      const noteStart = n.range.start.getTime();
      const noteEnd = n.range.end.getTime();
      const selStart = startDate.getTime();
      const selEnd = endDate.getTime();
      return noteStart <= selEnd && noteEnd >= selStart;
    });
  }, [notes, startDate, endDate]);

  const handleAddNote = useCallback(() => {
    if (!noteContent.trim() || !startDate || !endDate) return;

    const newNote = {
      id: uuidv4(),
      range: { start: startDate, end: endDate },
      content: noteContent,
      createdAt: new Date(),
      updatedAt: new Date(),
      color: selectedColor,
    };

    addNote(newNote);
    setNoteContent('');
    setSelectedColor(NOTE_COLORS[0]);
  }, [noteContent, startDate, endDate, selectedColor, addNote]);

  const handleUpdateNote = useCallback(
    (id: string) => {
      if (!editContent.trim()) return;
      updateNote(id, editContent);
      setEditingId(null);
      setEditContent('');
    },
    [editContent, updateNote]
  );

  const handleDeleteNote = useCallback(
    (id: string) => {
      deleteNote(id);
    },
    [deleteNote]
  );

  const startEditNote = useCallback((id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn(
        'rounded-3xl backdrop-blur-xl border shadow-2xl overflow-hidden h-full flex flex-col relative group',
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#1E293B]/40 via-[#0F172A]/30 to-[#1E293B]/30 border-[#334155]/50 shadow-[#60A5FA]/10'
          : 'bg-gradient-to-br from-[#FFFFFF]/50 via-[#F8FAFC]/40 to-[#E0E7FF]/30 border-[#E2E8F0]/70 shadow-[#3B82F6]/20'
      )}
    >
      {/* Premium glass gradient overlay */}
      <div
        className={cn(
          'absolute inset-0 rounded-3xl pointer-events-none',
          'bg-gradient-to-br from-white/10 via-white/0 to-white/0 opacity-0 group-hover:opacity-30',
          'transition-opacity duration-300'
        )}
      />

      <div className="p-6 flex-1 flex flex-col relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className={cn('text-2xl font-bold mb-2 font-mono', theme === 'dark' ? 'text-[#60A5FA]' : 'text-[#3B82F6]')} style={{ textShadow: theme === 'dark' ? '0 0 10px rgba(96, 165, 250, 0.2)' : 'none' }}>
            {`// notes`}
          </h2>
          {canAddNote && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className={cn(
                'inline-block px-3 py-1 rounded-full backdrop-blur-sm text-xs font-mono font-medium',
                theme === 'dark'
                  ? 'bg-[#60A5FA]/20 border border-[#60A5FA]/30 text-[#60A5FA]'
                  : 'bg-[#3B82F6]/20 border border-[#3B82F6]/30 text-[#3B82F6]'
              )}
            >
              {`[${formatDateRange(startDate, endDate)}]`}
            </motion.div>
          )}
        </motion.div>

        {/* Add note section */}
        {canAddNote && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6 space-y-3"
          >
            {/* Color picker with enhanced design */}
            <div className="space-y-2">
              <p className={cn(
                'text-xs font-semibold uppercase tracking-wider',
                theme === 'dark' ? 'text-[#94A3B8]' : 'text-[#64748B]'
              )}>
                Color
              </p>
              <div className="flex gap-2 flex-wrap">
                {NOTE_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color }}
                    className={cn(
                      'w-7 h-7 rounded-full transition-all shadow-lg hover:scale-125 hover:rotate-5 active:scale-85',
                      selectedColor === color
                        ? 'ring-2 ring-offset-2 ring-[#E2E8F0] scale-110'
                        : 'opacity-60 hover:opacity-100',
                      theme === 'dark' ? 'ring-offset-[#0F172A]' : 'ring-offset-[#F8FAFC]'
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Note input with glass effect */}
            <div className="space-y-2">
              <textarea
                value={noteContent}
                onChange={e => setNoteContent(e.target.value)}
                placeholder="Add a note to this date range..."
                className={cn(
                  'w-full px-4 py-3 rounded-xl text-sm border backdrop-blur-sm resize-none focus:outline-none focus:ring-2 transition-all',
                  'placeholder-opacity-60',
                  theme === 'dark'
                    ? 'bg-[#0F172A]/50 border-[#334155]/50 text-[#E2E8F0] placeholder-[#94A3B8] focus:ring-[#60A5FA] focus:border-[#60A5FA]'
                    : 'bg-[#FFFFFF]/60 border-[#E2E8F0]/50 text-[#0F172A] placeholder-[#64748B] focus:ring-[#3B82F6] focus:border-[#3B82F6]'
                )}
                rows={3}
              />
              <button
                onClick={handleAddNote}
                disabled={!noteContent.trim()}
                className={cn(
                  'w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg',
                  'hover:scale-105 active:scale-95',
                  noteContent.trim()
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] hover:from-[#60A5FA] hover:to-[#2563EB] text-white cursor-pointer'
                      : 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white cursor-pointer'
                    : theme === 'dark'
                      ? 'bg-[#334155] text-[#94A3B8] cursor-not-allowed hover:scale-100 active:scale-100'
                      : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed hover:scale-100 active:scale-100'
                  ,
                  !noteContent.trim() && 'pointer-events-none'
                )}
              >
                <Plus className="w-4 h-4" />
                Add Note
              </button>
            </div>
          </motion.div>
        )}

        {!canAddNote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              'flex-1 flex items-center justify-center py-12 rounded-xl backdrop-blur-sm border-2 border-dashed',
              theme === 'dark'
                ? 'bg-[#0F172A]/30 border-[#334155]/50 text-[#94A3B8]'
                : 'bg-[#F8FAFC]/50 border-[#E2E8F0]/50 text-[#64748B]'
            )}
          >
            <div className="text-center">
              <Lock className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">Select a date range to add notes</p>
            </div>
          </motion.div>
        )}

        {/* Notes list with enhanced cards */}
        {canAddNote && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            <AnimatePresence>
              {notesForSelection.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    'py-8 rounded-xl backdrop-blur-sm border-2 border-dashed',
                    theme === 'dark'
                      ? 'bg-[#0F172A]/20 border-[#334155]/30'
                      : 'bg-[#F8FAFC]/30 border-[#E2E8F0]/30'
                  )}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={cn(
                      'px-4 py-3 rounded-lg font-mono text-xs leading-relaxed',
                      theme === 'dark'
                        ? 'bg-[#1E293B]/40 border border-[#334155]/40 text-[#E2E8F0]'
                        : 'bg-[#E0E7FF]/30 border border-[#E2E8F0]/40 text-[#0F172A]'
                    )}
                  >
                    <div className={theme === 'dark' ? 'text-[#34D399]' : 'text-[#22C55E]'}>
                      {`// Example: Sprint Planning`}
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className={theme === 'dark' ? 'text-[#94A3B8]' : 'text-[#64748B]'}>
                        {`const sprint = {`}
                      </div>
                      <div className={theme === 'dark' ? 'text-[#94A3B8]' : 'text-[#64748B]'}>
                        {`  title: "Build new dashboard",`}
                      </div>
                      <div className={theme === 'dark' ? 'text-[#94A3B8]' : 'text-[#64748B]'}>
                        {`  status: "in-progress"`}
                      </div>
                      <div className={theme === 'dark' ? 'text-[#94A3B8]' : 'text-[#64748B]'}>
                        {`}`}
                      </div>
                    </div>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={cn(
                      'text-center text-xs mt-4 font-medium',
                      theme === 'dark' ? 'text-[#94A3B8]' : 'text-[#64748B]'
                    )}
                  >
                    Add a note to get started
                  </motion.p>
                </motion.div>
              ) : (
                notesForSelection.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'p-4 rounded-xl backdrop-blur-sm border-l-4 border-r border-t border-b transition-all group relative',
                      'hover:shadow-lg hover:shadow-[#3B82F6]/10',
                      theme === 'dark'
                        ? 'bg-[#1E293B]/50 border-[#334155]/50 hover:bg-[#1E293B]'
                        : 'bg-[#FFFFFF]/60 border-[#E2E8F0]/50 hover:bg-[#FFFFFF]'
                    )}
                    style={{ borderLeftColor: note.color }}
                  >
                    {editingId === note.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                          className={cn(
                            'w-full px-3 py-2 rounded-lg text-sm border backdrop-blur-sm resize-none focus:outline-none focus:ring-2 transition-all',
                            theme === 'dark'
                              ? 'bg-[#0F172A]/50 border-[#334155] text-[#E2E8F0] focus:ring-[#60A5FA]'
                              : 'bg-[#F8FAFC]/60 border-[#E2E8F0] text-[#0F172A] focus:ring-[#3B82F6]'
                          )}
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateNote(note.id)}
                            className={cn(
                              'flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                              'hover:scale-105 active:scale-95',
                              theme === 'dark'
                                ? 'bg-[#60A5FA] hover:bg-[#3B82F6] text-white'
                                : 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
                            )}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditContent('');
                            }}
                            className={cn(
                              'flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                              'hover:scale-105 active:scale-95',
                              theme === 'dark'
                                ? 'bg-[#334155] hover:bg-[#475569] text-[#E2E8F0]'
                                : 'bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#0F172A]'
                            )}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <p className={cn(
                          'text-sm flex-1 leading-relaxed font-medium font-mono',
                          theme === 'dark' ? 'text-[#E2E8F0]' : 'text-[#0F172A]'
                        )}>
                          {note.content}
                        </p>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEditNote(note.id, note.content)}
                            className={cn(
                              'p-1.5 rounded-lg transition-all',
                              'hover:scale-115 hover:rotate-5 active:scale-85',
                              theme === 'dark'
                                ? 'hover:bg-[#334155] text-[#94A3B8] hover:text-[#60A5FA]'
                                : 'hover:bg-[#E0E7FF] text-[#64748B] hover:text-[#3B82F6]'
                            )}
                            title="Edit note"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className={cn(
                              'p-1.5 rounded-lg transition-all',
                              'hover:scale-115 hover:-rotate-5 active:scale-85',
                              theme === 'dark'
                                ? 'hover:bg-[#7F1D1D] text-[#FCA5A5] hover:text-[#FEE2E2]'
                                : 'hover:bg-[#FEE2E2] text-[#DC2626] hover:text-[#991B1B]'
                            )}
                            title="Delete note"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Export buttons */}
        {notes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              'mt-6 pt-6 border-t space-y-3',
                theme === 'dark' ? 'border-[#334155]/50' : 'border-[#E2E8F0]/50'
            )}
          >
            <p className={cn(
              'text-xs font-bold uppercase tracking-wider',
              theme === 'dark' ? 'text-[#94A3B8]' : 'text-[#64748B]'
            )}>
              📥 Export All Notes
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { format: 'JSON', onClick: () => downloadNotesAsJSON(notes), icon: 'JSON' },
                { format: 'CSV', onClick: () => downloadNotesAsCSV(notes), icon: 'BarChart3' },
                { format: 'Markdown', onClick: () => downloadNotesAsMarkdown(notes), icon: 'FileText' },
              ].map(btn => (
                <button
                  key={btn.format}
                  onClick={btn.onClick}
                  className={cn(
                    'px-2 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all',
                    'hover:scale-105 hover:-translate-y-0.5 active:scale-95',
                    theme === 'dark'
                      ? 'bg-[#1E293B]/60 hover:bg-[#0F172A] text-[#E2E8F0] hover:shadow-lg hover:shadow-[#0F172A]'
                      : 'bg-[#F8FAFC]/60 hover:bg-[#E0E7FF] text-[#0F172A] hover:shadow-lg hover:shadow-[#E2E8F0]'
                  )}
                >
                  {getFormatIcon(btn.format)}
                  {btn.format}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

'use client';

import { useState, useCallback, useMemo } from 'react';
import useCalendarStore from '@/store/calendarStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Edit2, Download, Lock } from 'lucide-react';
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

  const [noteContent, setNoteContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);

  const canAddNote = startDate && endDate;

  const notesForSelection = useMemo(() => {
    if (!startDate || !endDate) return [];
    return notes.filter(
      n =>
        n.range.start &&
        n.range.end &&
        n.range.start.getTime() === startDate.getTime() &&
        n.range.end.getTime() === endDate.getTime()
    );
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
          ? 'bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-purple-900/30 border-slate-700/50 shadow-purple-500/10'
          : 'bg-gradient-to-br from-white/50 via-slate-50/40 to-purple-50/30 border-white/70 shadow-purple-500/20'
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
          <h2 className={cn('text-2xl font-bold mb-2 font-mono', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700')} style={{ textShadow: theme === 'dark' ? '0 0 10px rgba(34, 211, 238, 0.2)' : 'none' }}>
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
                  ? 'bg-cyan-500/20 border border-cyan-400/30 text-cyan-200'
                  : 'bg-cyan-400/20 border border-cyan-300/30 text-cyan-700'
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
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              )}>
                Color
              </p>
              <div className="flex gap-2 flex-wrap">
                {NOTE_COLORS.map(color => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.3, rotate: 5 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color }}
                    className={cn(
                      'w-7 h-7 rounded-full transition-all shadow-lg',
                      selectedColor === color
                        ? 'ring-2 ring-offset-2 ring-white scale-110'
                        : 'opacity-60 hover:opacity-100',
                      theme === 'dark' ? 'ring-offset-slate-900' : 'ring-offset-white'
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
                    ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400 focus:ring-indigo-500 focus:border-indigo-500'
                    : 'bg-white/60 border-slate-200/50 text-slate-900 placeholder-slate-500 focus:ring-indigo-400 focus:border-indigo-400'
                )}
                rows={3}
              />
              <motion.button
                whileHover={{ scale: noteContent.trim() ? 1.05 : 1 }}
                whileTap={{ scale: noteContent.trim() ? 0.95 : 1 }}
                onClick={handleAddNote}
                disabled={!noteContent.trim()}
                className={cn(
                  'w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg',
                  noteContent.trim()
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white cursor-pointer'
                      : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white cursor-pointer'
                    : theme === 'dark'
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                )}
              >
                <Plus className="w-4 h-4" />
                Add Note
              </motion.button>
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
                ? 'bg-slate-800/30 border-slate-700/50 text-slate-400'
                : 'bg-slate-100/50 border-slate-300/50 text-slate-600'
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
                      ? 'bg-slate-800/20 border-slate-700/30'
                      : 'bg-slate-100/30 border-slate-300/30'
                  )}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={cn(
                      'px-4 py-3 rounded-lg font-mono text-xs leading-relaxed',
                      theme === 'dark'
                        ? 'bg-slate-900/40 border border-slate-700/40 text-slate-300'
                        : 'bg-slate-200/30 border border-slate-300/40 text-slate-700'
                    )}
                  >
                    <div className={theme === 'dark' ? 'text-green-400' : 'text-green-700'}>
                      {`// Example: Sprint Planning`}
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                        {`const sprint = {`}
                      </div>
                      <div className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                        {`  title: "Build new dashboard",`}
                      </div>
                      <div className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                        {`  status: "in-progress"`}
                      </div>
                      <div className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
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
                      theme === 'dark' ? 'text-slate-500' : 'text-slate-600'
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
                      'hover:shadow-lg hover:shadow-indigo-500/10',
                      theme === 'dark'
                        ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800'
                        : 'bg-white/60 border-slate-200/50 hover:bg-white'
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
                              ? 'bg-slate-700/50 border-slate-600 text-white focus:ring-indigo-500'
                              : 'bg-slate-100/60 border-slate-300 text-slate-900 focus:ring-indigo-400'
                          )}
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleUpdateNote(note.id)}
                            className={cn(
                              'flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                              theme === 'dark'
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                            )}
                          >
                            Save
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setEditingId(null);
                              setEditContent('');
                            }}
                            className={cn(
                              'flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                              theme === 'dark'
                                ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                                : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                            )}
                          >
                            Cancel
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <p className={cn(
                          'text-sm flex-1 leading-relaxed font-medium font-mono',
                          theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                        )}>
                          {note.content}
                        </p>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.15, rotate: 5 }}
                            whileTap={{ scale: 0.85 }}
                            onClick={() => startEditNote(note.id, note.content)}
                            className={cn(
                              'p-1.5 rounded-lg transition-all',
                              theme === 'dark'
                                ? 'hover:bg-slate-700 text-slate-400 hover:text-indigo-400'
                                : 'hover:bg-slate-300 text-slate-600 hover:text-indigo-600'
                            )}
                            title="Edit note"
                          >
                            <Edit2 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.15, rotate: -5 }}
                            whileTap={{ scale: 0.85 }}
                            onClick={() => handleDeleteNote(note.id)}
                            className={cn(
                              'p-1.5 rounded-lg transition-all',
                              theme === 'dark'
                                ? 'hover:bg-red-900/50 text-red-400 hover:text-red-300'
                                : 'hover:bg-red-200 text-red-600 hover:text-red-700'
                            )}
                            title="Delete note"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
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
              theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'
            )}
          >
            <p className={cn(
              'text-xs font-bold uppercase tracking-wider',
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            )}>
              📥 Export All Notes
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { format: 'JSON', onClick: () => downloadNotesAsJSON(notes), icon: '{}' },
                { format: 'CSV', onClick: () => downloadNotesAsCSV(notes), icon: '📊' },
                { format: 'Markdown', onClick: () => downloadNotesAsMarkdown(notes), icon: '📝' },
              ].map(btn => (
                <motion.button
                  key={btn.format}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={btn.onClick}
                  className={cn(
                    'px-2 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all',
                    theme === 'dark'
                      ? 'bg-slate-800/60 hover:bg-slate-700 text-slate-200 hover:shadow-lg hover:shadow-slate-900'
                      : 'bg-slate-200/60 hover:bg-slate-300 text-slate-900 hover:shadow-lg hover:shadow-slate-400'
                  )}
                >
                  <Download className="w-3 h-3" />
                  {btn.format}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

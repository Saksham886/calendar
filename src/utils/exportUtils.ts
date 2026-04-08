import { Note } from '@/types';

export function exportNotesAsJSON(notes: Note[]): string {
  return JSON.stringify(notes, null, 2);
}

export function downloadNotesAsJSON(notes: Note[], filename = 'calendar-notes.json'): void {
  const json = exportNotesAsJSON(notes);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportNotesAsCSV(notes: Note[]): string {
  const headers = ['Start Date', 'End Date', 'Content', 'Color', 'Created At'];
  const rows = notes.map(note => [
    note.range.start ? note.range.start.toISOString() : '',
    note.range.end ? note.range.end.toISOString() : '',
    `"${note.content.replace(/"/g, '""')}"`,
    note.color,
    note.createdAt.toISOString(),
  ]);

  const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  return csv;
}

export function downloadNotesAsCSV(notes: Note[], filename = 'calendar-notes.csv'): void {
  const csv = exportNotesAsCSV(notes);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportNotesAsMarkdown(notes: Note[]): string {
  let markdown = '# Calendar Notes\n\n';
  markdown += `Generated on: ${new Date().toISOString()}\n\n`;

  notes.forEach(note => {
    markdown += `## ${note.range.start?.toDateString()} - ${note.range.end?.toDateString()}\n`;
    markdown += `**Color**: ${note.color}\n\n`;
    markdown += `${note.content}\n\n`;
    markdown += `*Created: ${note.createdAt.toISOString()}*\n\n`;
    markdown += '---\n\n';
  });

  return markdown;
}

export function downloadNotesAsMarkdown(notes: Note[], filename = 'calendar-notes.md'): void {
  const markdown = exportNotesAsMarkdown(notes);
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

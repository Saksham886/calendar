# 🗓️ Interactive Wall Calendar Component

A **production-grade, premium interactive calendar** built with modern frontend best practices. Features glassmorphism design, smooth animations, intelligent date range selection, smart notes management, and full localStorage persistence.

## ✨ Features

### 📅 Core Calendar Functionality
- **Smart Date Range Selection**: Click to select start date, click again to select end date
- **Drag-to-Select**: Click and drag across dates to select a range
- **Month Navigation**: Smooth animated transitions between months
- **Today Indicator**: Visual indicator for the current date with pulse animation
- **Holiday Indicators**: US holidays marked with 🎉 emoji
- **Responsive Grid**: Mobile-friendly 7-column grid layout

### 🎯 Advanced Interactions
- **Hover Preview**: Live preview of date range while hovering
- **Keyboard Navigation**:
  - `Ctrl + ← / →`: Navigate between months
  - `↑ ↓ ← →`: Move through dates (when one is selected)
  - `Escape / Backspace`: Clear selection
  
### 📝 Notes System
- **Date-Linked Notes**: Attach notes to selected date ranges
- **Color-Coded**: 7 beautiful color options for visual categorization
- **CRUD Operations**: Create, edit, and delete notes with smooth animations
- **Multiple Notes**: Add unlimited notes to the same date range
- **Export Formats**: 
  - JSON: Complete structured data export
  - CSV: Spreadsheet-compatible format
  - Markdown: Readable documentation format

### 🌗 Theme System
- **Dark Mode** (Default): Eye-friendly dark theme with gradient backgrounds
- **Light Mode**: Clean, bright alternative theme
- **Theme Toggle**: One-click switching with smooth transitions
- **Persistent Theme**: Theme preference saved to localStorage

### 💾 Data Persistence
- **Automatic Saving**: All data saved to localStorage
- **Auto-Load**: Data restored on page refresh
- **Selection Memory**: Your selected dates persist across sessions
- **Notes Archive**: All notes are permanently stored locally

### 🎨 Design & Aesthetics
- **Glassmorphism**: Frosted glass effect panels with backdrop blur
- **Gradient Backgrounds**: Smooth color gradients with animated elements
- **Smooth Animations**: Framer Motion for natural, delightful interactions
- **Visual Hierarchy**: Clear, readable typography and spacing
- **Responsive Design**: Perfectly optimized for desktop, tablet, and mobile

### 🎭 Visual Effects
- **Animated Background**: Subtle floating gradient orbs
- **Hover Effects**: Interactive feedback on all clickable elements
- **Smooth Transitions**: All state changes animated smoothly
- **Pulse Indicators**: Animated indicators for today and selected dates
- **Staggered Lists**: Notes appear with cascading animations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to the project directory
cd interactive-calendar

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **React 19** | UI library with hooks |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **Framer Motion** | Smooth animations |
| **date-fns** | Date manipulation |
| **Zustand** | Lightweight state management |
| **Lucide React** | Beautiful icons |
| **uuid** | Unique ID generation |

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Calendar.tsx          # Main calendar wrapper
│   ├── CalendarGrid.tsx      # Week/day grid layout
│   ├── CalendarPage.tsx      # Page entry point
│   ├── DayCell.tsx           # Individual date cell
│   ├── HeroSection.tsx       # Page header
│   ├── MonthNavigator.tsx    # Month controls
│   ├── NotesPanel.tsx        # Notes interface
│   └── ThemeToggle.tsx       # Dark/light mode toggle
├── store/
│   └── calendarStore.ts      # Zustand state management
├── hooks/
│   └── useKeyboardNavigation.ts  # Keyboard shortcuts
├── utils/
│   ├── dateUtils.ts          # Date formatting & logic
│   ├── exportUtils.ts        # Note export functions
│   └── cn.ts                 # Utility class merger
├── types/
│   └── index.ts              # TypeScript interfaces
└── constants/
    └── index.ts              # Colors, holidays, etc.
```

## 💡 Usage Examples

### Select a Date Range
1. Click a start date
2. Click an end date
3. The selected range will be highlighted with a gradient

### Add a Note
1. Select a date range
2. Type your note in the textarea
3. Choose a color from the palette
4. Click "Add Note"

### Edit a Note
1. Hover over a note
2. Click the edit icon
3. Update the content
4. Click "Save"

### Delete a Note
1. Hover over a note
2. Click the trash icon
3. Note is deleted immediately

### Export Notes
1. Click one of the export buttons:
   - **JSON**: Full structured data
   - **CSV**: Spreadsheet format
   - **MD**: Markdown format
2. File downloads automatically

### Keyboard Shortcuts
- `Ctrl + Right Arrow`: Next month
- `Ctrl + Left Arrow`: Previous month
- `Arrow Keys`: Navigate selected date
- `Escape`: Clear selection

## 🎨 Color Palette

### Dark Mode
- Background: Slate 950
- Cards: Slate 900 with 40% opacity
- Accent: Indigo 600
- Text: Slate 200

### Light Mode
- Background: White
- Cards: White with 40% opacity
- Accent: Indigo 500  
- Text: Slate 900

### Note Colors
- Pink (#ec4899)
- Rose (#f43f5e)
- Amber (#f59e0b)
- Emerald (#10b981)
- Cyan (#06b6d4)
- Blue (#3b82f6)
- Purple (#8b5cf6)

## 🔧 Configuration

### Adding Holidays
Edit `src/constants/index.ts` and add dates to `HOLIDAYS_US`:

```typescript
export const HOLIDAYS_US = [
  { date: new Date(2024, 0, 1), name: 'New Year Day' },
  // ... add more
];
```

### Changing Colors
Modify the color palette in `src/constants/index.ts`:

```typescript
export const COLORS = {
  dark: {
    bg: '#0f172a',
    // ... customize
  },
  // ...
};
```

## 📱 Responsive Behavior

- **Mobile**: Full-width stacked layout, touch-optimized
- **Tablet**: 2-column grid with optimized spacing
- **Desktop**: 3-column layout with calendar and notes side-by-side

## 🧠 State Management

The app uses **Zustand** for lightweight, efficient state management:

```typescript
// State includes:
- currentMonth: Date
- startDate: Date | null
- endDate: Date | null
- hoverDate: Date | null
- isDragging: boolean
- notes: Note[]
- theme: 'light' | 'dark'
```

## 💾 localStorage Schema

```json
{
  "calendarState": {
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-01-20T00:00:00.000Z",
    "notes": [
      {
        "id": "uuid-string",
        "range": { "start": "ISO", "end": "ISO" },
        "content": "Note text",
        "color": "#hex-color",
        "createdAt": "ISO",
        "updatedAt": "ISO"
      }
    ],
    "theme": "dark"
  }
}
```

## 🎯 Performance Optimizations

- **Memoization**: Components wrapped with React.memo where appropriate
- **Lazy Loading**: Framer Motion animations optimized for 60fps
- **Efficient Re-renders**: Zustand state updates only affected components
- **CSS-in-JS**: Tailwind's compiled CSS is vendor-optimized
- **Code Splitting**: Next.js handles automatic code splitting

## 🐛 Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (14+)
- Mobile browsers: ✅ Full support

## 📦 Dependencies

```json
{
  "dependencies": {
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "framer-motion": "^12.38.0",
    "lucide-react": "^1.7.0",
    "next": "16.2.2",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "tailwind-merge": "^3.5.0",
    "uuid": "^9.0.0",
    "zustand": "^5.0.12"
  }
}
```

## 🚀 Future Enhancements

- [ ] Recurring events
- [ ] Calendar sharing
- [ ] Sync with Google Calendar
- [ ] Drag-and-drop date ranges
- [ ] Custom date formats
- [ ] Multiple calendar support
- [ ] Time slots scheduling
- [ ] PWA support
- [ ] Email notifications
- [ ] Collaborative editing

## 📄 License

This project is open source and available under the MIT License.

## 🙌 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues, questions, or suggestions, please open an issue on the repository.

---

**Built with ❤️ using modern web technologies**

Enjoy your interactive calendar! 🚀

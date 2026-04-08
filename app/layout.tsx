import type { Metadata } from 'next';
import { JetBrains_Mono, Geist } from 'next/font/google';
import './globals.css';

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Developer Productivity Calendar',
  description:
    'A premium, code-themed interactive calendar for developers. Featuring 3D flip animations, multi-range selection, productivity insights, and GitHub-style heatmap visualization.',
  keywords: [
    'calendar',
    'developer',
    'productivity',
    'planner',
    'interactive',
    'date-picker',
    'React',
    'Next.js',
    'Framer Motion',
  ],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jetBrainsMono.variable} ${geist.variable} font-mono h-full antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}

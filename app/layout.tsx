import './globals.css';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const metadata: Metadata = {
  title: 'UniSphere — Your Campus, Connected',
  description:
    'UniSphere is an unofficial student-focused digital campus platform bringing academics, resources, events, clubs, opportunities, and student knowledge into one premium experience.',
  openGraph: {
    title: 'UniSphere — Your Campus, Connected',
    description:
      'An unofficial student platform for academics, events, clubs, resources, opportunities, and campus knowledge.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${display.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

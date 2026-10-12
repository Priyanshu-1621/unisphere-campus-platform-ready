'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, Calendar, Compass, User, Search, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/academics', label: 'Academics', icon: BookOpen },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-background/80 backdrop-blur-lg">
      <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-[60px] transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="h-5 w-5 relative z-10" />
              <span className="text-[10px] font-medium relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 hidden md:flex items-center justify-between px-6 h-16 border-b border-border/60 bg-background/70 backdrop-blur-lg">
      <div className="flex items-center gap-8">
        <Link href="/home" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center font-display text-sm font-bold text-primary-foreground">
            U
          </div>
          <span className="font-display text-lg font-bold tracking-tight">UniSphere</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="top-nav-active"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/search"
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card/50 text-sm text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors min-w-[200px]"
        >
          <Search className="h-4 w-4" />
          <span>Search campus...</span>
          <kbd className="ml-auto hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </Link>

        <Link
          href="/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
            2
          </span>
        </Link>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="pb-20 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}

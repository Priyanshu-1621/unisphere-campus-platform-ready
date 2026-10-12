'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuItem onClick={() => setTheme('light')} className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sun className="h-4 w-4" /> Light
          </span>
          {theme === 'light' && <Check className="h-3.5 w-3.5" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Moon className="h-4 w-4" /> Dark
          </span>
          {theme === 'dark' && <Check className="h-3.5 w-3.5" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')} className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Monitor className="h-4 w-4" /> System
          </span>
          {theme === 'system' && <Check className="h-3.5 w-3.5" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

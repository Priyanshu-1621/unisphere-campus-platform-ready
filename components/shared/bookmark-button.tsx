'use client';

import { Bookmark } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function BookmarkButton({
  isSaved: initialSaved,
  onSave,
  size = 'default',
  className,
}: {
  isSaved: boolean;
  onSave?: (saved: boolean) => void;
  size?: 'default' | 'sm';
  className?: string;
}) {
  const [saved, setSaved] = useState(initialSaved);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
    onSave?.(!saved);
  };

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.85 }}
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg transition-colors',
        size === 'default' ? 'h-9 w-9' : 'h-8 w-8',
        saved ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
        className
      )}
      aria-label={saved ? 'Remove bookmark' : 'Save bookmark'}
    >
      <motion.span
        animate={saved ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Bookmark className={size === 'default' ? 'h-5 w-5' : 'h-4 w-4'} fill={saved ? 'currentColor' : 'none'} />
      </motion.span>
    </motion.button>
  );
}

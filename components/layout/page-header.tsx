'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn('flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between', className)}
    >
      <div className="space-y-1">
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground text-pretty">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </motion.div>
  );
}

export function SectionHeader({
  title,
  description,
  href,
  hrefLabel = 'View all',
  className,
}: {
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      <div className="space-y-1">
        <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="text-sm font-medium text-primary hover:underline shrink-0"
        >
          {hrefLabel}
        </Link>
      )}
    </div>
  );
}

export function FilterBar({
  filters,
  active,
  onChange,
  className,
}: {
  filters: { value: string; label: string }[];
  active: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1', className)}>
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={cn(
            'relative px-4 py-1.5 text-sm font-medium rounded-full border transition-colors shrink-0',
            active === filter.value
              ? 'border-primary text-primary'
              : 'border-border text-muted-foreground hover:text-foreground hover:border-border/80'
          )}
        >
          {active === filter.value && (
            <motion.div
              layoutId={`filter-bar-${className ?? 'default'}`}
              className="absolute inset-0 rounded-full bg-primary/10"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{filter.label}</span>
        </button>
      ))}
    </div>
  );
}

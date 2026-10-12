'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Inbox, SearchX } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EmptyState({
  title = 'Nothing here yet',
  description,
  icon,
  action,
  className,
}: {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn('flex flex-col items-center justify-center text-center py-20 px-4', className)}
    >
      <div className="mb-5 rounded-2xl bg-muted/50 p-5 text-muted-foreground">
        {icon ?? <Inbox className="h-10 w-10" />}
      </div>
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      {description && <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An error occurred while loading this content. Please try again.',
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('flex flex-col items-center justify-center text-center py-20 px-4', className)}
    >
      <div className="mb-5 rounded-2xl bg-destructive/10 p-5 text-destructive">
        <AlertCircle className="h-10 w-10" />
      </div>
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 rounded-lg border border-border bg-card px-5 py-2 text-sm font-medium hover:bg-accent transition-colors"
        >
          Try again
        </button>
      )}
    </motion.div>
  );
}

export function LoadingState({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center py-20', className)}>
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-muted border-t-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-5 space-y-3', className)}>
      <div className="h-32 w-full rounded-lg animate-shimmer" />
      <div className="h-4 w-3/4 rounded animate-shimmer" />
      <div className="h-3 w-1/2 rounded animate-shimmer" />
      <div className="flex gap-2">
        <div className="h-6 w-20 rounded-full animate-shimmer" />
        <div className="h-6 w-16 rounded-full animate-shimmer" />
      </div>
    </div>
  );
}

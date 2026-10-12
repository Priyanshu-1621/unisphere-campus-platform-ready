'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Download, FileText, Flag, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookmarkButton } from '@/components/shared/bookmark-button';
import { StatusBadge, ContributorBadge } from '@/components/shared/badges';
import { formatRelativeTime, formatFileSize } from '@/lib/demo-data';
import type { Resource } from '@/types';

export function ResourceCard({ resource, index = 0 }: { resource: Resource; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Card className="group relative overflow-hidden border-border/60 hover:border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {resource.subject}
              </Badge>
              {resource.unit && resource.unit !== 'All Units' && (
                <Badge variant="secondary" className="text-xs">{resource.unit}</Badge>
              )}
            </div>
            <BookmarkButton isSaved={false} size="sm" />
          </div>

          <Link href={`/academics/${resource.id}`} className="block">
            <h3 className="font-display text-base font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {resource.title}
            </h3>
          </Link>

          {resource.description && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{resource.description}</p>
          )}

          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <StatusBadge status={resource.status} />
            <ContributorBadge isVerified={resource.contributor_verified} />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                {resource.file_type}
              </span>
              <span className="flex items-center gap-1">
                <Download className="h-3.5 w-3.5" />
                {resource.downloads}
              </span>
              <span>{formatFileSize(resource.file_size ?? 0)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:inline">
                by {resource.contributor_name}
              </span>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" aria-label="Report">
                <Flag className="h-3.5 w-3.5" />
              </Button>
              <Link href={`/academics/${resource.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="View resource">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-2 text-xs text-muted-foreground/60">
            Uploaded {formatRelativeTime(resource.created_at)}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

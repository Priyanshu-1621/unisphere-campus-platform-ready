'use client';

import { motion } from 'framer-motion';
import { ExternalLink, CalendarClock, Bookmark } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookmarkButton } from '@/components/shared/bookmark-button';
import { getDaysUntil } from '@/lib/demo-data';
import type { Opportunity } from '@/types';

const categoryConfig: Record<string, { label: string; className: string }> = {
  internship: { label: 'Internship', className: 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20' },
  hackathon: { label: 'Hackathon', className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  scholarship: { label: 'Scholarship', className: 'bg-accent/10 text-accent border-accent/20' },
  competition: { label: 'Competition', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  workshop: { label: 'Workshop', className: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20' },
  certification: { label: 'Certification', className: 'bg-primary/10 text-primary border-primary/20' },
  club_recruitment: { label: 'Club Recruitment', className: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20' },
};

export function OpportunityCard({ opportunity, index = 0 }: { opportunity: Opportunity; index?: number }) {
  const days = getDaysUntil(opportunity.deadline);
  const cat = categoryConfig[opportunity.category] ?? categoryConfig.competition;
  const isUrgent = days >= 0 && days <= 7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Card className="group relative overflow-hidden border-border/60 hover:border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full">
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-3">
            <Badge className={`${cat.className} gap-1`}>{cat.label}</Badge>
            <BookmarkButton isSaved={opportunity.is_saved} size="sm" />
          </div>

          <h3 className="font-display text-base font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {opportunity.title}
          </h3>
          <p className="mt-1 text-sm font-medium text-muted-foreground">{opportunity.organization}</p>

          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{opportunity.description}</p>

          <div className="mt-3 text-xs text-muted-foreground">
            <span className="font-medium">Eligibility:</span> {opportunity.eligibility}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4">
            <div className="flex items-center gap-2 text-xs">
              <CalendarClock className={`h-3.5 w-3.5 ${isUrgent ? 'text-destructive' : 'text-muted-foreground'}`} />
              <span className={isUrgent ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                {days < 0 ? 'Expired' : days === 0 ? 'Last day!' : `${days} days left`}
              </span>
            </div>
            {opportunity.external_link && (
              <a
                href={opportunity.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Apply <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookmarkButton } from '@/components/shared/bookmark-button';
import { getDaysUntil } from '@/lib/demo-data';
import type { EventItem } from '@/types';

const categoryConfig: Record<string, { label: string; className: string }> = {
  hackathon: { label: 'Hackathon', className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  workshop: { label: 'Workshop', className: 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20' },
  competition: { label: 'Competition', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  club_event: { label: 'Club Event', className: 'bg-accent/10 text-accent border-accent/20' },
  seminar: { label: 'Seminar', className: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20' },
  campus_event: { label: 'Campus Event', className: 'bg-primary/10 text-primary border-primary/20' },
  other: { label: 'Other', className: 'bg-muted text-muted-foreground border-border' },
};

export function EventCard({ event, index = 0 }: { event: EventItem; index?: number }) {
  const days = getDaysUntil(event.date);
  const cat = categoryConfig[event.category] ?? categoryConfig.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link href={`/events/${event.id}`}>
        <Card className="group relative overflow-hidden border-border/60 hover:border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
          {/* Date strip */}
          <div className="flex">
            <div className="flex flex-col items-center justify-center px-4 py-3 bg-muted/30 border-r border-border/40 min-w-[72px]">
              <span className="text-xs font-medium text-muted-foreground uppercase">
                {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
              </span>
              <span className="font-display text-2xl font-bold leading-none mt-1">
                {new Date(event.date).getDate()}
              </span>
            </div>

            <div className="flex-1 p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge className={`${cat.className} gap-1`}>{cat.label}</Badge>
                <BookmarkButton isSaved={event.is_saved} size="sm" />
              </div>

              <h3 className="font-display text-base font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {event.title}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{event.description}</p>

              <div className="mt-4 flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {event.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {event.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> {event.organizer}
                </span>
              </div>

              {days >= 0 && days <= 7 && (
                <div className="mt-3">
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

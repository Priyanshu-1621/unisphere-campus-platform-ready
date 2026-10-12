'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, Users, ExternalLink, Flag, Share2 } from 'lucide-react';
import { AppShell } from '@/components/layout/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookmarkButton } from '@/components/shared/bookmark-button';
import { Countdown } from '@/components/animation/animation-utils';
import { demoEvents, getDaysUntil } from '@/lib/demo-data';

const categoryLabels: Record<string, string> = {
  hackathon: 'Hackathon', workshop: 'Workshop', competition: 'Competition',
  club_event: 'Club Event', seminar: 'Seminar', campus_event: 'Campus Event', other: 'Other',
};

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const event = demoEvents.find((e) => e.id === id);

  if (!event) return notFound();

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Link href="/events" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Events
        </Link>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-10" />
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-primary/10 to-accent/10" />
            <div className="relative p-6">
              <div className="flex items-center justify-between gap-2 mb-4">
                <Badge className="bg-primary/10 text-primary border-primary/20">{categoryLabels[event.category]}</Badge>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9"><Share2 className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive"><Flag className="h-4 w-4" /></Button>
                  <BookmarkButton isSaved={event.is_saved} />
                </div>
              </div>

              <h1 className="font-display text-3xl font-bold">{event.title}</h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {event.time}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {event.location}</span>
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {event.organizer}</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Countdown */}
        {getDaysUntil(event.date) >= 0 && (
          <Card className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <Badge className="bg-destructive/10 text-destructive border-destructive/20 mb-2">Event Countdown</Badge>
              <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
            <Countdown targetDate={event.date} />
          </Card>
        )}

        {/* Description */}
        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold mb-3">About this event</h3>
          <p className="text-muted-foreground leading-relaxed">{event.description}</p>
        </Card>

        {/* Registration */}
        {event.registration_link && (
          <Card className="p-6 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Registration Required</h3>
              <p className="text-sm text-muted-foreground">Click the link to register for this event.</p>
            </div>
            <a href={event.registration_link} target="_blank" rel="noopener noreferrer">
              <Button className="rounded-full gap-2">Register <ExternalLink className="h-4 w-4" /></Button>
            </a>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

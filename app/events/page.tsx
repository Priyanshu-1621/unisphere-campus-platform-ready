'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarX2 } from 'lucide-react';
import { AppShell } from '@/components/layout/navigation';
import { PageHeader, FilterBar } from '@/components/layout/page-header';
import { RevealUp } from '@/components/animation/animation-utils';
import { EventCard } from '@/components/cards/event-card';
import { EmptyState } from '@/components/shared/states';
import { demoEvents } from '@/lib/demo-data';

const categoryFilters = [
  { value: 'all', label: 'All' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'competition', label: 'Competition' },
  { value: 'club_event', label: 'Club Event' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'campus_event', label: 'Campus Event' },
  { value: 'other', label: 'Other' },
];

export default function EventsPage() {
  const [category, setCategory] = useState('all');

  const filtered = useMemo(() => {
    if (category === 'all') return demoEvents;
    return demoEvents.filter((e) => e.category === category);
  }, [category]);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <PageHeader
          title="Events"
          description="Workshops, hackathons, seminars, and campus events"
        />

        <FilterBar
          filters={categoryFilters}
          active={category}
          onChange={setCategory}
          className="events-page"
        />

        {filtered.length === 0 ? (
          <EmptyState
            icon={<CalendarX2 className="h-10 w-10" />}
            title="No events found"
            description="There are no events in this category right now. Check back later or browse another category."
          />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {filtered.map((event, i) => (
              <RevealUp key={event.id} delay={Math.min(i * 0.05, 0.3)}>
                <EventCard event={event} index={i} />
              </RevealUp>
            ))}
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { UsersRound } from 'lucide-react';
import { AppShell } from '@/components/layout/navigation';
import { PageHeader, FilterBar } from '@/components/layout/page-header';
import { RevealUp } from '@/components/animation/animation-utils';
import { ClubCard } from '@/components/cards/club-card';
import { EmptyState } from '@/components/shared/states';
import { demoClubs } from '@/lib/demo-data';
import { useClubs, isSupabaseConfigured } from '@/lib/hooks/use-supabase-data';

const categoryFilters = [
  { value: 'all', label: 'All' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Cultural', label: 'Cultural' },
  { value: 'Creative', label: 'Creative' },
];

export default function ClubsPage() {
  const [category, setCategory] = useState('all');

  const clubsQuery = useClubs();
  const allClubs = isSupabaseConfigured && clubsQuery.data.length > 0 ? clubsQuery.data : demoClubs;

  const filtered = useMemo(() => {
    if (category === 'all') return allClubs;
    return allClubs.filter((c) => c.category === category);
  }, [category, allClubs]);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <PageHeader
          title="Clubs Hub"
          description="Discover communities that match your interests"
        />

        <FilterBar
          filters={categoryFilters}
          active={category}
          onChange={setCategory}
          className="clubs-page"
        />

        {filtered.length === 0 ? (
          <EmptyState
            icon={<UsersRound className="h-10 w-10" />}
            title="No clubs found"
            description="There are no clubs in this category yet. Try browsing another category."
          />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((club, i) => (
              <RevealUp key={club.id} delay={Math.min(i * 0.05, 0.3)}>
                <ClubCard club={club} index={i} />
              </RevealUp>
            ))}
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}

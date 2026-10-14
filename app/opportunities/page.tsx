'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BriefcaseBusiness } from 'lucide-react';
import { AppShell } from '@/components/layout/navigation';
import { PageHeader, FilterBar } from '@/components/layout/page-header';
import { RevealUp } from '@/components/animation/animation-utils';
import { OpportunityCard } from '@/components/cards/opportunity-card';
import { EmptyState } from '@/components/shared/states';
import { Button } from '@/components/ui/button';
import { demoOpportunities } from '@/lib/demo-data';
import { useOpportunities, isSupabaseConfigured } from '@/lib/hooks/use-supabase-data';

const categoryFilters = [
  { value: 'all', label: 'All' },
  { value: 'internship', label: 'Internship' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'scholarship', label: 'Scholarship' },
  { value: 'competition', label: 'Competition' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'certification', label: 'Certification' },
  { value: 'club_recruitment', label: 'Club Recruitment' },
];

type SortMode = 'deadline' | 'posted';

export default function OpportunitiesPage() {
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<SortMode>('deadline');

  const opportunitiesQuery = useOpportunities();
  const allOpportunities = isSupabaseConfigured && opportunitiesQuery.data.length > 0 ? opportunitiesQuery.data : demoOpportunities;

  const filtered = useMemo(() => {
    const items =
      category === 'all'
        ? [...allOpportunities]
        : allOpportunities.filter((o) => o.category === category);

    return items.sort((a, b) => {
      if (sort === 'deadline') {
        return a.deadline.localeCompare(b.deadline);
      }
      return b.created_at.localeCompare(a.created_at);
    });
  }, [category, sort, allOpportunities]);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <PageHeader
          title="Opportunities"
          description="Internships, scholarships, hackathons, and more"
        />

        <div className="space-y-3">
          <FilterBar
            filters={categoryFilters}
            active={category}
            onChange={setCategory}
            className="opportunities-page"
          />

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-1">Sort by:</span>
            <Button
              variant={sort === 'deadline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSort('deadline')}
            >
              Deadline
            </Button>
            <Button
              variant={sort === 'posted' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSort('posted')}
            >
              Date Posted
            </Button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<BriefcaseBusiness className="h-10 w-10" />}
            title="No opportunities found"
            description="There are no opportunities in this category right now. Check back later or browse another category."
          />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((opportunity, i) => (
              <RevealUp key={opportunity.id} delay={Math.min(i * 0.05, 0.3)}>
                <OpportunityCard opportunity={opportunity} index={i} />
              </RevealUp>
            ))}
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}

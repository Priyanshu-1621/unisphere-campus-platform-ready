'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, BookOpen, Calendar, Users, Briefcase, FileText, MapPin, HelpCircle, PackageSearch, X } from 'lucide-react';
import { AppShell } from '@/components/layout/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/states';
import { ResourceCard } from '@/components/cards/resource-card';
import { EventCard } from '@/components/cards/event-card';
import { ClubCard } from '@/components/cards/club-card';
import { OpportunityCard } from '@/components/cards/opportunity-card';
import { QuestionCard } from '@/components/cards/question-card';
import {
  demoResources,
  demoEvents,
  demoClubs,
  demoOpportunities,
  demoExams,
  demoLocations,
  demoQuestions,
  demoLostFound,
} from '@/lib/demo-data';

const categories = [
  { value: 'all', label: 'All', icon: SearchIcon },
  { value: 'resources', label: 'Resources', icon: BookOpen },
  { value: 'events', label: 'Events', icon: Calendar },
  { value: 'clubs', label: 'Clubs', icon: Users },
  { value: 'opportunities', label: 'Opportunities', icon: Briefcase },
  { value: 'exams', label: 'Exams', icon: FileText },
  { value: 'campus', label: 'Campus', icon: MapPin },
  { value: 'questions', label: 'Questions', icon: HelpCircle },
  { value: 'lost-found', label: 'Lost & Found', icon: PackageSearch },
];

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [hasSearched, setHasSearched] = useState(false);

  // Listen for Cmd/Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('global-search') as HTMLInputElement;
        input?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { resources: [], events: [], clubs: [], opportunities: [], exams: [], locations: [], questions: [], lostFound: [], total: 0 };

    const match = (text: string) => text.toLowerCase().includes(q);

    const resources = demoResources.filter((r) => match(r.title) || match(r.subject) || (r.description ?? '').match(q));
    const events = demoEvents.filter((e) => match(e.title) || match(e.description) || match(e.organizer));
    const clubs = demoClubs.filter((c) => match(c.name) || match(c.description));
    const opportunities = demoOpportunities.filter((o) => match(o.title) || match(o.organization) || match(o.description));
    const exams = demoExams.filter((e) => match(e.title));
    const locations = demoLocations.filter((l) => match(l.name) || match(l.description));
    const questions = demoQuestions.filter((qu) => match(qu.title) || match(qu.body));
    const lostFound = demoLostFound.filter((lf) => match(lf.title) || match(lf.description));

    return {
      resources, events, clubs, opportunities, exams, locations, questions, lostFound,
      total: resources.length + events.length + clubs.length + opportunities.length + exams.length + locations.length + questions.length + lostFound.length,
    };
  }, [query]);

  const showResults = hasSearched && query.trim().length > 0;
  const filteredCategories = categories.filter((c) => {
    if (c.value === 'all') return true;
    if (c.value === 'resources') return results.resources.length > 0;
    if (c.value === 'events') return results.events.length > 0;
    if (c.value === 'clubs') return results.clubs.length > 0;
    if (c.value === 'opportunities') return results.opportunities.length > 0;
    if (c.value === 'exams') return results.exams.length > 0;
    if (c.value === 'campus') return results.locations.length > 0;
    if (c.value === 'questions') return results.questions.length > 0;
    if (c.value === 'lost-found') return results.lostFound.length > 0;
    return false;
  });

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <PageHeader title="Search" description="Find resources, events, clubs, opportunities, and more across campus" />

        {/* Search Input */}
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="global-search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setHasSearched(true); }}
            placeholder="Search across everything..."
            className="h-14 pl-12 pr-12 text-base rounded-2xl"
            autoFocus
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setHasSearched(false); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        {showResults && (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            {filteredCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = category === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full border shrink-0 transition-colors ${
                    isActive ? 'border-primary text-primary bg-primary/5' : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Results */}
        {!showResults ? (
          <EmptyState
            icon={<SearchIcon className="h-10 w-10" />}
            title="Start searching"
            description="Search across resources, events, clubs, opportunities, exams, campus locations, questions, and lost & found items."
          />
        ) : results.total === 0 ? (
          <EmptyState
            icon={<SearchIcon className="h-10 w-10" />}
            title="No results found"
            description={`No matches for "${query}". Try different keywords.`}
          />
        ) : (
          <div className="space-y-8">
            {(category === 'all' || category === 'resources') && results.resources.length > 0 && (
              <ResultSection title="Resources" count={results.resources.length}>
                <div className="grid sm:grid-cols-2 gap-4">
                  {results.resources.slice(0, 4).map((r, i) => <ResourceCard key={r.id} resource={r} index={i} />)}
                </div>
              </ResultSection>
            )}
            {(category === 'all' || category === 'events') && results.events.length > 0 && (
              <ResultSection title="Events" count={results.events.length}>
                <div className="grid sm:grid-cols-2 gap-4">
                  {results.events.slice(0, 4).map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
                </div>
              </ResultSection>
            )}
            {(category === 'all' || category === 'clubs') && results.clubs.length > 0 && (
              <ResultSection title="Clubs" count={results.clubs.length}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.clubs.slice(0, 6).map((c, i) => <ClubCard key={c.id} club={c} index={i} />)}
                </div>
              </ResultSection>
            )}
            {(category === 'all' || category === 'opportunities') && results.opportunities.length > 0 && (
              <ResultSection title="Opportunities" count={results.opportunities.length}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.opportunities.slice(0, 6).map((o, i) => <OpportunityCard key={o.id} opportunity={o} index={i} />)}
                </div>
              </ResultSection>
            )}
            {(category === 'all' || category === 'questions') && results.questions.length > 0 && (
              <ResultSection title="Questions" count={results.questions.length}>
                <div className="space-y-3">
                  {results.questions.slice(0, 4).map((q, i) => <QuestionCard key={q.id} question={q} index={i} />)}
                </div>
              </ResultSection>
            )}
            {(category === 'all' || category === 'exams') && results.exams.length > 0 && (
              <ResultSection title="Exams" count={results.exams.length}>
                <div className="space-y-3">
                  {results.exams.map((ex) => (
                    <Card key={ex.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{ex.title}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">{new Date(ex.exam_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} • Sem {ex.semester} • {ex.branch}</p>
                        </div>
                        <Badge variant="secondary">{ex.exam_type}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </ResultSection>
            )}
            {(category === 'all' || category === 'campus') && results.locations.length > 0 && (
              <ResultSection title="Campus Locations" count={results.locations.length}>
                <div className="grid sm:grid-cols-2 gap-3">
                  {results.locations.map((loc) => (
                    <Card key={loc.id} className="p-4">
                      <h4 className="font-medium text-sm">{loc.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{loc.description}</p>
                      <Badge variant="outline" className="mt-2 capitalize text-xs">{loc.category}</Badge>
                    </Card>
                  ))}
                </div>
              </ResultSection>
            )}
            {(category === 'all' || category === 'lost-found') && results.lostFound.length > 0 && (
              <ResultSection title="Lost & Found" count={results.lostFound.length}>
                <div className="grid sm:grid-cols-2 gap-3">
                  {results.lostFound.map((lf) => (
                    <Card key={lf.id} className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={lf.type === 'lost' ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-accent/10 text-accent border-accent/20'}>
                          {lf.type === 'lost' ? 'Lost' : 'Found'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{lf.location}</span>
                      </div>
                      <h4 className="font-medium text-sm">{lf.title}</h4>
                    </Card>
                  ))}
                </div>
              </ResultSection>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function ResultSection({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <Badge variant="secondary">{count}</Badge>
      </div>
      {children}
    </motion.div>
  );
}

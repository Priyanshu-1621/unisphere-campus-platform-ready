'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Building, FlaskConical, Library, Coffee, Music, Trophy, Users, Layers } from 'lucide-react';
import { AppShell } from '@/components/layout/navigation';
import { PageHeader, FilterBar } from '@/components/layout/page-header';
import { RevealUp } from '@/components/animation/animation-utils';
import { EmptyState } from '@/components/shared/states';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { demoLocations } from '@/lib/demo-data';
import { useCampusLocations, isSupabaseConfigured } from '@/lib/hooks/use-supabase-data';
import type { CampusLocation } from '@/types';

const categoryFilters = [
  { value: 'all', label: 'All' },
  { value: 'academic', label: 'Academic' },
  { value: 'lab', label: 'Labs' },
  { value: 'library', label: 'Library' },
  { value: 'cafeteria', label: 'Cafeteria' },
  { value: 'auditorium', label: 'Auditorium' },
  { value: 'sports', label: 'Sports' },
  { value: 'club', label: 'Clubs' },
  { value: 'other', label: 'Other' },
];

const categoryIcons: Record<string, typeof MapPin> = {
  academic: Building,
  lab: FlaskConical,
  library: Library,
  cafeteria: Coffee,
  auditorium: Music,
  sports: Trophy,
  club: Users,
  other: Layers,
};

const categoryColors: Record<string, string> = {
  academic: 'text-blue-500',
  lab: 'text-teal-500',
  library: 'text-amber-500',
  cafeteria: 'text-orange-500',
  auditorium: 'text-purple-500',
  sports: 'text-green-500',
  club: 'text-pink-500',
  other: 'text-muted-foreground',
};

export default function CampusPage() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const locationsQuery = useCampusLocations();
  const allLocations = isSupabaseConfigured && locationsQuery.data.length > 0 ? locationsQuery.data : demoLocations;
  const [selected, setSelected] = useState<CampusLocation | null>(allLocations[0] ?? null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allLocations.filter((l) => {
      if (category !== 'all' && l.category !== category) return false;
      if (q && !l.name.toLowerCase().includes(q) && !l.description.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [category, search, allLocations]);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <PageHeader
          title="Campus Guide"
          description="Explore your campus with an interactive digital map"
        />

        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search locations..."
            className="pl-9"
          />
        </div>

        <FilterBar
          filters={categoryFilters}
          active={category}
          onChange={setCategory}
          className="campus-page"
        />

        {/* Interactive Map + Details */}
        <div className="grid md:grid-cols-[1fr_300px] gap-4">
          {/* Map */}
          <Card className="relative overflow-hidden min-h-[400px] md:min-h-[500px]">
            <div className="absolute inset-0 grid-pattern opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />

            {/* Decorative paths */}
            <svg className="absolute inset-0 w-full h-full opacity-20" aria-hidden="true">
              <line x1="25%" y1="30%" x2="40%" y2="50%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="40%" y1="50%" x2="50%" y2="65%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="50%" y1="65%" x2="70%" y2="45%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="25%" y1="30%" x2="20%" y2="45%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="55%" y1="25%" x2="70%" y2="35%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 4" />
            </svg>

            {/* Location markers */}
            {filtered.map((loc) => {
              const Icon = categoryIcons[loc.category] ?? MapPin;
              const colorClass = categoryColors[loc.category] ?? 'text-muted-foreground';
              const isSelected = selected?.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => setSelected(loc)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                  aria-label={loc.name}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`relative flex items-center justify-center rounded-full border-2 transition-all ${
                      isSelected
                        ? 'h-10 w-10 bg-primary/20 border-primary scale-110 z-20'
                        : 'h-8 w-8 bg-card border-border hover:border-primary/60 hover:scale-110 z-10'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isSelected ? 'text-primary' : colorClass}`} />
                    {isSelected && (
                      <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-40" />
                    )}
                  </motion.div>
                  <span className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[10px] font-medium px-1.5 py-0.5 rounded bg-card/80 backdrop-blur-sm border border-border/60 transition-opacity ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    {loc.name.split('—')[0].trim()}
                  </span>
                </button>
              );
            })}

            {/* Legend */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
              {Object.entries(categoryIcons).slice(0, 6).map(([cat, Icon]) => (
                <div key={cat} className="flex items-center gap-1 rounded-lg bg-card/80 backdrop-blur-sm border border-border/60 px-2 py-1">
                  <Icon className={`h-3 w-3 ${categoryColors[cat]}`} />
                  <span className="text-[10px] capitalize text-muted-foreground">{cat}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Details Panel */}
          <AnimatePresence mode="wait">
            {selected && (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-5 h-full">
                  <div className="flex items-center gap-2 mb-3">
                    {(() => {
                      const Icon = categoryIcons[selected.category] ?? MapPin;
                      return <div className={`h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center ${categoryColors[selected.category]}`}><Icon className="h-5 w-5" /></div>;
                    })()}
                    <Badge variant="secondary" className="capitalize">{selected.category}</Badge>
                  </div>
                  <h3 className="font-display text-lg font-semibold">{selected.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{selected.description}</p>

                  <div className="mt-4 space-y-2 border-t border-border/40 pt-4">
                    {selected.building && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Building:</span>
                        <span className="font-medium">{selected.building}</span>
                      </div>
                    )}
                    {selected.floor && (
                      <div className="flex items-center gap-2 text-sm">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Floor:</span>
                        <span className="font-medium">{selected.floor}</span>
                      </div>
                    )}
                    {selected.room && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Room:</span>
                        <span className="font-medium">{selected.room}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Location Cards Grid */}
        <div>
          <h3 className="font-display text-lg font-semibold mb-4">All Locations</h3>
          {filtered.length === 0 ? (
            <EmptyState
              icon={<MapPin className="h-10 w-10" />}
              title="No locations found"
              description="Try adjusting your search or category filter."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((loc, i) => {
                const Icon = categoryIcons[loc.category] ?? MapPin;
                return (
                  <RevealUp key={loc.id} delay={Math.min(i * 0.04, 0.24)}>
                    <Card
                      className="p-4 cursor-pointer hover:border-border hover:shadow-md transition-all"
                      onClick={() => setSelected(loc)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 ${categoryColors[loc.category]}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">{loc.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{loc.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-[10px] capitalize">{loc.category}</Badge>
                            {loc.room && <span className="text-[10px] text-muted-foreground">{loc.building} • {loc.room}</span>}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </RevealUp>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

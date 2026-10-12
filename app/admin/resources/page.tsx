'use client';

import { AdminLayout } from '@/components/layout/admin-layout';
import { PageHeader } from '@/components/layout/page-header';
import { RevealUp } from '@/components/animation/animation-utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/states';
import { StatusBadge, ContributorBadge } from '@/components/shared/badges';
import { Search, Trash2, Edit, Eye } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { demoResources, formatRelativeTime } from '@/lib/demo-data';

export default function AdminResourcesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return demoResources.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (q && !r.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, statusFilter]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="Manage Resources" description={`${demoResources.length} total resources`} />

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search resources..." className="pl-9" />
          </div>
          <div className="flex gap-2">
            {['all', 'verified', 'under_review', 'rejected', 'archived'].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors capitalize ${statusFilter === s ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}>
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No resources found" description="Try adjusting your filters." />
        ) : (
          <div className="space-y-2">
            {filtered.map((r, i) => (
              <RevealUp key={r.id} delay={Math.min(i * 0.03, 0.2)}>
                <Card className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm truncate">{r.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{r.subject} • Sem {r.semester} • {r.branch}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <StatusBadge status={r.status} />
                        <ContributorBadge isVerified={r.contributor_verified} />
                        <span className="text-xs text-muted-foreground">by {r.contributor_name}</span>
                        <span className="text-xs text-muted-foreground">{formatRelativeTime(r.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </Card>
              </RevealUp>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

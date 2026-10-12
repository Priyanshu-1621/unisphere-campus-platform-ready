'use client';

import { AdminLayout } from '@/components/layout/admin-layout';
import { PageHeader } from '@/components/layout/page-header';
import { RevealUp } from '@/components/animation/animation-utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, CalendarClock } from 'lucide-react';
import { demoOpportunities, getDaysUntil } from '@/lib/demo-data';

export default function AdminOpportunitiesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="Manage Opportunities" description={`${demoOpportunities.length} opportunities`} actions={<Button className="rounded-full gap-2"><Plus className="h-4 w-4" /> Add Opportunity</Button>} />
        <div className="space-y-2">
          {demoOpportunities.map((o, i) => (
            <RevealUp key={o.id} delay={Math.min(i * 0.03, 0.2)}>
              <Card className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm truncate">{o.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{o.organization}</p>
                    <Badge variant="secondary" className="mt-1 text-xs">{o.category.replace('_', ' ')}</Badge>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Badge variant={getDaysUntil(o.deadline) >= 0 ? 'default' : 'secondary'} className="text-xs flex items-center gap-1"><CalendarClock className="h-3 w-3" /> {getDaysUntil(o.deadline) >= 0 ? `${getDaysUntil(o.deadline)}d` : 'Expired'}</Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </Card>
            </RevealUp>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

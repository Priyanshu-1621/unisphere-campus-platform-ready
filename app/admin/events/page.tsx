'use client';

import { AdminLayout } from '@/components/layout/admin-layout';
import { PageHeader } from '@/components/layout/page-header';
import { RevealUp } from '@/components/animation/animation-utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { demoEvents, getDaysUntil } from '@/lib/demo-data';

export default function AdminEventsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="Manage Events" description={`${demoEvents.length} events`} actions={<Button className="rounded-full gap-2"><Plus className="h-4 w-4" /> Add Event</Button>} />
        <div className="space-y-2">
          {demoEvents.map((e, i) => (
            <RevealUp key={e.id} delay={Math.min(i * 0.03, 0.2)}>
              <Card className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm truncate">{e.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {e.location}</p>
                    <Badge variant="secondary" className="mt-1 text-xs">{e.category}</Badge>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Badge variant={getDaysUntil(e.date) >= 0 ? 'default' : 'secondary'} className="text-xs">{getDaysUntil(e.date) >= 0 ? `${getDaysUntil(e.date)}d` : 'Past'}</Badge>
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

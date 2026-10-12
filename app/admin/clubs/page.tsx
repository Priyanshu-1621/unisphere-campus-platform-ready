'use client';

import { AdminLayout } from '@/components/layout/admin-layout';
import { PageHeader } from '@/components/layout/page-header';
import { RevealUp } from '@/components/animation/animation-utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { demoClubs } from '@/lib/demo-data';

export default function AdminClubsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="Manage Clubs" description={`${demoClubs.length} clubs`} actions={<Button className="rounded-full gap-2"><Plus className="h-4 w-4" /> Add Club</Button>} />
        <div className="space-y-2">
          {demoClubs.map((c, i) => (
            <RevealUp key={c.id} delay={Math.min(i * 0.03, 0.2)}>
              <Card className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm truncate">{c.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><Users className="h-3 w-3" /> {c.member_count} members</p>
                    <Badge variant="secondary" className="mt-1 text-xs">{c.category}</Badge>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Badge variant={c.recruitment_open ? 'default' : 'secondary'} className="text-xs">{c.recruitment_open ? 'Recruiting' : 'Closed'}</Badge>
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

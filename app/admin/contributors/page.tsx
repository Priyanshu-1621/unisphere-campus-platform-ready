'use client';

import { AdminLayout } from '@/components/layout/admin-layout';
import { PageHeader } from '@/components/layout/page-header';
import { RevealUp } from '@/components/animation/animation-utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Award, Star, FileText, MessageCircle, ThumbsUp } from 'lucide-react';

const contributors = [
  { name: 'Aarav Sharma', username: 'aarav_s', role: 'verified_contributor', verified: true, resources: 24, verified_count: 18, answers: 12, helpful: 89 },
  { name: 'Priya Reddy', username: 'priya_r', role: 'verified_contributor', verified: true, resources: 18, verified_count: 15, answers: 8, helpful: 45 },
  { name: 'Sneha Iyer', username: 'sneha_i', role: 'moderator', verified: true, resources: 32, verified_count: 30, answers: 25, helpful: 120 },
  { name: 'Karthik Nair', username: 'karthik_n', role: 'verified_contributor', verified: true, resources: 15, verified_count: 12, answers: 6, helpful: 34 },
  { name: 'Dev Patel', username: 'dev_p', role: 'contributor', verified: false, resources: 8, verified_count: 5, answers: 3, helpful: 12 },
  { name: 'Rohan Mehta', username: 'rohan_m', role: 'student', verified: false, resources: 2, verified_count: 0, answers: 1, helpful: 3 },
];

export default function AdminContributorsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="Contributors" description="Manage contributor statuses and track contributions" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contributors.map((c, i) => (
            <RevealUp key={c.username} delay={Math.min(i * 0.05, 0.3)}>
              <Card className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-medium">
                      {c.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-medium text-sm truncate">{c.name}</h4>
                      {c.verified && <Star className="h-3.5 w-3.5 text-accent fill-accent" />}
                    </div>
                    <p className="text-xs text-muted-foreground">@{c.username}</p>
                  </div>
                </div>
                <Badge className={c.verified ? 'bg-accent/10 text-accent border-accent/20' : 'bg-muted text-muted-foreground border-border'}>
                  {c.verified ? 'Verified Contributor' : c.role}
                </Badge>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="flex items-center gap-2 text-xs">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" /> {c.resources} resources
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Award className="h-3.5 w-3.5 text-muted-foreground" /> {c.verified_count} verified
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <MessageCircle className="h-3.5 w-3.5 text-muted-foreground" /> {c.answers} answers
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <ThumbsUp className="h-3.5 w-3.5 text-muted-foreground" /> {c.helpful} helpful
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

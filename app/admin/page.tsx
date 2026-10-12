'use client';

import { AdminLayout } from '@/components/layout/admin-layout';
import { PageHeader } from '@/components/layout/page-header';
import { RevealUp, AnimatedCounter } from '@/components/animation/animation-utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users, FileText, ShieldCheck, Calendar, Building, Briefcase, Flag, Award,
  TrendingUp, Clock, AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { demoResources, demoEvents, demoClubs, demoOpportunities } from '@/lib/demo-data';

const metrics = [
  { label: 'Total Users', value: 5240, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Resources', value: 1240, icon: FileText, color: 'text-teal-500', bg: 'bg-teal-500/10' },
  { label: 'Pending Verification', value: 18, icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { label: 'Events', value: 85, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { label: 'Clubs', value: 30, icon: Building, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { label: 'Opportunities', value: 42, icon: Briefcase, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { label: 'Reports', value: 7, icon: Flag, color: 'text-destructive', bg: 'bg-destructive/10' },
  { label: 'Contributors', value: 156, icon: Award, color: 'text-accent', bg: 'bg-accent/10' },
];

export default function AdminDashboard() {
  const pendingResources = demoResources.filter((r) => r.status === 'under_review');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Admin Dashboard"
          description="Overview of UniSphere platform metrics and moderation"
          actions={<Badge className="bg-destructive/10 text-destructive border-destructive/20 gap-1"><AlertCircle className="h-3 w-3" /> Admin Access</Badge>}
        />

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <RevealUp key={metric.label} delay={i * 0.03}>
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{metric.label}</span>
                    <div className={`h-7 w-7 rounded-lg ${metric.bg} flex items-center justify-center`}>
                      <Icon className={`h-4 w-4 ${metric.color}`} />
                    </div>
                  </div>
                  <AnimatedCounter value={metric.value} className="font-display text-2xl font-bold" />
                </Card>
              </RevealUp>
            );
          })}
        </div>

        {/* Pending Verification */}
        <RevealUp>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-500" />
                Pending Resource Verification
              </h3>
              <Link href="/admin/verification"><Button variant="outline" size="sm" className="rounded-full">View All</Button></Link>
            </div>
            <div className="space-y-2">
              {pendingResources.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border border-border/60">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{r.title}</p>
                    <p className="text-xs text-muted-foreground">by {r.contributor_name} • {r.subject}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">Under Review</Badge>
                    <Link href="/admin/verification"><Button size="sm" variant="outline" className="rounded-full h-7 text-xs">Review</Button></Link>
                  </div>
                </div>
              ))}
              {pendingResources.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No pending resources.</p>}
            </div>
          </Card>
        </RevealUp>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-4">
          <RevealUp>
            <Card className="p-6">
              <h3 className="font-display text-lg font-semibold flex items-center gap-2 mb-4"><TrendingUp className="h-5 w-5 text-primary" /> Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { action: 'New user registered', time: '2m ago' },
                  { action: 'Resource verified by moderator', time: '15m ago' },
                  { action: 'New event posted', time: '1h ago' },
                  { action: 'Report submitted', time: '2h ago' },
                  { action: 'Club recruitment opened', time: '3h ago' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span>{item.action}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {item.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </RevealUp>

          <RevealUp delay={0.05}>
            <Card className="p-6">
              <h3 className="font-display text-lg font-semibold flex items-center gap-2 mb-4"><Flag className="h-5 w-5 text-destructive" /> Recent Reports</h3>
              <div className="space-y-3">
                {[
                  { target: 'Resource: DSA Notes', reason: 'Duplicate', status: 'pending' },
                  { target: 'Event: Career Fair', reason: 'Wrong info', status: 'pending' },
                  { target: 'Question: Hostel food', reason: 'Inappropriate', status: 'resolved' },
                ].map((report, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{report.target}</p>
                      <p className="text-xs text-muted-foreground">{report.reason}</p>
                    </div>
                    <Badge variant={report.status === 'pending' ? 'secondary' : 'outline'} className={report.status === 'pending' ? 'text-amber-500' : 'text-accent'}>
                      {report.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <Link href="/admin/reports"><Button variant="outline" size="sm" className="rounded-full mt-4 w-full">Review All Reports</Button></Link>
            </Card>
          </RevealUp>
        </div>
      </div>
    </AdminLayout>
  );
}

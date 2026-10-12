'use client';

import { AdminLayout } from '@/components/layout/admin-layout';
import { PageHeader } from '@/components/layout/page-header';
import { RevealUp } from '@/components/animation/animation-utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/states';
import { Check, X, Flag } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const initialReports = [
  { id: 'rep1', targetType: 'resource', targetName: 'DSA Complete Notes (Unit 1-5)', reason: 'Duplicate', description: 'This seems to be a duplicate of another resource already on the platform.', status: 'pending', reporter: 'anonymous', created_at: '2024-09-28T15:00:00Z' },
  { id: 'rep2', targetType: 'event', targetName: 'Career Fair — Tech & Core', reason: 'Wrong info', description: 'The date mentioned is incorrect. Actual date is October 16, not 15.', status: 'pending', reporter: 'aarav_s', created_at: '2024-09-27T10:00:00Z' },
  { id: 'rep3', targetType: 'question', targetName: 'How is the hostel food?', reason: 'Inappropriate', description: 'Contains inappropriate language in the description.', status: 'pending', reporter: 'priya_r', created_at: '2024-09-26T18:00:00Z' },
  { id: 'rep4', targetType: 'resource', targetName: 'OS Previous Year Questions', reason: 'Outdated', description: 'These are from 2018-2019, very outdated.', status: 'resolved', reporter: 'rohan_m', created_at: '2024-09-20T12:00:00Z' },
];

const reasonColors: Record<string, string> = {
  'Duplicate': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Wrong info': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  'Inappropriate': 'bg-destructive/10 text-destructive border-destructive/20',
  'Outdated': 'bg-muted text-muted-foreground border-border',
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState(initialReports);
  const pending = reports.filter((r) => r.status === 'pending');

  const handleResolve = (id: string) => {
    setReports(reports.map((r) => r.id === id ? { ...r, status: 'resolved' } : r));
  };
  const handleDismiss = (id: string) => {
    setReports(reports.map((r) => r.id === id ? { ...r, status: 'dismissed' } : r));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Reports"
          description={`${pending.length} reports awaiting review`}
        />

        {reports.length === 0 ? (
          <EmptyState icon={<Flag className="h-10 w-10" />} title="No reports" description="All reports have been reviewed." />
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {reports.map((report, i) => (
                <motion.div
                  key={report.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: Math.min(i * 0.05, 0.2) }}
                >
                  <RevealUp>
                    <Card className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <Badge className={reasonColors[report.reason] ?? 'bg-muted text-muted-foreground border-border'}>{report.reason}</Badge>
                            <Badge variant="outline" className="text-xs capitalize">{report.targetType}</Badge>
                            <Badge variant={report.status === 'pending' ? 'secondary' : 'outline'} className={report.status === 'pending' ? 'text-amber-500' : report.status === 'resolved' ? 'text-accent' : ''}>
                              {report.status}
                            </Badge>
                          </div>
                          <h3 className="font-medium text-sm">{report.targetName}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                          <p className="text-xs text-muted-foreground/60 mt-2">Reported by {report.reporter}</p>
                        </div>
                        {report.status === 'pending' && (
                          <div className="flex items-center gap-2 shrink-0">
                            <Button size="sm" className="rounded-full h-8 gap-1 bg-accent hover:bg-accent" onClick={() => handleResolve(report.id)}>
                              <Check className="h-3.5 w-3.5" /> Resolve
                            </Button>
                            <Button size="sm" variant="outline" className="rounded-full h-8 gap-1" onClick={() => handleDismiss(report.id)}>
                              <X className="h-3.5 w-3.5" /> Dismiss
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  </RevealUp>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

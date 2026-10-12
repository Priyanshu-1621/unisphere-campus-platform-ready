'use client';

import { AdminLayout } from '@/components/layout/admin-layout';
import { PageHeader } from '@/components/layout/page-header';
import { RevealUp } from '@/components/animation/animation-utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/states';
import { Check, X, Archive, FileText } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { demoResources, formatFileSize, formatRelativeTime } from '@/lib/demo-data';
import type { Resource } from '@/types';

export default function AdminVerificationPage() {
  const [resources, setResources] = useState<Resource[]>(demoResources);
  const [action, setAction] = useState<string | null>(null);

  const pending = resources.filter((r) => r.status === 'under_review');

  const handleAction = (id: string, newStatus: Resource['status']) => {
    setResources(resources.map((r) => r.id === id ? { ...r, status: newStatus } : r));
    setAction(id + newStatus);
    setTimeout(() => setAction(null), 1000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Resource Verification"
          description={`${pending.length} resources awaiting review`}
        />

        {pending.length === 0 ? (
          <EmptyState
            icon={<Check className="h-10 w-10" />}
            title="All caught up!"
            description="No resources are pending verification right now."
          />
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {pending.map((resource, i) => (
                <motion.div
                  key={resource.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: Math.min(i * 0.05, 0.2) }}
                >
                  <RevealUp>
                    <Card className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-medium text-sm truncate">{resource.title}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{resource.description}</p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">{resource.subject}</Badge>
                              <Badge variant="secondary" className="text-xs">Sem {resource.semester} • {resource.branch}</Badge>
                              <span className="text-xs text-muted-foreground">{resource.file_type} • {formatFileSize(resource.file_size ?? 0)}</span>
                              <span className="text-xs text-muted-foreground">by {resource.contributor_name}</span>
                              <span className="text-xs text-muted-foreground">{formatRelativeTime(resource.created_at)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            size="sm"
                            className="rounded-full h-8 gap-1 bg-accent hover:bg-accent"
                            onClick={() => handleAction(resource.id, 'verified')}
                          >
                            <Check className="h-3.5 w-3.5" /> Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full h-8 gap-1 text-destructive hover:text-destructive"
                            onClick={() => handleAction(resource.id, 'rejected')}
                          >
                            <X className="h-3.5 w-3.5" /> Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-full h-8"
                            onClick={() => handleAction(resource.id, 'archived')}
                          >
                            <Archive className="h-3.5 w-3.5" />
                          </Button>
                        </div>
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

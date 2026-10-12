'use client';

import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ShieldCheck, Users, Info, BookOpen, Zap } from 'lucide-react';
import type { SourceLabel, ResourceStatus, UserRole } from '@/types';

export function VerificationBadge({ verified, label = 'Verified Resource' }: { verified: boolean; label?: string }) {
  if (!verified) return null;
  return (
    <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 gap-1">
      <CheckCircle2 className="h-3 w-3" />
      {label}
    </Badge>
  );
}

export function ContributorBadge({ isVerified }: { isVerified: boolean }) {
  if (!isVerified) return null;
  return (
    <Badge className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/15 gap-1">
      <ShieldCheck className="h-3 w-3" />
      Verified Contributor
    </Badge>
  );
}

export function SourceBadge({ label }: { label: SourceLabel }) {
  const config: Record<SourceLabel, { icon: typeof Info; className: string }> = {
    'Campus Update': { icon: Info, className: 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20' },
    'Student Update': { icon: Users, className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
    'Club Update': { icon: Zap, className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
    'Verified Resource': { icon: CheckCircle2, className: 'bg-primary/10 text-primary border-primary/20' },
    'Verified Contributor': { icon: ShieldCheck, className: 'bg-accent/10 text-accent border-accent/20' },
    'Community Information': { icon: BookOpen, className: 'bg-muted text-muted-foreground border-border' },
  };
  const { icon: Icon, className } = config[label];
  return (
    <Badge className={`${className} gap-1`}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: ResourceStatus }) {
  const config: Record<ResourceStatus, { label: string; className: string }> = {
    under_review: { label: 'Under Review', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
    verified: { label: 'Verified', className: 'bg-primary/10 text-primary border-primary/20' },
    rejected: { label: 'Rejected', className: 'bg-destructive/10 text-destructive border-destructive/20' },
    archived: { label: 'Archived', className: 'bg-muted text-muted-foreground border-border' },
  };
  const { label, className } = config[status];
  return <Badge className={`${className} gap-1`}>{label}</Badge>;
}

export function RoleBadge({ role }: { role: UserRole }) {
  const config: Record<UserRole, { label: string; className: string }> = {
    student: { label: 'Student', className: 'bg-muted text-muted-foreground border-border' },
    contributor: { label: 'Contributor', className: 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20' },
    verified_contributor: { label: 'Verified Contributor', className: 'bg-accent/10 text-accent border-accent/20' },
    moderator: { label: 'Moderator', className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
    admin: { label: 'Admin', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  };
  const { label, className } = config[role];
  return <Badge className={`${className} gap-1`}>{label}</Badge>;
}

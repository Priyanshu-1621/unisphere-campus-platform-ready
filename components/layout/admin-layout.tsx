'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { ShieldCheck, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard, Users, FileText, ShieldCheck as ShieldIcon, Calendar, Building,
  Briefcase, FileCheck, MapPin, HelpCircle, PackageSearch, Flag,
  Award, Megaphone, Settings,
} from 'lucide-react';

const adminSections = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/resources', label: 'Resources', icon: FileText },
  { href: '/admin/verification', label: 'Verification', icon: ShieldIcon },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/clubs', label: 'Clubs', icon: Building },
  { href: '/admin/opportunities', label: 'Opportunities', icon: Briefcase },
  { href: '/admin/exams', label: 'Exams', icon: FileCheck },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/admin/reports', label: 'Reports', icon: Flag },
  { href: '/admin/contributors', label: 'Contributors', icon: Award },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, loading, isDemoMode } = useAuth();

  const isAdmin = profile?.role === 'admin' || profile?.role === 'moderator';

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="h-8 w-8 rounded-full border-2 border-muted border-t-primary animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (!isAdmin) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto text-center py-20 px-6">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-5">
            <Lock className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-3">Access Restricted</h2>
          <p className="text-muted-foreground mb-6">
            {isDemoMode
              ? 'Admin tools are not available in demo mode. Sign in with an admin or moderator account to manage content.'
              : 'This area is restricted to administrators and moderators. If you believe you should have access, contact your platform administrator.'}
          </p>
          <Link href="/home"><Button variant="outline" className="rounded-full">Back to Dashboard</Button></Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex">
        <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-border min-h-[calc(100vh-4rem)] sticky top-16 self-start">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4 px-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="font-display text-sm font-bold">Admin Panel</span>
            </div>
            <nav className="space-y-0.5">
              {adminSections.map((section) => {
                const isActive = pathname === section.href;
                const Icon = section.icon;
                return (
                  <Link
                    key={section.href}
                    href={section.href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {section.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            {children}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export { adminSections };

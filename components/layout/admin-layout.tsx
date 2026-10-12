'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/navigation';
import {
  LayoutDashboard, Users, FileText, ShieldCheck, Calendar, Building,
  Briefcase, FileCheck, MapPin, HelpCircle, PackageSearch, Flag,
  Award, Megaphone, Settings,
} from 'lucide-react';

const adminSections = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/resources', label: 'Resources', icon: FileText },
  { href: '/admin/verification', label: 'Verification', icon: ShieldCheck },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/clubs', label: 'Clubs', icon: Building },
  { href: '/admin/opportunities', label: 'Opportunities', icon: Briefcase },
  { href: '/admin/exams', label: 'Exams', icon: FileCheck },
  { href: '/admin/locations', label: 'Locations', icon: MapPin },
  { href: '/admin/questions', label: 'Questions', icon: HelpCircle },
  { href: '/admin/lost-found', label: 'Lost & Found', icon: PackageSearch },
  { href: '/admin/reports', label: 'Reports', icon: Flag },
  { href: '/admin/contributors', label: 'Contributors', icon: Award },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AppShell>
      <div className="flex">
        {/* Sidebar — desktop only */}
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

        {/* Content */}
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

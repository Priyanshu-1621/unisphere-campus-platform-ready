'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Calendar, BookOpen, FileText, Info, Briefcase, MessageCircle, CheckCircle2, Check,
} from 'lucide-react';
import { AppShell } from '@/components/layout/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/states';
import { demoNotifications, formatRelativeTime } from '@/lib/demo-data';
import { useNotifications, isSupabaseConfigured } from '@/lib/hooks/use-supabase-data';
import type { Notification } from '@/types';

const typeConfig: Record<Notification['type'], { icon: typeof Bell; color: string; bg: string }> = {
  event_reminder: { icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  new_resource: { icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  exam_reminder: { icon: FileText, color: 'text-destructive', bg: 'bg-destructive/10' },
  campus_update: { icon: Info, color: 'text-teal-500', bg: 'bg-teal-500/10' },
  opportunity_deadline: { icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  question_activity: { icon: MessageCircle, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  verification_status: { icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10' },
};

export default function NotificationsPage() {
  const notificationsQuery = useNotifications();
  const initialNotifications = isSupabaseConfigured && notificationsQuery.data.length > 0 ? notificationsQuery.data : demoNotifications;
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.is_read) : notifications;
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <PageHeader
          title="Notifications"
          description={unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : "You're all caught up"}
          actions={
            unreadCount > 0 && (
              <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={markAllRead}>
                <Check className="h-4 w-4" />
                Mark all read
              </Button>
            )
          }
        />

        {/* Filter tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-colors ${
              filter === 'all' ? 'border-primary text-primary bg-primary/5' : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-colors ${
              filter === 'unread' ? 'border-primary text-primary bg-primary/5' : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Bell className="h-10 w-10" />}
            title="No notifications"
            description="You'll see exam reminders, event updates, new resources, and more here."
          />
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filtered.map((notif, i) => {
                const config = typeConfig[notif.type];
                const Icon = config.icon;
                return (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: Math.min(i * 0.03, 0.15) }}
                  >
                    <Card
                      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                        !notif.is_read ? 'border-primary/30 bg-primary/5' : ''
                      }`}
                      onClick={() => markRead(notif.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`h-10 w-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                          <Icon className={`h-5 w-5 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {!notif.is_read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                            <h3 className="font-medium text-sm truncate">{notif.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notif.body}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">{formatRelativeTime(notif.created_at)}</span>
                            {notif.link && (
              <Link
                href={notif.link}
                className="text-xs font-medium text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                View
              </Link>
            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AppShell>
  );
}

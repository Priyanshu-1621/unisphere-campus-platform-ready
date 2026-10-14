'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { AppShell } from '@/components/layout/navigation';
import { PageHeader, SectionHeader } from '@/components/layout/page-header';
import { RevealUp, Countdown } from '@/components/animation/animation-utils';
import { ResourceCard } from '@/components/cards/resource-card';
import { EventCard } from '@/components/cards/event-card';
import { OpportunityCard } from '@/components/cards/opportunity-card';
import { ContributorBadge } from '@/components/shared/badges';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Upload,
  Calendar,
  Search,
  MapPin,
  HelpCircle,
  PackageSearch,
  Briefcase,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookMarked,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  demoResources,
  demoEvents,
  demoOpportunities,
  demoExams,
  demoAnnouncements,
  getDaysUntil,
  formatRelativeTime,
} from '@/lib/demo-data';
import {
  useResources,
  useEvents,
  useOpportunities,
  useExams,
  useAnnouncements,
  isSupabaseConfigured,
} from '@/lib/hooks/use-supabase-data';

const quickActions = [
  { label: 'Upload Resource', icon: Upload, href: '/upload', color: 'from-blue-500/20 to-blue-500/5' },
  { label: 'Explore Events', icon: Calendar, href: '/events', color: 'from-emerald-500/20 to-emerald-500/5' },
  { label: 'Find Notes', icon: Search, href: '/academics', color: 'from-teal-500/20 to-teal-500/5' },
  { label: 'Campus Guide', icon: MapPin, href: '/campus', color: 'from-amber-500/20 to-amber-500/5' },
  { label: 'Ask Seniors', icon: HelpCircle, href: '/questions', color: 'from-rose-500/20 to-rose-500/5' },
  { label: 'Lost & Found', icon: PackageSearch, href: '/lost-found', color: 'from-cyan-500/20 to-cyan-500/5' },
  { label: 'Opportunities', icon: Briefcase, href: '/opportunities', color: 'from-accent/20 to-accent/5' },
  { label: 'Academic Hub', icon: BookOpen, href: '/academics', color: 'from-primary/20 to-primary/5' },
];

export default function HomePage() {
  const { profile, loading, isDemoMode } = useAuth();
  const [greeting, setGreeting] = useState('Good afternoon');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const resourcesQuery = useResources();
  const eventsQuery = useEvents();
  const opportunitiesQuery = useOpportunities();
  const examsQuery = useExams();
  const announcementsQuery = useAnnouncements();

  const resources = isSupabaseConfigured && resourcesQuery.data.length > 0 ? resourcesQuery.data : demoResources;
  const events = isSupabaseConfigured && eventsQuery.data.length > 0 ? eventsQuery.data : demoEvents;
  const opportunities = isSupabaseConfigured && opportunitiesQuery.data.length > 0 ? opportunitiesQuery.data : demoOpportunities;
  const exams = isSupabaseConfigured && examsQuery.data.length > 0 ? examsQuery.data : demoExams;
  const announcements = isSupabaseConfigured && announcementsQuery.data.length > 0 ? announcementsQuery.data : demoAnnouncements;

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="h-8 w-8 rounded-full border-2 border-muted border-t-primary animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (!profile) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto text-center py-20 px-6">
          <h2 className="font-display text-2xl font-bold mb-3">You're not signed in</h2>
          <p className="text-muted-foreground mb-6">
            Sign in or create an account to access your UniSphere dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login"><Button className="rounded-full">Sign In</Button></Link>
            <Link href="/signup"><Button variant="outline" className="rounded-full">Create Account</Button></Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const nextExam = exams.find((e) => getDaysUntil(e.exam_date) >= 0) ?? exams[0];
  const examDays = nextExam ? getDaysUntil(nextExam.exam_date) : null;
  const verifiedResources = resources.filter((r) => r.status === 'verified').slice(0, 4);
  const upcomingEvents = events.filter((e) => getDaysUntil(e.date) >= 0).slice(0, 3);
  const urgentOpportunities = opportunities.filter((o) => {
    const d = getDaysUntil(o.deadline);
    return d >= 0 && d <= 30;
  }).slice(0, 3);
  const pinnedAnnouncement = announcements.find((a) => a.is_pinned);

  const profileCompletion = Math.round(
    ([
      profile.bio, profile.username, profile.avatar_url, profile.university,
      profile.skills?.length > 0, profile.interests?.length > 0, profile.achievements?.length > 0,
    ].filter(Boolean).length / 7) * 100
  );

  const stats = [
    { label: 'Profile Completion', value: `${profileCompletion}%`, icon: CheckCircle2, color: 'text-accent' },
    ...(examDays !== null ? [{ label: 'Next Exam', value: `${examDays} days`, icon: Clock, color: examDays <= 7 ? 'text-destructive' : 'text-primary' }] : []),
    { label: 'Verified Resources', value: `${verifiedResources.length}`, icon: BookMarked, color: 'text-primary' },
    { label: 'Upcoming Events', value: `${upcomingEvents.length}`, icon: TrendingUp, color: 'text-accent' },
  ];

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Greeting */}
        <PageHeader
          title={`${greeting}, ${profile.full_name.split(' ')[0]}`}
          description="Here's what's happening on your campus today."
          actions={
            <div className="flex items-center gap-2">
              <ContributorBadge isVerified={profile.is_verified_contributor} />
              {isDemoMode && <Badge variant="outline" className="gap-1"><AlertCircle className="h-3 w-3" /> Demo Mode</Badge>}
            </div>
          }
        />

        {/* Pinned Announcement */}
        {pinnedAnnouncement && (
          <RevealUp>
            <Card className="relative overflow-hidden border-primary/20 bg-primary/5">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
              <div className="p-4 pl-6">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                    </span>
                    Campus Update
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatRelativeTime(pinnedAnnouncement.created_at)}</span>
                </div>
                <h3 className="font-display text-sm font-semibold">{pinnedAnnouncement.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{pinnedAnnouncement.body}</p>
              </div>
            </Card>
          </RevealUp>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <RevealUp key={stat.label} delay={i * 0.05}>
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <div className="font-display text-xl font-bold">{stat.value}</div>
                </Card>
              </RevealUp>
            );
          })}
        </div>

        {/* Quick Actions */}
        <section>
          <SectionHeader title="Quick Actions" description="Jump to what you need" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <RevealUp key={action.label} delay={i * 0.03}>
                  <Link href={action.href}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="group relative rounded-xl border border-border/60 bg-card p-4 hover:border-border hover:shadow-md transition-all cursor-pointer h-full overflow-hidden"
                    >
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                      <div className="relative">
                        <div className="h-10 w-10 rounded-lg bg-card/80 border border-border/40 flex items-center justify-center mb-3">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{action.label}</span>
                      </div>
                    </motion.div>
                  </Link>
                </RevealUp>
              );
            })}
          </div>
        </section>

        {/* Next Exam Countdown */}
        {nextExam && (
          <RevealUp>
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 grid-pattern opacity-10" />
              <div className="relative p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <Badge className="bg-destructive/10 text-destructive border-destructive/20 gap-1 mb-3">
                    <Clock className="h-3 w-3" /> Exam Reminder
                  </Badge>
                  <h3 className="font-display text-xl font-bold">{nextExam.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(nextExam.exam_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    {' • '}Branch {nextExam.branch} • Sem {nextExam.semester}
                  </p>
                  {nextExam.is_verified && (
                    <Badge className="mt-2 bg-primary/10 text-primary border-primary/20 gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Verified Information
                    </Badge>
                  )}
                </div>
                <Countdown targetDate={nextExam.exam_date} />
              </div>
            </Card>
          </RevealUp>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <section>
            <SectionHeader
              title="Upcoming Events"
              description="Don't miss what's happening on campus"
              href="/events"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {upcomingEvents.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Latest Verified Resources */}
        {verifiedResources.length > 0 && (
          <section>
            <SectionHeader
              title="Latest Verified Resources"
              description="Fresh academic materials reviewed by moderators"
              href="/academics"
            />
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              {verifiedResources.map((resource, i) => (
                <ResourceCard key={resource.id} resource={resource} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Opportunities */}
        {urgentOpportunities.length > 0 && (
          <section>
            <SectionHeader
              title="Closing Soon"
              description="Opportunities with approaching deadlines"
              href="/opportunities"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {urgentOpportunities.map((opp, i) => (
                <OpportunityCard key={opp.id} opportunity={opp} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state for no data */}
        {upcomingEvents.length === 0 && verifiedResources.length === 0 && urgentOpportunities.length === 0 && !nextExam && (
          <RevealUp>
            <Card className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold mb-2">No campus data yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {isSupabaseConfigured
                  ? 'Your campus hasn\'t posted events, resources, or opportunities yet. Check back soon or be the first to contribute.'
                  : 'Supabase isn\'t configured, so you\'re seeing a demo snapshot. Connect Supabase to see live campus data.'}
              </p>
            </Card>
          </RevealUp>
        )}
      </div>
    </AppShell>
  );
}
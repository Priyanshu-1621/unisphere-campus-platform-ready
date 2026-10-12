'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { AppShell } from '@/components/layout/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { RevealUp } from '@/components/animation/animation-utils';
import { ContributorBadge, RoleBadge } from '@/components/shared/badges';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResourceCard } from '@/components/cards/resource-card';
import { EventCard } from '@/components/cards/event-card';
import {
  GraduationCap, MapPin, Calendar, Award, BookOpen, Users, Zap, Target,
  Star, FileText, TrendingUp, Eye, EyeOff, Settings as SettingsIcon,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { demoResources, demoEvents } from '@/lib/demo-data';
import { useState } from 'react';

export default function ProfilePage() {
  const { profile, loading, isDemoMode } = useAuth();
  const [showContact, setShowContact] = useState(false);

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
          <h2 className="font-display text-2xl font-bold mb-3">Sign in to view your profile</h2>
          <Link href="/login"><Button className="rounded-full">Sign In</Button></Link>
        </div>
      </AppShell>
    );
  }

  const myResources = demoResources.filter((r) => r.contributor_id === profile.id);
  const savedEvents = demoEvents.filter((e) => e.is_saved);

  const profileFields = [
    { icon: GraduationCap, label: 'University', value: profile.university },
    { icon: BookOpen, label: 'Course', value: profile.course },
    { icon: Target, label: 'Branch', value: profile.branch },
    { icon: Calendar, label: 'Batch', value: `${profile.batch_start} - ${profile.graduation_year}` },
    { icon: Users, label: 'Current Year', value: `Year ${profile.current_year}, Sem ${profile.semester}` },
    { icon: MapPin, label: 'Section', value: profile.section },
  ].filter((f) => f.value);

  const completionFields = [
    profile.bio, profile.username, profile.avatar_url, profile.university,
    profile.skills?.length > 0, profile.interests?.length > 0, profile.achievements?.length > 0,
  ];
  const completion = Math.round((completionFields.filter(Boolean).length / 7) * 100);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <PageHeader
          title="My Profile"
          description="Your student identity on UniSphere"
          actions={
            <Link href="/settings">
              <Button variant="outline" size="sm" className="rounded-full gap-2">
                <SettingsIcon className="h-4 w-4" />
                Settings
              </Button>
            </Link>
          }
        />

        {/* Profile Header Card */}
        <RevealUp>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-10" />
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
            <div className="relative p-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-display text-3xl font-bold text-primary-foreground border-4 border-card shadow-lg">
                    {profile.full_name.charAt(0)}
                  </div>
                  {profile.is_verified_contributor && (
                    <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-card border-2 border-card flex items-center justify-center">
                      <div className="h-full w-full rounded-full bg-accent/10 flex items-center justify-center">
                        <Star className="h-4 w-4 text-accent" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="font-display text-2xl font-bold">{profile.full_name}</h2>
                    {isDemoMode && <Badge variant="outline">Demo Mode</Badge>}
                  </div>
                  {profile.username && <p className="text-sm text-muted-foreground">@{profile.username}</p>}
                  {profile.bio && <p className="mt-2 text-sm text-muted-foreground max-w-lg">{profile.bio}</p>}

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <RoleBadge role={profile.role} />
                    <ContributorBadge isVerified={profile.is_verified_contributor} />
                  </div>

                  {/* Profile completion */}
                  <div className="mt-4 max-w-xs">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Profile completion</span>
                      <span className="font-medium">{completion}%</span>
                    </div>
                    <Progress value={completion} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </RevealUp>

        {/* Academic Info */}
        <RevealUp delay={0.05}>
          <Card className="p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Academic Information</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profileFields.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.label} className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground">{field.label}</div>
                      <div className="text-sm font-medium truncate">{field.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </RevealUp>

        {/* Tabs: About / Resources / Saved / Activity */}
        <Tabs defaultValue="about" className="space-y-4">
          <TabsList className="w-full justify-start overflow-x-auto scrollbar-hide">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="resources">My Resources</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {profile.interests && profile.interests.length > 0 && (
                <Card className="p-5">
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest) => <Badge key={interest} variant="secondary">{interest}</Badge>)}
                  </div>
                </Card>
              )}
              {profile.skills && profile.skills.length > 0 && (
                <Card className="p-5">
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2"><Target className="h-4 w-4 text-accent" /> Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => <Badge key={skill} variant="outline">{skill}</Badge>)}
                  </div>
                </Card>
              )}
              {profile.achievements && profile.achievements.length > 0 && (
                <Card className="p-5">
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2"><Award className="h-4 w-4 text-amber-500" /> Achievements</h4>
                  <ul className="space-y-1.5">
                    {profile.achievements.map((a) => (
                      <li key={a} className="flex items-center gap-2 text-sm"><Star className="h-3.5 w-3.5 text-amber-500" /> {a}</li>
                    ))}
                  </ul>
                </Card>
              )}
              {profile.certifications && profile.certifications.length > 0 && (
                <Card className="p-5">
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2"><FileText className="h-4 w-4 text-blue-500" /> Certifications</h4>
                  <ul className="space-y-1.5">
                    {profile.certifications.map((c) => (
                      <li key={c} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-3.5 w-3.5 text-blue-500" /> {c}</li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="resources">
            {myResources.length === 0 ? (
              <Card className="p-8 text-center">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">You haven't uploaded any resources yet.</p>
                <Link href="/upload"><Button className="mt-4 rounded-full">Upload Resource</Button></Link>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {myResources.map((r, i) => <ResourceCard key={r.id} resource={r} index={i} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved">
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Saved Events</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {savedEvents.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="p-6">
              <h4 className="font-medium text-sm mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Contribution Stats</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Resources Uploaded', value: '24' },
                  { label: 'Resources Verified', value: '18' },
                  { label: 'Questions Answered', value: '12' },
                  { label: 'Helpful Votes', value: '89' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-3 rounded-xl bg-muted/30">
                    <div className="font-display text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

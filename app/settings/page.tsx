'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { AppShell } from '@/components/layout/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { RevealUp } from '@/components/animation/animation-utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { LogOut, User, Palette, Bell, Shield, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { profile, signOut, isDemoMode } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    eventReminders: true,
    examReminders: true,
    newResources: true,
    opportunityDeadlines: true,
    questionActivity: true,
  });
  const [privacy, setPrivacy] = useState({
    showEmail: false,
    showContact: false,
    profilePublic: true,
  });

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <PageHeader title="Settings" description="Manage your account, preferences, and privacy" />

        {/* Account */}
        <RevealUp>
          <Card className="p-6">
            <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Account
            </h3>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={profile?.full_name ?? ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue={profile?.username ?? ''} placeholder="@username" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" rows={3} defaultValue={profile?.bio ?? ''} placeholder="Tell others about yourself..." />
              </div>
              <Button className="rounded-full">Save Changes</Button>
            </div>
          </Card>
        </RevealUp>

        {/* Appearance */}
        <RevealUp delay={0.05}>
          <Card className="p-6">
            <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Appearance
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Theme</div>
                <div className="text-xs text-muted-foreground">Choose between light, dark, or system</div>
              </div>
              <ThemeSwitcher />
            </div>
          </Card>
        </RevealUp>

        {/* Notifications */}
        <RevealUp delay={0.1}>
          <Card className="p-6">
            <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </h3>
            <div className="space-y-4">
              {[
                { key: 'eventReminders', label: 'Event Reminders', desc: 'Get notified before events you saved' },
                { key: 'examReminders', label: 'Exam Reminders', desc: 'Receive countdown alerts for upcoming exams' },
                { key: 'newResources', label: 'New Verified Resources', desc: 'Get notified when resources are verified' },
                { key: 'opportunityDeadlines', label: 'Opportunity Deadlines', desc: 'Alerts for approaching deadlines' },
                { key: 'questionActivity', label: 'Question Activity', desc: 'When someone answers your questions' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
                  />
                </div>
              ))}
            </div>
          </Card>
        </RevealUp>

        {/* Privacy */}
        <RevealUp delay={0.15}>
          <Card className="p-6">
            <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Privacy
            </h3>
            <div className="space-y-4">
              {[
                { key: 'profilePublic', label: 'Public Profile', desc: 'Allow other students to view your profile' },
                { key: 'showEmail', label: 'Show Email', desc: 'Display your email on your profile' },
                { key: 'showContact', label: 'Show Contact Info', desc: 'Show contact information on lost & found' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      {item.label}
                    </div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <Switch
                    checked={privacy[item.key as keyof typeof privacy]}
                    onCheckedChange={(v) => setPrivacy({ ...privacy, [item.key]: v })}
                  />
                </div>
              ))}
            </div>
          </Card>
        </RevealUp>

        {/* Sign Out */}
        <RevealUp delay={0.2}>
          <Card className="p-6 border-destructive/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">Sign Out</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {isDemoMode ? 'Exit demo mode and return to the landing page' : 'Sign out of your UniSphere account'}
                </p>
              </div>
              <Button variant="destructive" className="rounded-full gap-2" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </Card>
        </RevealUp>

        <Separator />

        <p className="text-center text-xs text-muted-foreground/60 pb-4">
          UniSphere is an unofficial student platform. Not affiliated with any university.
        </p>
      </div>
    </AppShell>
  );
}

'use client';

import { AdminLayout } from '@/components/layout/admin-layout';
import { PageHeader } from '@/components/layout/page-header';
import { RevealUp } from '@/components/animation/animation-utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Megaphone, Plus, Pin, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { demoAnnouncements, formatRelativeTime } from '@/lib/demo-data';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(demoAnnouncements);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [pinned, setPinned] = useState(false);

  const handleCreate = () => {
    if (!title.trim() || !body.trim()) return;
    setAnnouncements([
      { id: `a${Date.now()}`, title, body, is_pinned: pinned, created_at: new Date().toISOString() },
      ...announcements,
    ]);
    setTitle(''); setBody(''); setPinned(false);
  };

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="Announcements" description="Create and manage campus-wide announcements" />

        {/* Create form */}
        <RevealUp>
          <Card className="p-6">
            <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> New Announcement
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ann-title">Title</Label>
                <Input id="ann-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Announcement title..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ann-body">Content</Label>
                <Textarea id="ann-body" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write the announcement content..." rows={3} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={pinned} onCheckedChange={setPinned} id="pin" />
                <Label htmlFor="pin" className="text-sm">Pin this announcement</Label>
              </div>
              <Button onClick={handleCreate} className="rounded-full" disabled={!title.trim() || !body.trim()}>
                Publish Announcement
              </Button>
            </div>
          </Card>
        </RevealUp>

        {/* Announcements list */}
        <div className="space-y-3">
          <AnimatePresence>
            {announcements.map((ann, i) => (
              <motion.div key={ann.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
                <RevealUp delay={Math.min(i * 0.05, 0.2)}>
                  <Card className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {ann.is_pinned && <Pin className="h-3.5 w-3.5 text-primary" />}
                          <h4 className="font-medium text-sm">{ann.title}</h4>
                          {ann.is_pinned && <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">Pinned</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{ann.body}</p>
                        <p className="text-xs text-muted-foreground/60 mt-2">{formatRelativeTime(ann.created_at)}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0" onClick={() => handleDelete(ann.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </RevealUp>
              </motion.div>
            ))}
          </AnimatePresence>
          {announcements.length === 0 && (
            <Card className="p-8 text-center">
              <Megaphone className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No announcements yet. Create one above.</p>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

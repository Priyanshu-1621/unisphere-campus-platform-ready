'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { AppShell } from '@/components/layout/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { RevealUp } from '@/components/animation/animation-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const branches = ['CSE', 'ECE', 'IT', 'EE', 'ME', 'CE', 'CHE', 'ALL'];
const resourceTypes = [
  { value: 'notes', label: 'Notes' },
  { value: 'previous_year_paper', label: 'Previous Year Paper' },
  { value: 'assignment', label: 'Assignment' },
  { value: 'lab_material', label: 'Lab Material' },
  { value: 'study_resource', label: 'Study Resource' },
  { value: 'senior_notes', label: 'Senior Notes' },
  { value: 'topper_notes', label: 'Topper Notes' },
];

export default function UploadPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    subject: '',
    unit: '',
    semester: '',
    branch: '',
    resource_type: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto py-20 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">Resource Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Your resource is now <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">Under Review</Badge>.
              A moderator will verify it shortly. You'll be notified when the status changes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => router.push('/academics')} className="rounded-full">View Academic Hub</Button>
              <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ title: '', description: '', subject: '', unit: '', semester: '', branch: '', resource_type: '' }); }} className="rounded-full">
                Upload Another
              </Button>
            </div>
          </motion.div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <PageHeader
          title="Upload Resource"
          description="Share academic materials with the campus community"
        />

        <RevealUp>
          <Card className="p-4 border-amber-500/20 bg-amber-500/5">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
              <span className="text-muted-foreground">
                Uploaded resources start as <strong>Under Review</strong>. Verified resources receive a Verified Resource badge.
              </span>
            </div>
          </Card>
        </RevealUp>

        <RevealUp delay={0.05}>
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File drop zone */}
              <div className="space-y-2">
                <Label>File</Label>
                <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, PPTX, images up to 25MB</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Data Structures — Complete Notes (Unit 1-5)"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Briefly describe what this resource covers..."
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="e.g. Operating Systems"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    placeholder="e.g. Unit 3 or All Units"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select value={form.semester} onValueChange={(v) => setForm({ ...form, semester: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => <SelectItem key={s} value={String(s)}>Sem {s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Branch</Label>
                  <Select value={form.branch} onValueChange={(v) => setForm({ ...form, branch: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {branches.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Resource Type</Label>
                  <Select value={form.resource_type} onValueChange={(v) => setForm({ ...form, resource_type: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {resourceTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 rounded-full" size="lg">
                <Upload className="h-4 w-4 mr-1" />
                Upload Resource
              </Button>
            </form>
          </Card>
        </RevealUp>
      </div>
    </AppShell>
  );
}

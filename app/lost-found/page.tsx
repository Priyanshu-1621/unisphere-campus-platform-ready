'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PackageSearch, Plus, MapPin, Calendar, Phone, CheckCircle2 } from 'lucide-react';
import { AppShell } from '@/components/layout/navigation';
import { PageHeader, FilterBar } from '@/components/layout/page-header';
import { RevealUp } from '@/components/animation/animation-utils';
import { EmptyState } from '@/components/shared/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { demoLostFound, formatRelativeTime } from '@/lib/demo-data';

const typeFilters = [
  { value: 'all', label: 'All' },
  { value: 'lost', label: 'Lost' },
  { value: 'found', label: 'Found' },
];

const statusFilters = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'resolved', label: 'Resolved' },
];

export default function LostFoundPage() {
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return demoLostFound.filter((item) => {
      if (type !== 'all' && item.type !== type) return false;
      if (status !== 'all' && item.status !== status) return false;
      if (q && !item.title.toLowerCase().includes(q) && !item.description.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [type, status, search]);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <PageHeader
          title="Lost & Found"
          description="Report lost items or help return found ones"
          actions={
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2 rounded-full">
                  <Plus className="h-4 w-4" />
                  Report Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Report Lost or Found Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select defaultValue="lost">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lost">Lost Item</SelectItem>
                        <SelectItem value="found">Found Item</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lf-title">Title</Label>
                    <Input id="lf-title" placeholder="e.g. Black wallet near library" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lf-desc">Description</Label>
                    <Textarea id="lf-desc" placeholder="Describe the item in detail..." rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="lf-loc">Location</Label>
                      <Input id="lf-loc" placeholder="Where?" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lf-date">Date</Label>
                      <Input id="lf-date" type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lf-contact">Contact Information</Label>
                    <Input id="lf-contact" placeholder="How to reach you" />
                  </div>
                  <Button className="w-full rounded-full">Submit Report</Button>
                </div>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="relative max-w-md">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterBar filters={typeFilters} active={type} onChange={setType} className="lf-type" />
          <FilterBar filters={statusFilters} active={status} onChange={setStatus} className="lf-status" />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<PackageSearch className="h-10 w-10" />}
            title="No items found"
            description="Try adjusting your filters or report a new lost/found item."
          />
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((item, i) => (
              <RevealUp key={item.id} delay={Math.min(i * 0.04, 0.24)}>
                <Card className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className={item.type === 'lost' ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-accent/10 text-accent border-accent/20'}>
                        {item.type === 'lost' ? 'Lost' : 'Found'}
                      </Badge>
                      <Badge variant={item.status === 'open' ? 'secondary' : 'outline'} className={item.status === 'resolved' ? 'text-accent' : ''}>
                        {item.status === 'resolved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {item.status === 'open' ? 'Open' : 'Resolved'}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="text-xs">{item.category}</Badge>
                  </div>

                  <h3 className="font-display text-base font-semibold line-clamp-1">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.description}</p>

                  <div className="mt-4 space-y-1.5 border-t border-border/40 pt-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {item.location}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" /> {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" /> {item.contact_info}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground/60">
                    Posted {formatRelativeTime(item.created_at)}
                  </div>
                </Card>
              </RevealUp>
            ))}
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}

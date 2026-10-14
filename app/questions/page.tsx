'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquarePlus, MessageCircleQuestion } from 'lucide-react';
import { AppShell } from '@/components/layout/navigation';
import { PageHeader, FilterBar } from '@/components/layout/page-header';
import { RevealUp } from '@/components/animation/animation-utils';
import { QuestionCard } from '@/components/cards/question-card';
import { EmptyState } from '@/components/shared/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { demoQuestions } from '@/lib/demo-data';
import { useQuestions, isSupabaseConfigured } from '@/lib/hooks/use-supabase-data';

const categoryFilters = [
  { value: 'all', label: 'All' },
  { value: 'Academic', label: 'Academic' },
  { value: 'Clubs', label: 'Clubs' },
  { value: 'Study Resources', label: 'Study Resources' },
  { value: 'College Life', label: 'College Life' },
  { value: 'General Guidance', label: 'General Guidance' },
];

export default function QuestionsPage() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  const questionsQuery = useQuestions();
  const allQuestions = isSupabaseConfigured && questionsQuery.data.length > 0 ? questionsQuery.data : demoQuestions;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allQuestions.filter((question) => {
      if (category !== 'all' && question.category !== category) return false;
      if (q && !question.title.toLowerCase().includes(q) && !question.body.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [category, search, allQuestions]);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <PageHeader
          title="Ask Seniors"
          description="Get guidance from students who've been there"
          actions={
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2 rounded-full">
                  <MessageSquarePlus className="h-4 w-4" />
                  Ask Question
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Ask a Question</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="q-title">Question Title</Label>
                    <Input id="q-title" placeholder="e.g. How to prepare for OS end-sem?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="q-category">Category</Label>
                    <Select defaultValue="Academic">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categoryFilters.filter((f) => f.value !== 'all').map((f) => (
                          <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="q-body">Details</Label>
                    <Textarea id="q-body" placeholder="Provide more context about your question..." rows={4} />
                  </div>
                  <Button className="w-full rounded-full">Post Question</Button>
                </div>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="relative max-w-md">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
          />
        </div>

        <FilterBar
          filters={categoryFilters}
          active={category}
          onChange={setCategory}
          className="questions-page"
        />

        {filtered.length === 0 ? (
          <EmptyState
            icon={<MessageCircleQuestion className="h-10 w-10" />}
            title="No questions found"
            description="Be the first to ask a question in this category!"
          />
        ) : (
          <motion.div layout className="space-y-3">
            {filtered.map((question, i) => (
              <RevealUp key={question.id} delay={Math.min(i * 0.04, 0.24)}>
                <QuestionCard question={question} index={i} />
              </RevealUp>
            ))}
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, FileText, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { AppShell } from '@/components/layout/navigation';
import { PageHeader, FilterBar } from '@/components/layout/page-header';
import { RevealUp, Countdown } from '@/components/animation/animation-utils';
import { EmptyState } from '@/components/shared/states';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { demoExams, getDaysUntil } from '@/lib/demo-data';

const examTypeFilters = [
  { value: 'all', label: 'All' },
  { value: 'internal', label: 'Internal' },
  { value: 'mid_sem', label: 'Mid-Sem' },
  { value: 'practical', label: 'Practical' },
  { value: 'semester', label: 'End-Sem' },
];

const examTypeLabels: Record<string, string> = {
  internal: 'Internal Assessment',
  mid_sem: 'Mid-Semester',
  practical: 'Practical Exam',
  semester: 'End-Semester',
};

export default function ExamsPage() {
  const [examType, setExamType] = useState('all');

  const filtered = useMemo(() => {
    return demoExams.filter((e) => examType === 'all' || e.exam_type === examType);
  }, [examType]);

  const upcoming = filtered.filter((e) => getDaysUntil(e.exam_date) >= 0).sort((a, b) => getDaysUntil(a.exam_date) - getDaysUntil(b.exam_date));
  const nextExam = upcoming[0];

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <PageHeader
          title="Exam Center"
          description="Exam dates, syllabus, instructions, and countdowns"
        />

        {/* Unofficial notice */}
        <RevealUp>
          <Card className="p-4 border-amber-500/20 bg-amber-500/5">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
              <span className="text-muted-foreground">
                Exam information is marked as <strong>Verified</strong> or <strong>Student-Submitted</strong>. Always confirm with official sources.
              </span>
            </div>
          </Card>
        </RevealUp>

        {/* Next Exam Countdown */}
        {nextExam && (
          <RevealUp>
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 grid-pattern opacity-10" />
              <div className="relative p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <Badge className="bg-destructive/10 text-destructive border-destructive/20 gap-1 mb-3">
                    <Clock className="h-3 w-3" /> Next Exam
                  </Badge>
                  <h3 className="font-display text-xl font-bold">{nextExam.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(nextExam.exam_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
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

        <FilterBar
          filters={examTypeFilters}
          active={examType}
          onChange={setExamType}
          className="exams-page"
        />

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Calendar className="h-10 w-10" />}
            title="No exams found"
            description="Try a different exam type filter."
          />
        ) : (
          <div className="space-y-4">
            {upcoming.map((exam, i) => {
              const days = getDaysUntil(exam.exam_date);
              const isUrgent = days >= 0 && days <= 7;
              return (
                <RevealUp key={exam.id} delay={Math.min(i * 0.05, 0.3)}>
                  <Card className="p-5 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Date block */}
                      <div className="flex flex-col items-center justify-center px-4 py-3 rounded-xl bg-muted/30 border border-border/40 min-w-[80px]">
                        <span className="text-xs font-medium text-muted-foreground uppercase">
                          {new Date(exam.exam_date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="font-display text-2xl font-bold leading-none mt-1">
                          {new Date(exam.exam_date).getDate()}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <Badge variant="secondary">{examTypeLabels[exam.exam_type]}</Badge>
                          <Badge variant="outline">Sem {exam.semester}</Badge>
                          <Badge variant="outline">{exam.branch}</Badge>
                          {exam.is_verified ? (
                            <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Verified
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">Student-Submitted</Badge>
                          )}
                        </div>

                        <h3 className="font-display text-lg font-semibold">{exam.title}</h3>

                        {exam.syllabus && (
                          <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                            <FileText className="h-4 w-4 mt-0.5 shrink-0" />
                            <span><strong className="text-foreground">Syllabus:</strong> {exam.syllabus}</span>
                          </div>
                        )}
                        {exam.instructions && (
                          <div className="mt-1.5 flex items-start gap-2 text-sm text-muted-foreground">
                            <Info className="h-4 w-4 mt-0.5 shrink-0" />
                            <span><strong className="text-foreground">Instructions:</strong> {exam.instructions}</span>
                          </div>
                        )}

                        <div className="mt-3">
                          <Badge className={isUrgent ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-muted text-muted-foreground border-border'}>
                            {days < 0 ? 'Completed' : days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                </RevealUp>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}

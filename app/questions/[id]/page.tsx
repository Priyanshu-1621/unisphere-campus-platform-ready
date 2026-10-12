'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowBigUp, Flag, MessageCircle, Send } from 'lucide-react';
import { AppShell } from '@/components/layout/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { demoQuestions, formatRelativeTime } from '@/lib/demo-data';

const demoAnswers = [
  { id: 'a1', author_name: 'Sneha Iyer', body: 'Focus on SQL queries — joins, subqueries, and normalization. The practical exam usually covers these. Practice writing queries by hand without an IDE.', upvotes: 15, is_helpful: true, created_at: '2024-09-28T16:00:00Z' },
  { id: 'a2', author_name: 'Karthik Nair', body: 'Also practice ER diagram design. Last year we had to design a database for a library management system. Make sure you know primary keys, foreign keys, and 3NF.', upvotes: 8, is_helpful: false, created_at: '2024-09-28T18:00:00Z' },
  { id: 'a3', author_name: 'Priya Reddy', body: 'Go through the lab manual thoroughly. Most of the practical exam questions come directly from the exercises in the manual. Don\'t skip any exercise.', upvotes: 5, is_helpful: false, created_at: '2024-09-29T10:00:00Z' },
];

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const question = demoQuestions.find((q) => q.id === id);
  const [upvoted, setUpvoted] = useState(question?.has_upvoted ?? false);
  const [upvotes, setUpvotes] = useState(question?.upvotes ?? 0);
  const [answerText, setAnswerText] = useState('');
  const [answers, setAnswers] = useState(demoAnswers);

  if (!question) return notFound();

  const handleUpvote = () => {
    setUpvoted(!upvoted);
    setUpvotes(upvoted ? upvotes - 1 : upvotes + 1);
  };

  const handleSubmitAnswer = () => {
    if (!answerText.trim()) return;
    setAnswers([...answers, {
      id: `a${Date.now()}`,
      author_name: 'You',
      body: answerText,
      upvotes: 0,
      is_helpful: false,
      created_at: new Date().toISOString(),
    }]);
    setAnswerText('');
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Link href="/questions" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Questions
        </Link>

        {/* Question */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6">
            <div className="flex gap-4">
              <button
                onClick={handleUpvote}
                className="flex flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-2 border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all shrink-0"
              >
                <ArrowBigUp className={`h-6 w-6 ${upvoted ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
                <span className={`text-sm font-semibold ${upvoted ? 'text-primary' : 'text-muted-foreground'}`}>{upvotes}</span>
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{question.category}</Badge>
                  <span className="text-xs text-muted-foreground">{formatRelativeTime(question.created_at)}</span>
                </div>
                <h1 className="font-display text-xl font-bold">{question.title}</h1>
                <p className="mt-3 text-muted-foreground leading-relaxed">{question.body}</p>

                <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                  <span className="text-sm text-muted-foreground">by <strong className="text-foreground">{question.author_name}</strong></span>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive gap-1">
                    <Flag className="h-3.5 w-3.5" /> Report
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Answers Header */}
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-semibold">{answers.length} Answers</h2>
        </div>

        {/* Answer Form */}
        <Card className="p-4">
          <Textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Write your answer..."
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <Button onClick={handleSubmitAnswer} disabled={!answerText.trim()} className="rounded-full gap-2" size="sm">
              <Send className="h-3.5 w-3.5" /> Post Answer
            </Button>
          </div>
        </Card>

        {/* Answers List */}
        <div className="space-y-3">
          {answers.map((answer, i) => (
            <motion.div
              key={answer.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.2) }}
            >
              <Card className="p-5">
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-medium">
                      {answer.author_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{answer.author_name}</span>
                      {answer.is_helpful && <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">Helpful</Badge>}
                      <span className="text-xs text-muted-foreground">{formatRelativeTime(answer.created_at)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{answer.body}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                        <ArrowBigUp className="h-3.5 w-3.5" /> {answer.upvotes}
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

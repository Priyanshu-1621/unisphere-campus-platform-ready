'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowBigUp, Flag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/lib/demo-data';
import { useState } from 'react';
import type { Question } from '@/types';

export function QuestionCard({ question, index = 0 }: { question: Question; index?: number }) {
  const [upvoted, setUpvoted] = useState(question.has_upvoted);
  const [upvotes, setUpvotes] = useState(question.upvotes);

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUpvoted(!upvoted);
    setUpvotes(upvoted ? upvotes - 1 : upvotes + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link href={`/questions/${question.id}`}>
        <Card className="group hover:border-border transition-all duration-300 hover:shadow-md cursor-pointer">
          <div className="p-5">
            <div className="flex gap-4">
              <button
                onClick={handleUpvote}
                className="flex flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-1 border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all shrink-0"
                aria-label="Upvote"
              >
                <ArrowBigUp className={`h-5 w-5 ${upvoted ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
                <span className={`text-xs font-semibold tabular-nums ${upvoted ? 'text-primary' : 'text-muted-foreground'}`}>
                  {upvotes}
                </span>
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">{question.category}</Badge>
                  <span className="text-xs text-muted-foreground">{formatRelativeTime(question.created_at)}</span>
                </div>
                <h3 className="font-display text-base font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {question.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{question.body}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {question.answers_count} answers
                    </span>
                    <span>by {question.author_name}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" aria-label="Report">
                    <Flag className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

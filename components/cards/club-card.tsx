'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Club } from '@/types';

export function ClubCard({ club, index = 0 }: { club: Club; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link href={`/clubs/${club.id}`}>
        <Card className="group relative overflow-hidden border-border/60 hover:border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer h-full">
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border/40 font-display text-xl font-bold text-primary">
                {club.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-base font-semibold leading-snug group-hover:text-primary transition-colors">
                  {club.name}
                </h3>
                <Badge variant="secondary" className="mt-1 text-xs">{club.category}</Badge>
              </div>
            </div>

            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{club.description}</p>

            <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> {club.member_count} members
                </span>
              </div>
              {club.recruitment_open ? (
                <Badge className="bg-accent/10 text-accent border-accent/20 gap-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  Recruiting
                </Badge>
              ) : (
                <Badge variant="secondary">Closed</Badge>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

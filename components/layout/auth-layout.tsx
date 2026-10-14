'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

const SpatialScene = dynamic(() => import('@/components/3d/spatial-scene').then((m) => m.SpatialScene), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-b from-background to-surface-1" />,
});

export function AuthBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <SpatialScene className="absolute inset-0 opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background" />
      <div className="absolute inset-0 grid-pattern opacity-15" />
    </div>
  );
}

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md"
    >
      <div className="relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl shadow-primary/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="relative p-8">
          <Link href="/" className="flex items-center gap-2 mb-6 group">
            <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-display text-sm font-bold text-primary-foreground transition-transform group-hover:scale-105">
              U
            </div>
            <span className="font-display text-lg font-bold tracking-tight">UniSphere</span>
          </Link>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

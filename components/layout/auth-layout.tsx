'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const SpatialScene = dynamic(() => import('@/components/3d/spatial-scene').then((m) => m.SpatialScene), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-b from-background to-surface-1" />,
});

export function AuthBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <SpatialScene className="absolute inset-0 opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
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
      <div className="relative rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl shadow-primary/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="relative p-8">{children}</div>
      </div>
    </motion.div>
  );
}

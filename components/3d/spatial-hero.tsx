'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const SpatialScene = dynamic(() => import('@/components/3d/spatial-scene').then((m) => m.SpatialScene), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />,
});

export function SpatialHero() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden flex items-center justify-center">
      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-0">
        <SpatialScene className="absolute inset-0" />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/40 via-background/20 to-background pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-background/60 via-transparent to-background/60 pointer-events-none" />

      {/* Grid pattern */}
      <div className="absolute inset-0 z-[5] grid-pattern opacity-30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 backdrop-blur-md px-4 py-1.5 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-xs font-medium text-muted-foreground tracking-wide">
            Unofficial Student Platform
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-balance"
        >
          Your campus,
          <br />
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            connected.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed"
        >
          UniSphere brings academics, events, clubs, resources, opportunities, and student knowledge
          into one premium digital campus experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/home">
            <Button size="lg" className="h-12 px-8 text-base rounded-full group">
              Enter UniSphere
              <ChevronDown className="ml-1 h-4 w-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/campus">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full">
              Explore Campus
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

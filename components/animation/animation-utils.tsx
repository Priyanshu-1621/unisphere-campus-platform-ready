'use client';

import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 1.5,
  className = '',
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration, ease: [0.16, 1, 0.3, 1] });
      return controls.stop;
    }
  }, [isInView, value, count, duration]);

  useEffect(() => {
    return rounded.on('change', (v) => {
      if (ref.current) ref.current.textContent = `${prefix}${v}${suffix}`;
    });
  }, [rounded, prefix, suffix]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      {prefix}0{suffix}
    </motion.span>
  );
}

export function Countdown({ targetDate, className = '' }: { targetDate: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    let raf: number;

    const update = () => {
      if (!ref.current) return;
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        ref.current.innerHTML = '<span class="text-destructive font-medium">Past due</span>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      ref.current.innerHTML = `
        <div class="flex items-center gap-2">
          <div class="text-center">
            <div class="text-2xl font-bold font-display tabular-nums">${days}</div>
            <div class="text-[10px] text-muted-foreground uppercase tracking-wider">days</div>
          </div>
          <span class="text-muted-foreground/40 text-xl">:</span>
          <div class="text-center">
            <div class="text-2xl font-bold font-display tabular-nums">${hours}</div>
            <div class="text-[10px] text-muted-foreground uppercase tracking-wider">hours</div>
          </div>
          <span class="text-muted-foreground/40 text-xl">:</span>
          <div class="text-center">
            <div class="text-2xl font-bold font-display tabular-nums">${mins}</div>
            <div class="text-[10px] text-muted-foreground uppercase tracking-wider">mins</div>
          </div>
        </div>
      `;
      raf = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(raf);
  }, [targetDate]);

  return <div ref={ref} className={className} />;
}

export function RevealUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function useGreeting() {
  const [greeting, setGreeting] = useState('Good afternoon');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return greeting;
}

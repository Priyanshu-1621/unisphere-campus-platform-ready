'use client';

import { SpatialHero } from '@/components/3d/spatial-hero';
import { RevealUp, AnimatedCounter } from '@/components/animation/animation-utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Calendar,
  Users,
  Briefcase,
  MapPin,
  HelpCircle,
  Search,
  Bookmark,
  ShieldCheck,
  Bell,
  Upload,
  Sparkles,
  ArrowRight,
  PackageSearch,
  GraduationCap,
  Building2,
} from 'lucide-react';

const features = [
  { icon: BookOpen, title: 'Academics', desc: 'Subject-wise notes, previous year papers, lab manuals, and topper resources — all in one hub.', href: '/academics' },
  { icon: Calendar, title: 'Events', desc: 'Workshops, hackathons, seminars, and campus events. Never miss what\'s happening.', href: '/events' },
  { icon: Users, title: 'Clubs', desc: 'Discover clubs, their teams, projects, and recruitment status. Find your community.', href: '/clubs' },
  { icon: Briefcase, title: 'Opportunities', desc: 'Internships, scholarships, certifications, and competitions curated for students.', href: '/opportunities' },
  { icon: MapPin, title: 'Campus Guide', desc: 'Interactive campus map to find academic blocks, labs, library, cafeteria, and more.', href: '/campus' },
  { icon: HelpCircle, title: 'Ask Seniors', desc: 'Q&A platform for academic, club, and college-life guidance from senior students.', href: '/questions' },
];

const stats = [
  { value: 1200, suffix: '+', label: 'Resources' },
  { value: 85, suffix: '+', label: 'Events' },
  { value: 30, suffix: '+', label: 'Clubs' },
  { value: 5000, suffix: '+', label: 'Students' },
];

export default function LandingPage() {
  return (
    <div className="relative">
      <SpatialHero />

      {/* Stats Bar */}
      <section className="relative border-y border-border/40 bg-surface-1/50">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <RevealUp key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    className="font-display text-3xl sm:text-4xl font-bold text-primary"
                  />
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </RevealUp>
            ))}
          </div>
        </div>
      </section>

      {/* Your Campus */}
      <Section
        id="campus"
        eyebrow="Your Campus"
        title="One platform for everything campus."
        description="UniSphere connects academic resources, events, clubs, opportunities, campus discovery, and student knowledge into a single premium experience — designed by students, for students."
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <RevealUp key={feature.title} delay={i * 0.08}>
                <Link href={feature.href}>
                  <div className="group relative rounded-2xl border border-border/60 bg-card p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 h-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-500" />
                    <div className="relative">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/12 to-accent/12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                      <ArrowRight className="absolute -top-1 right-0 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              </RevealUp>
            );
          })}
        </div>
      </Section>

      {/* Academics */}
      <FeatureSection
        eyebrow="Academics"
        title="Every resource you need, organized."
        description="Subject-wise notes, unit-wise breakdowns, previous year papers, assignments, lab material, senior notes, and topper notes — contributed by students, verified by moderators."
        features={['Subject & unit filtering', 'Branch & semester sorting', 'Verification badges', 'Contributor credit system']}
        icon={BookOpen}
        href="/academics"
        hrefLabel="Explore Academics"
      />

      {/* Events */}
      <FeatureSection
        eyebrow="Events"
        title="Never miss what's happening."
        description="Workshops, hackathons, competitions, seminars, and campus events — all in one feed with countdowns, registration links, and save-for-later."
        features={['Category filtering', 'Event countdowns', 'Registration links', 'Save & bookmark events']}
        icon={Calendar}
        href="/events"
        hrefLabel="Browse Events"
        reverse
      />

      {/* Clubs */}
      <FeatureSection
        eyebrow="Clubs"
        title="Find your people."
        description="Each club gets its own digital space — about, core team, events, projects, gallery, and recruitment status. Discover where you belong."
        features={['Club detail pages', 'Recruitment status', 'Core team & projects', 'Gallery & events']}
        icon={Users}
        href="/clubs"
        hrefLabel="Discover Clubs"
      />

      {/* Opportunities */}
      <FeatureSection
        eyebrow="Opportunities"
        title="Your next big break starts here."
        description="Internships, scholarships, hackathons, certifications, competitions, and club recruitment — sorted by deadline so you never miss out."
        features={['Deadline sorting', 'Category filters', 'Eligibility info', 'Direct application links']}
        icon={Briefcase}
        href="/opportunities"
        hrefLabel="View Opportunities"
        reverse
      />

      {/* Student Knowledge */}
      <Section
        id="knowledge"
        eyebrow="Student Knowledge"
        title="Wisdom from those who walked before you."
        description="Ask seniors questions, browse answered discussions, and contribute your own knowledge to the campus community."
      >
        <div className="grid md:grid-cols-2 gap-5 mt-12">
          <RevealUp>
            <div className="group relative rounded-2xl border border-border/60 bg-card p-6 h-full overflow-hidden hover:border-primary/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <HelpCircle className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-display text-lg font-semibold mb-2">Ask Seniors</h3>
                <p className="text-sm text-muted-foreground">
                  A Q&A platform for academic questions, club advice, college-life guidance, and study resources.
                  Upvote helpful answers, report spam, and find the best student-generated knowledge.
                </p>
              </div>
            </div>
          </RevealUp>
          <RevealUp delay={0.1}>
            <div className="group relative rounded-2xl border border-border/60 bg-card p-6 h-full overflow-hidden hover:border-primary/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <Search className="h-8 w-8 text-accent mb-4" />
                <h3 className="font-display text-lg font-semibold mb-2">Smart Search</h3>
                <p className="text-sm text-muted-foreground">
                  Search across resources, events, clubs, opportunities, exams, campus locations, questions,
                  and lost & found — all from one search bar with suggestions and category filters.
                </p>
              </div>
            </div>
          </RevealUp>
        </div>
      </Section>

      {/* Campus Guide preview */}
      <FeatureSection
        eyebrow="Campus Guide"
        title="Explore your campus, digitally."
        description="An interactive campus map showing academic blocks, labs, library, cafeteria, auditorium, sports areas, and club locations — with search and category filters."
        features={['Interactive campus map', 'Location search', 'Category filters', 'Room & floor details']}
        icon={MapPin}
        href="/campus"
        hrefLabel="Explore Campus"
      />

      {/* Trust & Safety */}
      <Section
        id="trust"
        eyebrow="Trust & Safety"
        title="Built with trust at the core."
        description="UniSphere is an unofficial student platform. Content is clearly labeled by source — Campus Update, Student Update, Club Update, Verified Resource, or Community Information."
      >
        <div className="grid sm:grid-cols-3 gap-5 mt-12">
          {[
            { icon: ShieldCheck, title: 'Verified Resources', desc: 'Resources reviewed and verified by moderators before receiving the Verified badge.' },
            { icon: Bookmark, title: 'Save Anything', desc: 'Bookmark resources, events, and opportunities to revisit them later on your dashboard.' },
            { icon: Bell, title: 'Smart Notifications', desc: 'Get reminders for exams, events, opportunity deadlines, and resource verification updates.' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <RevealUp key={item.title} delay={i * 0.1}>
                <div className="group relative rounded-2xl border border-border/60 bg-card p-6 h-full hover:border-primary/30 transition-colors">
                  <Icon className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-display text-base font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </RevealUp>
            );
          })}
        </div>
      </Section>

      {/* CTA */}
      <section id="enter" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <RevealUp>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-1.5 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Ready to explore?</span>
            </div>
          </RevealUp>
          <RevealUp delay={0.1}>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-balance">
              Enter UniSphere.
            </h2>
          </RevealUp>
          <RevealUp delay={0.2}>
            <p className="mt-6 text-lg text-muted-foreground text-pretty max-w-xl mx-auto">
              Join the digital campus ecosystem built for students. Your academics, events, clubs,
              opportunities, and campus knowledge — all in one place.
            </p>
          </RevealUp>
          <RevealUp delay={0.3}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="h-12 px-8 text-base rounded-full group">
                  Enter UniSphere
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full">
                  Create Account
                </Button>
              </Link>
            </div>
          </RevealUp>
          <RevealUp delay={0.4}>
            <p className="mt-8 text-xs text-muted-foreground/60">
              UniSphere is an unofficial student platform. Not affiliated with any university.
            </p>
          </RevealUp>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center font-display text-xs font-bold text-primary-foreground">
                U
              </div>
              <span className="font-display text-base font-bold">UniSphere</span>
            </div>
            <p className="text-xs text-muted-foreground text-center md:text-right">
              An unofficial student-focused digital campus platform. <br className="hidden sm:inline" />
              Not affiliated with any university. Built by students, for students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <RevealUp>
          <span className="text-sm font-semibold text-primary tracking-wide uppercase">{eyebrow}</span>
        </RevealUp>
        <RevealUp delay={0.05}>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl font-bold tracking-tight text-balance max-w-3xl">
            {title}
          </h2>
        </RevealUp>
        <RevealUp delay={0.1}>
          <p className="mt-4 text-lg text-muted-foreground text-pretty max-w-2xl">{description}</p>
        </RevealUp>
        {children}
      </div>
    </section>
  );
}

function FeatureSection({
  eyebrow,
  title,
  description,
  features,
  icon: Icon,
  href,
  hrefLabel,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  features: string[];
  icon: typeof BookOpen;
  href: string;
  hrefLabel: string;
  reverse?: boolean;
}) {
  return (
    <section className="relative py-24 md:py-32 surface-1/30">
      <div className="max-w-5xl mx-auto px-6">
        <div className={`grid md:grid-cols-2 gap-12 items-center ${reverse ? 'md:grid-flow-dense' : ''}`}>
          <div className={reverse ? 'md:col-start-2' : ''}>
            <RevealUp>
              <span className="text-sm font-semibold text-primary tracking-wide uppercase">{eyebrow}</span>
            </RevealUp>
            <RevealUp delay={0.05}>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-balance">
                {title}
              </h2>
            </RevealUp>
            <RevealUp delay={0.1}>
              <p className="mt-4 text-muted-foreground text-pretty">{description}</p>
            </RevealUp>
            <RevealUp delay={0.15}>
              <ul className="mt-6 space-y-2">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </RevealUp>
            <RevealUp delay={0.2}>
              <Link href={href} className="mt-8 inline-flex">
                <Button variant="outline" className="rounded-full group">
                  {hrefLabel}
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </RevealUp>
          </div>
          <RevealUp delay={0.1} className={reverse ? 'md:col-start-1 md:row-start-1' : ''}>
            <div className="relative aspect-square max-w-sm mx-auto rounded-3xl border border-border/40 bg-card overflow-hidden group">
              <div className="absolute inset-0 grid-pattern opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/15 group-hover:to-accent/15 transition-all duration-500" />
              <div className="relative h-full flex items-center justify-center">
                <Icon className="h-24 w-24 text-primary/30 group-hover:scale-110 group-hover:text-primary/40 transition-all duration-500" />
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="rounded-xl border border-border/60 bg-card/80 backdrop-blur-md p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{eyebrow}</div>
                      <div className="text-xs text-muted-foreground">Explore now</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealUp>
        </div>
      </div>
    </section>
  );
}

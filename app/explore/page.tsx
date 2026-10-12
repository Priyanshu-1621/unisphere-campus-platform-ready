'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Briefcase, MapPin, HelpCircle, PackageSearch, Compass, ArrowRight } from 'lucide-react';
import { AppShell } from '@/components/layout/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { RevealUp } from '@/components/animation/animation-utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { demoClubs, demoOpportunities, demoLocations, demoQuestions, demoLostFound } from '@/lib/demo-data';

const exploreItems = [
  { title: 'Clubs', description: 'Discover student communities and organizations', icon: Users, href: '/clubs', count: demoClubs.length, color: 'from-purple-500/15 to-purple-500/5', iconColor: 'text-purple-500' },
  { title: 'Opportunities', description: 'Internships, scholarships, and competitions', icon: Briefcase, href: '/opportunities', count: demoOpportunities.length, color: 'from-amber-500/15 to-amber-500/5', iconColor: 'text-amber-500' },
  { title: 'Campus Guide', description: 'Interactive map of your campus', icon: MapPin, href: '/campus', count: demoLocations.length, color: 'from-teal-500/15 to-teal-500/5', iconColor: 'text-teal-500' },
  { title: 'Ask Seniors', description: 'Q&A platform for student guidance', icon: HelpCircle, href: '/questions', count: demoQuestions.length, color: 'from-pink-500/15 to-pink-500/5', iconColor: 'text-pink-500' },
  { title: 'Lost & Found', description: 'Report and find lost items', icon: PackageSearch, href: '/lost-found', count: demoLostFound.length, color: 'from-cyan-500/15 to-cyan-500/5', iconColor: 'text-cyan-500' },
];

export default function ExplorePage() {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <PageHeader
          title="Explore"
          description="Discover everything UniSphere has to offer"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exploreItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <RevealUp key={item.title} delay={i * 0.05}>
                <Link href={item.href}>
                  <motion.div whileHover={{ y: -4 }}>
                    <Card className="group relative overflow-hidden border-border/60 hover:border-border hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer h-full">
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                      <div className="relative p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`h-12 w-12 rounded-xl bg-card/80 border border-border/40 flex items-center justify-center ${item.iconColor}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <Badge variant="secondary">{item.count}</Badge>
                        </div>
                        <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Explore <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Link>
              </RevealUp>
            );
          })}

          {/* Coming Soon card */}
          <RevealUp delay={0.25}>
            <Card className="p-6 h-full flex flex-col items-center justify-center text-center border-dashed">
              <Compass className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">More features coming soon</p>
            </Card>
          </RevealUp>
        </div>
      </div>
    </AppShell>
  );
}

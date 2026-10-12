'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Calendar, MapPin, Target, Award, FolderGit2, Camera } from 'lucide-react';
import { AppShell } from '@/components/layout/navigation';
import { RevealUp } from '@/components/animation/animation-utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { demoClubs } from '@/lib/demo-data';

export default function ClubDetailPage() {
  const { id } = useParams<{ id: string }>();
  const club = demoClubs.find((c) => c.id === id);

  if (!club) return notFound();

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Link href="/clubs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Clubs
        </Link>

        {/* Club Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-10" />
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-primary/10 to-accent/10" />
            <div className="relative p-6">
              <div className="flex items-start gap-6">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border/40 flex items-center justify-center font-display text-3xl font-bold text-primary shrink-0">
                  {club.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="font-display text-2xl font-bold">{club.name}</h1>
                    {club.recruitment_open && (
                      <Badge className="bg-accent/10 text-accent border-accent/20 gap-1">
                        <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" /></span>
                        Recruiting
                      </Badge>
                    )}
                  </div>
                  <Badge variant="secondary">{club.category}</Badge>
                  <p className="mt-3 text-sm text-muted-foreground max-w-xl">{club.description}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {club.member_count} members</span>
                    {club.president && <span className="flex items-center gap-1.5"><Target className="h-4 w-4" /> President: {club.president}</span>}
                    {club.meeting_schedule && <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {club.meeting_schedule}</span>}
                  </div>

                  {club.recruitment_open && (
                    <Button className="mt-4 rounded-full">Join Club</Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Club Tabs */}
        <Tabs defaultValue="about" className="space-y-4">
          <TabsList className="w-full justify-start overflow-x-auto scrollbar-hide">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="team">Core Team</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card className="p-6">
              <h3 className="font-display text-lg font-semibold mb-2">About {club.name}</h3>
              <p className="text-muted-foreground leading-relaxed">{club.description}</p>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {club.president && <div className="flex items-center gap-2 text-sm"><Target className="h-4 w-4 text-muted-foreground" /> <span className="text-muted-foreground">President:</span> {club.president}</div>}
                {club.meeting_schedule && <div className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-muted-foreground" /> <span className="text-muted-foreground">Meetings:</span> {club.meeting_schedule}</div>}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <div className="grid sm:grid-cols-3 gap-3">
              {['Arjun Verma — President', 'Sneha Iyer — Vice President', 'Karthik Nair — Tech Lead'].map((member) => (
                <Card key={member} className="p-4 text-center">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mx-auto mb-3 flex items-center justify-center font-display text-lg font-bold text-primary">
                    {member.charAt(0)}
                  </div>
                  <p className="text-sm font-medium">{member}</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events">
            <Card className="p-6 text-center text-sm text-muted-foreground">Club events will appear here.</Card>
          </TabsContent>

          <TabsContent value="projects">
            <div className="grid sm:grid-cols-2 gap-4">
              {['Campus Navigation App', 'AI Chatbot for Students'].map((project) => (
                <Card key={project} className="p-5">
                  <FolderGit2 className="h-6 w-6 text-primary mb-3" />
                  <h4 className="font-medium">{project}</h4>
                  <p className="text-sm text-muted-foreground mt-1">An ongoing project by {club.name} members.</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gallery">
            <Card className="p-6 text-center">
              <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Gallery photos will appear here once uploaded.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

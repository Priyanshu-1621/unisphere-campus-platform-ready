'use client';

import { AdminLayout } from '@/components/layout/admin-layout';
import { PageHeader } from '@/components/layout/page-header';
import { RevealUp } from '@/components/animation/animation-utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

const users = [
  { id: '1', name: 'Aarav Sharma', email: 'aarav@uni.app', role: 'verified_contributor', verified: true, resources: 24 },
  { id: '2', name: 'Priya Reddy', email: 'priya@uni.app', role: 'verified_contributor', verified: true, resources: 18 },
  { id: '3', name: 'Rohan Mehta', email: 'rohan@uni.app', role: 'student', verified: false, resources: 2 },
  { id: '4', name: 'Sneha Iyer', email: 'sneha@uni.app', role: 'moderator', verified: true, resources: 32 },
  { id: '5', name: 'Karthik Nair', email: 'karthik@uni.app', role: 'verified_contributor', verified: true, resources: 15 },
  { id: '6', name: 'Ananya Gupta', email: 'ananya@uni.app', role: 'student', verified: false, resources: 1 },
  { id: '7', name: 'Dev Patel', email: 'dev@uni.app', role: 'contributor', verified: false, resources: 8 },
  { id: '8', name: 'Meera Nair', email: 'meera@uni.app', role: 'admin', verified: true, resources: 5 },
];

const roleConfig: Record<string, { label: string; className: string }> = {
  student: { label: 'Student', className: 'bg-muted text-muted-foreground border-border' },
  contributor: { label: 'Contributor', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  verified_contributor: { label: 'Verified', className: 'bg-accent/10 text-accent border-accent/20' },
  moderator: { label: 'Moderator', className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  admin: { label: 'Admin', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="Users" description={`${users.length} registered users`} />

        <RevealUp>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/30">
                  <tr>
                    <th className="text-left font-medium px-4 py-3">User</th>
                    <th className="text-left font-medium px-4 py-3 hidden sm:table-cell">Role</th>
                    <th className="text-left font-medium px-4 py-3 hidden md:table-cell">Resources</th>
                    <th className="text-right font-medium px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => {
                    const role = roleConfig[user.role] ?? roleConfig.student;
                    return (
                      <tr key={user.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary text-xs font-medium">
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="font-medium text-sm flex items-center gap-1">
                                {user.name}
                                {user.verified && <CheckCircle2 className="h-3 w-3 text-accent" />}
                              </div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <Badge className={role.className}>{role.label}</Badge>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{user.resources}</td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm" className="rounded-full h-7 text-xs">Manage</Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </RevealUp>
      </div>
    </AdminLayout>
  );
}

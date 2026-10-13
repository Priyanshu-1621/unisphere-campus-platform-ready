'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/components/providers/auth-provider';
import { AuthBackground, AuthCard } from '@/components/layout/auth-layout';

const branches = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Aerospace Engineering',
  'Biotechnology',
  'Other',
];
const courses = ['B.Tech', 'B.E', 'M.Tech', 'BCA', 'MCA', 'B.Sc', 'M.Sc', 'B.Com', 'B.A', 'Other'];

export default function SignupPage() {
  const router = useRouter();
  const { signUp, enterDemoMode } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    branch: '',
    course: '',
    batch: '',
    year: '',
    semester: '',
    section: '',
  });

  const batchYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let y = currentYear - 6; y <= currentYear + 5; y++) {
      years.push(y);
    }
    return years;
  }, []);

  const setField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedSection = form.section.trim();
    if (trimmedSection.length === 0) {
      setError('Please enter your section.');
      return;
    }
    if (trimmedSection.length > 20) {
      setError('Section name must be 20 characters or fewer.');
      return;
    }

    setLoading(true);
    const { error } = await signUp({ ...form, section: trimmedSection });
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      router.push('/home');
    }
  };

  const handleDemo = () => {
    enterDemoMode();
    router.push('/home');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-12">
      <AuthBackground />

      <div className="w-full max-w-lg">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-display text-lg font-bold text-primary-foreground">
            U
          </div>
          <span className="font-display text-2xl font-bold tracking-tight">UniSphere</span>
        </Link>

        <AuthCard>
          <h1 className="font-display text-2xl font-bold text-center">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground text-center">
            Join the UniSphere student community
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="full_name"
                  placeholder="Aarav Sharma"
                  value={form.full_name}
                  onChange={(e) => setField('full_name', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@university.edu"
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setField('password', e.target.value)}
                    className="pl-10 pr-10"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Course</Label>
                <Select value={form.course} onValueChange={(v) => setField('course', v)}>
                  <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Branch</Label>
                <Select value={form.branch} onValueChange={(v) => setField('branch', v)}>
                  <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Admission Year</Label>
                <Select value={form.batch} onValueChange={(v) => setField('batch', v)}>
                  <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                  <SelectContent>
                    {batchYears.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Current Year</Label>
                <Select value={form.year} onValueChange={(v) => setField('year', v)}>
                  <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((y) => <SelectItem key={y} value={String(y)}>Year {y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={form.semester} onValueChange={(v) => setField('semester', v)}>
                  <SelectTrigger><SelectValue placeholder="Sem" /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => <SelectItem key={s} value={String(s)}>Sem {s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="section"
                  type="text"
                  placeholder="e.g. A, B, CSE-A, C-1"
                  value={form.section}
                  onChange={(e) => setField('section', e.target.value)}
                  className="pl-10"
                  maxLength={20}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">Type your section name as used by your department.</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
              >
                {error}
              </motion.div>
            )}

            <Button type="submit" disabled={loading} className="w-full h-11 rounded-full group">
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <Button
            onClick={handleDemo}
            variant="outline"
            className="w-full h-11 rounded-full mt-4 gap-2"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            Explore Demo Mode
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </AuthCard>

        <p className="mt-6 text-center text-xs text-muted-foreground/60">
          UniSphere is an unofficial student platform.
        </p>
      </div>
    </div>
  );
}

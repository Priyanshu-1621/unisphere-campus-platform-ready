'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, FileX2 } from 'lucide-react';
import { AppShell } from '@/components/layout/navigation';
import { PageHeader, FilterBar } from '@/components/layout/page-header';
import { RevealUp } from '@/components/animation/animation-utils';
import { ResourceCard } from '@/components/cards/resource-card';
import { EmptyState } from '@/components/shared/states';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { demoResources } from '@/lib/demo-data';

const branchFilters = [
  { value: 'all', label: 'All' },
  { value: 'CSE', label: 'CSE' },
  { value: 'ECE', label: 'ECE' },
  { value: 'ALL', label: 'ALL' },
];

const semesterFilters = [
  { value: 'all', label: 'All' },
  { value: '3', label: 'Sem 3' },
  { value: '4', label: 'Sem 4' },
  { value: '5', label: 'Sem 5' },
  { value: '6', label: 'Sem 6' },
];

const resourceTypeFilters = [
  { value: 'all', label: 'All' },
  { value: 'notes', label: 'Notes' },
  { value: 'previous_year_paper', label: 'Previous Year Papers' },
  { value: 'assignment', label: 'Assignments' },
  { value: 'lab_material', label: 'Lab Material' },
  { value: 'study_resource', label: 'Study Resources' },
  { value: 'senior_notes', label: 'Senior Notes' },
  { value: 'topper_notes', label: 'Topper Notes' },
];

export default function AcademicsPage() {
  const [branch, setBranch] = useState('all');
  const [semester, setSemester] = useState('all');
  const [resourceType, setResourceType] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return demoResources.filter((r) => {
      if (branch !== 'all' && r.branch !== branch) return false;
      if (semester !== 'all' && r.semester !== Number(semester)) return false;
      if (resourceType !== 'all' && r.resource_type !== resourceType) return false;
      if (q && !r.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [branch, semester, resourceType, search]);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <PageHeader
          title="Academic Hub"
          description="Subject-wise notes, previous year papers, assignments, lab material, and senior resources"
          actions={
            <Button asChild>
              <Link href="/upload">Upload Resource</Link>
            </Button>
          }
        />

        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources by title..."
            className="pl-9"
          />
        </div>

        <div className="space-y-3">
          <FilterBar
            filters={branchFilters}
            active={branch}
            onChange={setBranch}
            className="academics-branch"
          />
          <FilterBar
            filters={semesterFilters}
            active={semester}
            onChange={setSemester}
            className="academics-semester"
          />
          <FilterBar
            filters={resourceTypeFilters}
            active={resourceType}
            onChange={setResourceType}
            className="academics-type"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<FileX2 className="h-10 w-10" />}
            title="No resources found"
            description="Try adjusting your filters or search query. You can also upload a new resource to help others."
          />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((resource, i) => (
              <RevealUp key={resource.id} delay={Math.min(i * 0.04, 0.24)}>
                <ResourceCard resource={resource} index={i} />
              </RevealUp>
            ))}
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}

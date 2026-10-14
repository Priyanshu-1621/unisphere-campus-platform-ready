'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import type {
  Resource,
  EventItem,
  Club,
  Opportunity,
  Exam,
  CampusLocation,
  Question,
  LostFoundItem,
  Notification,
  Announcement,
} from '@/types';

interface QueryState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useSupabaseQuery<T>(
  table: string,
  select: string,
  orderBy?: { column: string; ascending?: boolean },
  limit?: number,
  filter?: { column: string; value: unknown }
): QueryState<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchCount, setRefetchCount] = useState(0);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let query = supabase.from(table).select(select);

    if (filter) {
      query = query.eq(filter.column, filter.value);
    }
    if (orderBy) {
      query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
    }
    if (limit) {
      query = query.limit(limit);
    }

    query.then(({ data: result, error: err }) => {
      if (err) {
        setError(err.message);
        setData([]);
      } else {
        setError(null);
        setData((result ?? []) as T[]);
      }
      setLoading(false);
    });
  }, [table, select, orderBy?.column, orderBy?.ascending, limit, filter?.column, filter?.value, refetchCount]);

  const refetch = useCallback(() => setRefetchCount((c) => c + 1), []);

  return { data, loading, error, refetch };
}

export function useResources(filter?: { column: string; value: unknown }) {
  return useSupabaseQuery<Resource>(
    'resources',
    '*',
    { column: 'created_at', ascending: false },
    undefined,
    filter
  );
}

export function useEvents(filter?: { column: string; value: unknown }) {
  return useSupabaseQuery<EventItem>(
    'events',
    '*',
    { column: 'date', ascending: true },
    undefined,
    filter
  );
}

export function useClubs() {
  return useSupabaseQuery<Club>('clubs', '*', { column: 'name', ascending: true });
}

export function useOpportunities() {
  return useSupabaseQuery<Opportunity>(
    'opportunities',
    '*',
    { column: 'deadline', ascending: true }
  );
}

export function useExams() {
  return useSupabaseQuery<Exam>(
    'exams',
    '*',
    { column: 'exam_date', ascending: true }
  );
}

export function useCampusLocations() {
  return useSupabaseQuery<CampusLocation>('campus_locations', '*', {
    column: 'name',
    ascending: true,
  });
}

export function useQuestions() {
  return useSupabaseQuery<Question>(
    'questions',
    '*',
    { column: 'created_at', ascending: false }
  );
}

export function useLostFound() {
  return useSupabaseQuery<LostFoundItem>(
    'lost_found_items',
    '*',
    { column: 'created_at', ascending: false }
  );
}

export function useNotifications() {
  return useSupabaseQuery<Notification>(
    'notifications',
    '*',
    { column: 'created_at', ascending: false }
  );
}

export function useAnnouncements() {
  return useSupabaseQuery<Announcement>(
    'announcements',
    '*',
    { column: 'created_at', ascending: false }
  );
}

export { isSupabaseConfigured };

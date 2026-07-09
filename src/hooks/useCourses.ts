import { useState, useCallback, useMemo } from 'react';
import type { Course } from '../types';
import { getAllCourses, getCourseById, searchCourses } from '../services';

export function useCourses() {
  const [query, setQuery] = useState('');
  const allCourses = useMemo(() => getAllCourses(), []);

  const results = useMemo(() => {
    if (!query.trim()) return allCourses;
    return searchCourses(query);
  }, [query, allCourses]);

  const getById = useCallback((id: string) => getCourseById(id), []);
  const byCategory = useCallback(
    (category: string) => allCourses.filter((c) => c.category === category),
    [allCourses],
  );

  return { courses: results, allCourses, query, setQuery, getById, byCategory };
}

export function useCourse(id: string): Course | undefined {
  return useMemo(() => getCourseById(id), [id]);
}

import type { Course } from '../types';
import { COURSES } from '../data';

let _cache: Course[] | null = null;

export function getAllCourses(): Course[] {
  if (_cache) return _cache;
  _cache = COURSES as Course[];
  return _cache;
}

export function getCourseById(id: string): Course | undefined {
  return getAllCourses().find((c) => c.id === id);
}

export function getCoursesByCategory(category: string): Course[] {
  return getAllCourses().filter((c) => c.category === category);
}

export function searchCourses(query: string): Course[] {
  const q = query.toLowerCase();
  return getAllCourses().filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q),
  );
}

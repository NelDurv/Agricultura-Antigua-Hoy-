import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface ProgressState {
  enrolledCourses: string[];
  courseProgress: { [courseId: string]: number };
  completedModules: string[];
  favorites: string[];
}

interface ProgressContextValue extends ProgressState {
  enrollCourse: (courseId: string) => void;
  completeModule: (courseId: string, moduleId: string, progressValue: number) => void;
  toggleFavorite: (docId: string) => void;
  hasCompleted32Courses: boolean;
  getCompleted32Courses: () => string[];
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(["suelo-vivo"]);
  const [courseProgress, setCourseProgress] = useState<{ [courseId: string]: number }>({
    "suelo-vivo": 25
  });
  const [completedModules, setCompletedModules] = useState<string[]>(["sv-m1"]);
  const [favorites, setFavorites] = useState<string[]>(["ficha-compostaje-domestico"]);

  const enrollCourse = useCallback((courseId: string) => {
    setEnrolledCourses(prev => {
      if (prev.includes(courseId)) return prev;
      setCourseProgress(p => ({ ...p, [courseId]: 0 }));
      return [...prev, courseId];
    });
  }, []);

  const completeModule = useCallback((courseId: string, moduleId: string, progressValue: number) => {
    setCompletedModules(prev => {
      if (prev.includes(moduleId)) return prev;
      setCourseProgress(p => ({ ...p, [courseId]: progressValue }));
      return [...prev, moduleId];
    });
  }, []);

  const toggleFavorite = useCallback((docId: string) => {
    setFavorites(prev => {
      if (prev.includes(docId)) return prev.filter(id => id !== docId);
      return [...prev, docId];
    });
  }, []);

  const getCompleted32Courses = useCallback((): string[] => {
    try {
      const saved = localStorage.getItem("completed_courses_32");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  const hasCompleted32Courses = getCompleted32Courses().length === 32;

  return (
    <ProgressContext.Provider value={{
      enrolledCourses, courseProgress, completedModules, favorites,
      enrollCourse, completeModule, toggleFavorite,
      hasCompleted32Courses, getCompleted32Courses
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}

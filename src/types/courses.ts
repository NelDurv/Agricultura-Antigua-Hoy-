export interface Module {
  id: string;
  title: string;
  duration: string;
  type: 'lecture' | 'quiz' | 'practical';
  content: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  extendedDescription?: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  category: string;
  duration: string;
  lessonsCount: number;
  image: string;
  rating: number;
  isPremium: boolean;
  author: string;
  modules: Module[];
}

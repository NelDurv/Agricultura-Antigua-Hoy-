export type DomainEntityType =
  | 'course' | 'document' | 'recipe' | 'project'
  | 'lab' | 'evaluation' | 'resource' | 'glossary';

export interface Course {
  id: string;
  title: string;
  description: string;
  objective: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  modules: { id: string; title: string; content: string }[];
  tags: string[];
}

export interface Document {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'article' | 'guide' | 'manual' | 'research';
  tags: string[];
  url?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  aplicaciones: string[];
  preparacion: string;
}

export interface Project {
  id: string;
  title: string;
  goal: string;
  status: 'planning' | 'active' | 'completed' | 'archived';
  steps: { id: string; title: string; done: boolean }[];
  resources: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Lab {
  id: string;
  title: string;
  type: 'compost' | 'bioinsumo' | 'suelo' | 'agua';
  parameters: Record<string, string>;
  results?: Record<string, string>;
  notes: string;
}

export interface Evaluation {
  id: string;
  title: string;
  type: 'quiz' | 'practical' | 'reflection';
  questions: { id: string; text: string; options?: string[]; correctAnswer?: string }[];
  score?: number;
  feedback?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'link' | 'file' | 'tool';
  url: string;
  tags: string[];
}

export type DomainEntity = Course | Document | Recipe | Project | Lab | Evaluation | Resource;

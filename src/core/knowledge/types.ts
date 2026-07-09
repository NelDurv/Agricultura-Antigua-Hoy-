export type KnowledgeType =
  | 'course' | 'article' | 'manual' | 'protocol' | 'guide' | 'infographic'
  | 'video' | 'recipe' | 'glossary' | 'tool' | 'news' | 'research';

export type DifficultyLevel = 'Bajo' | 'Medio' | 'Alto';
export type CourseLevel = 'Principiante' | 'Intermedio' | 'Avanzado';

export interface KnowledgeNode {
  id: string;
  type: KnowledgeType;
  title: string;
  description: string;
  tags: string[];
  relatedTo: string[];
  taxons: string[];
  difficulty?: DifficultyLevel | CourseLevel;
}

export interface KnowledgeRelationship {
  sourceId: string;
  targetId: string;
  relation: 'prerequisite' | 'related' | 'recommended' | 'contained-in';
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeRelationship[];
}

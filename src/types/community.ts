export interface Reply {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  date: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  category: 'General' | 'Suelos' | 'Biofertilizantes' | 'Riego' | 'Plagas' | 'Casos de Éxito';
  author: string;
  content: string;
  date: string;
  likes: number;
  replies: Reply[];
}

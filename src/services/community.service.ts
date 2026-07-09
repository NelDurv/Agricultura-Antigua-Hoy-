import type { CommunityPost } from '../types';
import { COMMUNITY_POSTS } from '../data';

export function getAllPosts(): CommunityPost[] {
  return COMMUNITY_POSTS as CommunityPost[];
}

export function getPostById(id: string): CommunityPost | undefined {
  return getAllPosts().find((p) => p.id === id);
}

export function getPostsByCategory(category: string): CommunityPost[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function searchPosts(query: string): CommunityPost[] {
  const q = query.toLowerCase();
  return getAllPosts().filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q),
  );
}

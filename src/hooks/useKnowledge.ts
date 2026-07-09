import { useMemo } from 'react';
import { getRelatedNodes, getNode, searchNodes, getNodesByType } from '../core/knowledge/graph';
import type { KnowledgeNode } from '../core/knowledge/types';

export function useRelatedNodes(id: string): KnowledgeNode[] {
  return useMemo(() => getRelatedNodes(id), [id]);
}

export function useKnowledgeNode(id: string): KnowledgeNode | undefined {
  return useMemo(() => getNode(id), [id]);
}

export function useSearchNodes(query: string): KnowledgeNode[] {
  return useMemo(() => searchNodes(query), [query]);
}

export function useNodesByType(type: string): KnowledgeNode[] {
  return useMemo(() => getNodesByType(type), [type]);
}

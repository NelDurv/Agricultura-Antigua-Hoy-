import { useEffect } from 'react';
import { useBrain, type ViewAction } from '../contexts/BrainContext';

type ViewActionHandler = (action: ViewAction) => void;

const handlers = new Map<string, Set<ViewActionHandler>>();

export function onViewAction(type: string, handler: ViewActionHandler) {
  if (!handlers.has(type)) handlers.set(type, new Set());
  handlers.get(type)!.add(handler);
  return () => handlers.get(type)?.delete(handler);
}

export function useViewAction(type: string, handler: ViewActionHandler) {
  const { viewAction, clearViewAction } = useBrain();

  useEffect(() => {
    if (viewAction && viewAction.type === type) {
      handler(viewAction);
      clearViewAction();
    }
  }, [viewAction, type, handler, clearViewAction]);
}

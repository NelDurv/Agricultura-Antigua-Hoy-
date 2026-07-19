import type { Panel, Workspace } from './types';

const MAX_PANELS = 8;

export function addPanel(workspace: Workspace, panel: Omit<Panel, 'id'>): { workspace: Workspace; panel: Panel } {
  const newPanel: Panel = {
    ...panel,
    id: `panel-${Date.now()}`,
  };

  // Enforce max panels — remove oldest open panel if at limit
  let panels = workspace.panels;
  if (panels.length >= MAX_PANELS) {
    const nonFocused = panels.filter(p => p.state !== 'focused');
    if (nonFocused.length > 0) {
      panels = panels.filter(p => p.id !== nonFocused[0].id);
    }
  }

  // If adding a focused panel, set all others to open
  const updatedPanels = panels.map(p => ({
    ...p,
    state: panel.state === 'focused' ? 'open' as const : p.state,
  }));

  return {
    workspace: { ...workspace, panels: [...updatedPanels, newPanel] },
    panel: newPanel,
  };
}

export function removePanel(workspace: Workspace, panelId: string): Workspace {
  return {
    ...workspace,
    panels: workspace.panels.filter(p => p.id !== panelId),
  };
}

export function focusPanel(workspace: Workspace, panelId: string): Workspace {
  return {
    ...workspace,
    panels: workspace.panels.map(p => ({
      ...p,
      state: p.id === panelId ? 'focused' as const : 'open' as const,
    })),
  };
}

export function minimizePanel(workspace: Workspace, panelId: string): Workspace {
  return {
    ...workspace,
    panels: workspace.panels.map(p =>
      p.id === panelId ? { ...p, state: 'minimized' as const } : p
    ),
  };
}

export function togglePanelState(workspace: Workspace, panelId: string): Workspace {
  const panel = workspace.panels.find(p => p.id === panelId);
  if (!panel) return workspace;

  switch (panel.state) {
    case 'focused':
      return minimizePanel(workspace, panelId);
    case 'open':
      return focusPanel(workspace, panelId);
    case 'minimized':
      return {
        ...workspace,
        panels: workspace.panels.map(p =>
          p.id === panelId ? { ...p, state: 'open' as const } : p
        ),
      };
  }
}

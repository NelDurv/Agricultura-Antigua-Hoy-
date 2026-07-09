import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface UIContextValue {
  dataSaver: boolean;
  toggleDataSaver: (val: boolean) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [dataSaver, setDataSaver] = useState<boolean>(() => localStorage.getItem("dataSaver") === "true");

  const toggleDataSaver = useCallback((val: boolean) => {
    setDataSaver(val);
    localStorage.setItem("dataSaver", String(val));
  }, []);

  return (
    <UIContext.Provider value={{ dataSaver, toggleDataSaver }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}

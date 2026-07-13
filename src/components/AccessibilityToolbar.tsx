import React, { useState, useCallback, useEffect } from 'react';
import { Accessibility, Sun, Moon, Minus, Plus, Type, RefreshCw, Monitor } from 'lucide-react';

type A11ySettings = {
  fontSize: number;
  underlineLinks: boolean;
  darkMode: boolean;
};

const STORAGE_KEY = 'agricultura-antigua-a11y';
const BASE_FONT = 16;
const MIN_FONT = 12;
const MAX_FONT = 24;

function loadSettings(): A11ySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { fontSize: BASE_FONT, underlineLinks: false, darkMode: false };
}

function applySettings(s: A11ySettings) {
  const root = document.documentElement;
  root.classList.toggle('a11y-underline-links', s.underlineLinks);
  root.classList.toggle('dark-mode', s.darkMode);
  root.style.fontSize = s.fontSize + 'px';
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export default function AccessibilityToolbar() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(loadSettings);

  useEffect(() => {
    applySettings(settings);
  }, [settings]);

  const update = useCallback((patch: Partial<A11ySettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => {
    const defaults: A11ySettings = { fontSize: BASE_FONT, underlineLinks: false, darkMode: false };
    setSettings(defaults);
    localStorage.removeItem(STORAGE_KEY);
    document.documentElement.removeAttribute('style');
    document.documentElement.classList.remove('a11y-underline-links', 'dark-mode');
  }, []);

  const adjustFont = useCallback((delta: number) => {
    setSettings((prev) => ({
      ...prev,
      fontSize: Math.min(MAX_FONT, Math.max(MIN_FONT, prev.fontSize + delta)),
    }));
  }, []);

  return (
    <div className="fixed left-3 bottom-8 z-50 flex flex-col items-start">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex flex-col items-center gap-0.5 bg-white border border-stone-200 rounded-r-xl rounded-l-none px-2 py-2.5 shadow-md hover:bg-emerald-50 transition-all text-stone-700 hover:text-emerald-700"
        aria-label="Accesibilidad"
        title="Herramientas de accesibilidad"
      >
        <Accessibility className="h-4 w-4" />
        <span className="text-[8px] font-bold font-mono uppercase tracking-wider hidden md:inline leading-tight text-center">
          Accesibilidad
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="mt-1 bg-white border border-stone-200 rounded-xl shadow-xl p-3 w-52 space-y-2">
          {/* Dark mode toggle */}
          <button
            onClick={() => update({ darkMode: !settings.darkMode })}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-semibold transition-all ${
              settings.darkMode
                ? 'bg-stone-800 text-stone-100'
                : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
            }`}
          >
            {settings.darkMode ? <Moon className="h-3.5 w-3.5" /> : <Monitor className="h-3.5 w-3.5" />}
            <span>{settings.darkMode ? 'Modo oscuro' : 'Modo claro'}</span>
          </button>

          {/* Font size controls */}
          <div className="flex items-center gap-1 px-1">
            <Type className="h-3.5 w-3.5 text-stone-500 shrink-0" />
            <span className="text-[10px] font-mono text-stone-500 flex-1">Tamaño texto</span>
            <button
              onClick={() => adjustFont(-1)}
              disabled={settings.fontSize <= MIN_FONT}
              className="h-7 w-7 flex items-center justify-center rounded-lg bg-stone-100 hover:bg-stone-200 disabled:opacity-30 transition-all text-stone-700"
              aria-label="Reducir fuente"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-[11px] font-mono font-bold w-6 text-center text-stone-700">
              {settings.fontSize}
            </span>
            <button
              onClick={() => adjustFont(1)}
              disabled={settings.fontSize >= MAX_FONT}
              className="h-7 w-7 flex items-center justify-center rounded-lg bg-stone-100 hover:bg-stone-200 disabled:opacity-30 transition-all text-stone-700"
              aria-label="Aumentar fuente"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Underline links */}
          <button
            onClick={() => update({ underlineLinks: !settings.underlineLinks })}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-semibold transition-all ${
              settings.underlineLinks
                ? 'bg-amber-100 text-amber-900'
                : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
            }`}
          >
            <span className="text-sm leading-none">U</span>
            <span>Subrayar enlaces</span>
          </button>

          {/* Reset */}
          <div className="border-t border-stone-100 pt-2">
            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-all"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Restablecer</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

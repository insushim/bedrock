'use client';
import { create } from 'zustand';
import ko from './ko.json';
import en from './en.json';

type Locale = 'ko' | 'en';
const dicts: Record<Locale, Record<string, unknown>> = { ko, en };

interface LocaleStore {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

export const useLocaleStore = create<LocaleStore>((set) => ({
  locale: 'ko',
  setLocale: (locale) => {
    set({ locale });
    if (typeof document !== 'undefined') document.documentElement.lang = locale;
    if (typeof localStorage !== 'undefined') localStorage.setItem('locale', locale);
  },
}));

export function useLocale(): Locale {
  return useLocaleStore((s) => s.locale);
}

export function useT() {
  const locale = useLocale();
  return (key: string, vars?: Record<string, string | number>): string => {
    const parts = key.split('.');
    let cur: unknown = dicts[locale];
    for (const p of parts) {
      if (cur && typeof cur === 'object') {
        cur = (cur as Record<string, unknown>)[p];
      } else {
        return key;
      }
    }
    let s = typeof cur === 'string' ? cur : key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        s = s.replace(`{${k}}`, String(v));
      }
    }
    return s;
  };
}

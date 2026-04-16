'use client';

import { useEffect } from 'react';
import { useLocaleStore } from '@/lib/i18n/useT';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const setLocale = useLocaleStore((s) => s.setLocale);
  useEffect(() => {
    const saved = localStorage.getItem('locale') as 'ko' | 'en' | null;
    if (saved) setLocale(saved);
  }, [setLocale]);
  return <>{children}</>;
}

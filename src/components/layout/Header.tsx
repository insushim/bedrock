'use client';

import Link from 'next/link';
import { Languages, ExternalLink, Trophy, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useLocaleStore, useT } from '@/lib/i18n/useT';

export function Header() {
  const { locale, setLocale } = useLocaleStore();
  const t = useT();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/restore', label: t('header.restore') },
    { href: '/guide', label: t('header.guide') },
    { href: '/faq', label: t('header.faq') },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border-default/50 bg-bg-primary/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-black">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-grass to-accent-diamond">
            <Trophy className="size-5 text-black" />
          </div>
          <span className="bg-gradient-to-r from-accent-grass to-accent-diamond bg-clip-text text-transparent">
            BedrockAchiever
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm text-text-muted transition hover:bg-bg-elevated hover:text-text-primary"
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => setLocale(locale === 'ko' ? 'en' : 'ko')}
            className="ml-2 inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-bg-elevated hover:text-text-primary"
          >
            <Languages className="size-4" /> {locale.toUpperCase()}
          </button>
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-border-default/50 bg-bg-primary px-6 py-4 md:hidden">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-3 text-text-muted hover:bg-bg-elevated"
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => {
              setLocale(locale === 'ko' ? 'en' : 'ko');
              setMobileOpen(false);
            }}
            className="mt-2 inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-bg-elevated"
          >
            <Languages className="size-4" /> {locale === 'ko' ? 'English' : '한국어'}
          </button>
        </div>
      )}
    </header>
  );
}

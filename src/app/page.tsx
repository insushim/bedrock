'use client';

import Link from 'next/link';
import { Trophy, Shield, Zap, Package, Globe, Heart } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useT } from '@/lib/i18n/useT';

const FEATURE_KEYS = [
  { key: 'local', icon: Shield },
  { key: 'batch', icon: Zap },
  { key: 'nbt', icon: Package },
  { key: 'safe', icon: Trophy },
  { key: 'offline', icon: Globe },
  { key: 'free', icon: Heart },
] as const;

export default function Home() {
  const t = useT();

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(88,181,48,0.15),transparent_60%)]" />

          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-gold/30 bg-accent-gold/10 px-4 py-1.5 text-sm text-accent-gold">
              <Trophy className="size-4" /> {t('hero.badge')}
            </div>
            <h1 className="mb-6 text-5xl font-black leading-tight sm:text-7xl">
              {t('hero.title1')}
              <span className="bg-gradient-to-r from-accent-grass to-accent-diamond bg-clip-text text-transparent">
                {t('hero.title2')}
              </span>
            </h1>
            <p className="mb-10 text-xl text-text-muted">{t('hero.desc')}</p>
            <Link
              href="/restore"
              className="inline-flex items-center gap-2 rounded-xl bg-accent-grass px-8 py-4 text-lg font-bold text-black transition hover:brightness-110"
            >
              {t('hero.cta')} &rarr;
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-16">
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURE_KEYS.map(({ key, icon: Icon }) => (
              <div key={key} className="glass rounded-2xl p-6">
                <Icon className="mb-4 size-10 text-accent-grass" />
                <h3 className="mb-2 text-xl font-bold">{t(`features.${key}.title`)}</h3>
                <p className="text-sm text-text-muted">{t(`features.${key}.desc`)}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

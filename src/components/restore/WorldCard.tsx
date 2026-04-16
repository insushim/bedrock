'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Trophy,
  Calendar,
  Package,
  Gamepad2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import type { WorldEntry } from '@/lib/store/world-store';
import { useWorldStore } from '@/lib/store/world-store';
import { BLOCKER_LABELS_KO, BLOCKER_LABELS_EN } from '@/lib/mcworld/flags';
import { useT, useLocale } from '@/lib/i18n/useT';
import { formatDate, formatBytes } from '@/lib/utils/format';

const GAME_TYPE_LABELS: Record<number, { ko: string; en: string }> = {
  0: { ko: '서바이벌', en: 'Survival' },
  1: { ko: '창의', en: 'Creative' },
  2: { ko: '모험', en: 'Adventure' },
  5: { ko: '기본', en: 'Default' },
};

export function WorldCard({ world }: { world: WorldEntry }) {
  const toggleSelect = useWorldStore((s) => s.toggleSelect);
  const locale = useLocale();
  const t = useT();

  const already = !world.status.isDisabled;
  const gameTypeLabel = GAME_TYPE_LABELS[world.gameType]?.[locale] ?? '?';
  const blockerLabels = locale === 'ko' ? BLOCKER_LABELS_KO : BLOCKER_LABELS_EN;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      onClick={() => !already && world.processState === 'idle' && toggleSelect(world.id)}
      className={`glass relative cursor-pointer overflow-hidden rounded-2xl p-5 transition-all ${
        world.selected ? 'grass-glow border-accent-grass' : ''
      } ${already ? 'opacity-60' : ''}`}
    >
      {/* 선택 체크박스 */}
      {!already && (
        <div
          className={`absolute right-4 top-4 flex size-6 items-center justify-center rounded-md border-2 transition ${
            world.selected ? 'border-accent-grass bg-accent-grass' : 'border-border-default'
          }`}
        >
          {world.selected && <CheckCircle2 className="size-5 text-black" />}
        </div>
      )}

      {/* 아이콘 */}
      <div className="mb-4 aspect-video overflow-hidden rounded-xl bg-bg-elevated">
        {world.iconDataUrl ? (
          <img
            src={world.iconDataUrl}
            alt={world.levelName}
            className="size-full object-cover pixel-block"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-text-muted">
            <Package className="size-10" />
          </div>
        )}
      </div>

      {/* 이름 */}
      <h3 className="mb-2 line-clamp-1 text-lg font-bold">{world.levelName}</h3>

      {/* 메타 */}
      <div className="mb-3 flex flex-wrap gap-2 text-xs text-text-muted">
        <span className="inline-flex items-center gap-1">
          <Gamepad2 className="size-3" />
          {gameTypeLabel}
        </span>
        {world.lastPlayedDate && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3" />
            {formatDate(world.lastPlayedDate, locale)}
          </span>
        )}
        {world.gameVersion && <span>v{world.gameVersion}</span>}
        <span>{formatBytes(world.sizeBytes)}</span>
      </div>

      {/* 도전과제 상태 */}
      <div
        className={`flex items-start gap-2 rounded-lg p-3 text-sm ${
          already ? 'bg-accent-gold/10 text-accent-gold' : 'bg-danger/10 text-danger'
        }`}
      >
        <Trophy className="mt-0.5 size-4 shrink-0" />
        <div className="flex-1">
          <div className="font-semibold">
            {already ? t('world.achievementsActive') : t('world.achievementsDisabled')}
          </div>
          {!already && (
            <ul className="mt-1 text-xs">
              {world.status.blockers.map((b) => (
                <li key={b}>
                  &bull; {blockerLabels[b]}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 처리 상태 오버레이 */}
      {world.processState === 'processing' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Loader2 className="size-8 animate-spin text-accent-grass" />
        </div>
      )}
      {world.processState === 'success' && (
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-accent-grass px-3 py-1 text-xs font-bold text-black">
          <CheckCircle2 className="size-3" /> {t('world.fixed')}
        </div>
      )}
      {world.processState === 'error' && (
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-lg bg-danger px-3 py-2 text-xs text-white">
          <AlertTriangle className="size-4" />
          {world.errorMessage ?? 'Error'}
        </div>
      )}
    </motion.div>
  );
}

'use client';

import { useState } from 'react';
import { Download, Trash2, Play, CheckSquare, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { zip as fzip } from 'fflate';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DropZone } from '@/components/restore/DropZone';
import { WorldCard } from '@/components/restore/WorldCard';
import { useWorldStore } from '@/lib/store/world-store';
import { fixAndRepackWorld } from '@/lib/mcworld/parser';
import { useT } from '@/lib/i18n/useT';

export default function RestorePage() {
  const worlds = useWorldStore((s) => s.worlds);
  const selectAll = useWorldStore((s) => s.selectAll);
  const deselectAll = useWorldStore((s) => s.deselectAll);
  const clear = useWorldStore((s) => s.clear);
  const setWorldState = useWorldStore((s) => s.setWorldState);
  const setProcessing = useWorldStore((s) => s.setProcessing);
  const [isRunning, setRunning] = useState(false);
  const t = useT();

  const selectedWorlds = worlds.filter((w) => w.selected && w.processState !== 'success');
  const fixedWorlds = worlds.filter((w) => w.processState === 'success' && w.fixedBlob);

  const runFix = async () => {
    if (selectedWorlds.length === 0) {
      toast.error(t('restore.selectFirst'));
      return;
    }
    setRunning(true);
    setProcessing(true);

    for (const w of selectedWorlds) {
      setWorldState(w.id, 'processing');
      try {
        const blob = await fixAndRepackWorld(w);
        setWorldState(w.id, 'success', { blob });
      } catch (err) {
        setWorldState(w.id, 'error', { error: (err as Error).message });
      }
    }

    setRunning(false);
    setProcessing(false);
    toast.success(t('restore.fixDone', { count: selectedWorlds.length }));
  };

  const downloadOne = (w: (typeof worlds)[number]) => {
    if (!w.fixedBlob) return;
    const url = URL.createObjectURL(w.fixedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${w.levelName.replace(/[^\w가-힣-]/g, '_')}_fixed.mcworld`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = async () => {
    if (fixedWorlds.length === 0) return;

    const files: Record<string, Uint8Array> = {};
    for (const w of fixedWorlds) {
      const buf = new Uint8Array(await w.fixedBlob!.arrayBuffer());
      const name = `${w.levelName.replace(/[^\w가-힣-]/g, '_')}_fixed.mcworld`;
      files[name] = buf;
    }

    const zipBuf = await new Promise<Uint8Array>((resolve, reject) => {
      fzip(files, { level: 0 }, (err, data) => (err ? reject(err) : resolve(data)));
    });

    const blob = new Blob([new Uint8Array(zipBuf)] as BlobPart[], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bedrock_achievements_fixed_${Date.now()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Header />
      <main className="px-6 pb-24 pt-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-black">{t('restore.title')}</h1>
            <p className="text-text-muted">{t('restore.subtitle')}</p>
          </div>

          <DropZone />

          <AnimatePresence>
            {worlds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-10"
              >
                {/* 툴바 */}
                <div className="glass mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-text-muted">
                      {t('restore.worldCount', { total: worlds.length })}{' '}
                      <span className="font-bold text-accent-grass">
                        {t('restore.selected', { count: selectedWorlds.length })}
                      </span>
                    </span>
                    <button
                      onClick={selectAll}
                      className="inline-flex items-center gap-1 rounded-lg bg-bg-elevated px-3 py-1.5 text-xs hover:bg-bg-elevated/70"
                    >
                      <CheckSquare className="size-4" /> {t('restore.selectAll')}
                    </button>
                    <button
                      onClick={deselectAll}
                      className="inline-flex items-center gap-1 rounded-lg bg-bg-elevated px-3 py-1.5 text-xs hover:bg-bg-elevated/70"
                    >
                      <Square className="size-4" /> {t('restore.deselect')}
                    </button>
                    <button
                      onClick={clear}
                      className="inline-flex items-center gap-1 rounded-lg bg-danger/20 px-3 py-1.5 text-xs text-danger hover:bg-danger/30"
                    >
                      <Trash2 className="size-4" /> {t('restore.clearAll')}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {fixedWorlds.length > 0 && (
                      <button
                        onClick={downloadAll}
                        className="inline-flex items-center gap-2 rounded-xl bg-accent-gold px-5 py-2.5 font-semibold text-black hover:brightness-110"
                      >
                        <Download className="size-4" /> {t('restore.downloadAll')}
                      </button>
                    )}
                    <button
                      onClick={runFix}
                      disabled={isRunning || selectedWorlds.length === 0}
                      className="inline-flex items-center gap-2 rounded-xl bg-accent-grass px-5 py-2.5 font-bold text-black disabled:opacity-50 hover:brightness-110"
                    >
                      <Play className="size-4" />
                      {isRunning
                        ? t('restore.fixing')
                        : t('restore.fixN', { count: selectedWorlds.length })}
                    </button>
                  </div>
                </div>

                {/* 카드 그리드 */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {worlds.map((w) => (
                    <div key={w.id} className="flex flex-col">
                      <WorldCard world={w} />
                      {w.processState === 'success' && w.fixedBlob && (
                        <button
                          onClick={() => downloadOne(w)}
                          className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-accent-grass/20 py-2 text-sm font-semibold text-accent-grass hover:bg-accent-grass/30"
                        >
                          <Download className="size-4" /> {t('restore.downloadOne')}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}

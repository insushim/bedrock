'use client';

import { useCallback, useState } from 'react';
import { Upload, FolderOpen, FileArchive } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { parseMcWorld } from '@/lib/mcworld/parser';
import { useWorldStore } from '@/lib/store/world-store';
import { useT } from '@/lib/i18n/useT';

export function DropZone() {
  const addWorld = useWorldStore((s) => s.addWorld);
  const [active, setActive] = useState(false);
  const t = useT();

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const arr = Array.from(files).filter((f) => f.name.toLowerCase().endsWith('.mcworld'));

      if (arr.length === 0) {
        toast.error(t('dropzone.invalidFile'));
        return;
      }

      for (const file of arr) {
        try {
          toast.loading(t('dropzone.analyzing', { name: file.name }), { id: file.name });
          const world = await parseMcWorld(file);
          addWorld(world);
          toast.success(t('dropzone.added', { name: world.levelName }), { id: file.name });
        } catch (err) {
          toast.error(
            t('dropzone.parseError', { name: file.name, error: (err as Error).message }),
            { id: file.name },
          );
        }
      }
    },
    [addWorld, t],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const onFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) handleFiles(e.target.files);
    },
    [handleFiles],
  );

  const onFolderSelect = useCallback(async () => {
    if (!('showDirectoryPicker' in window)) {
      toast.error(t('dropzone.folderUnsupported'));
      return;
    }
    try {
      const handle = await (window as any).showDirectoryPicker();
      const files: File[] = [];

      async function walk(dirHandle: any) {
        for await (const [name, h] of dirHandle.entries()) {
          if (h.kind === 'file' && name.toLowerCase().endsWith('.mcworld')) {
            files.push(await h.getFile());
          } else if (h.kind === 'directory') {
            await walk(h);
          }
        }
      }

      await walk(handle);
      if (files.length === 0) {
        toast.info(t('dropzone.noWorldsInFolder'));
      } else {
        handleFiles(files);
      }
    } catch (err) {
      if ((err as DOMException).name !== 'AbortError') {
        toast.error(t('dropzone.folderError'));
      }
    }
  }, [handleFiles, t]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onDrop={onDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setActive(true);
      }}
      onDragLeave={() => setActive(false)}
      className={`glass relative rounded-3xl border-2 border-dashed transition-all ${
        active ? 'drop-active grass-glow scale-[1.01]' : 'border-border-default'
      } p-12 text-center`}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-accent-grass/10"
      >
        <Upload className="size-10 text-accent-grass" />
      </motion.div>

      <h3 className="mb-2 text-2xl font-bold">{t('dropzone.title')}</h3>
      <p className="mb-8 text-text-muted">{t('dropzone.subtitle')}</p>

      <div className="flex flex-wrap justify-center gap-3">
        <label className="cursor-pointer">
          <input
            type="file"
            multiple
            accept=".mcworld"
            className="hidden"
            onChange={onFileSelect}
          />
          <span className="inline-flex items-center gap-2 rounded-xl bg-accent-grass px-6 py-3 font-semibold text-black transition hover:brightness-110">
            <FileArchive className="size-5" />
            {t('dropzone.selectFiles')}
          </span>
        </label>

        <button
          onClick={onFolderSelect}
          className="inline-flex items-center gap-2 rounded-xl bg-bg-elevated px-6 py-3 font-semibold transition hover:bg-bg-elevated/80"
        >
          <FolderOpen className="size-5" />
          {t('dropzone.selectFolder')}
        </button>
      </div>

      <p className="mt-6 text-xs text-text-muted">{t('dropzone.privacyNote')}</p>
    </motion.div>
  );
}

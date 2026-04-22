'use client';

import { useCallback, useState, useEffect } from 'react';
import { Upload, FolderOpen, FileArchive } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { parseMcWorld, parseFolderWorld } from '@/lib/mcworld/parser';
import { useWorldStore } from '@/lib/store/world-store';
import { useT } from '@/lib/i18n/useT';

async function collectFolderFiles(
  dirHandle: any,
  prefix = '',
): Promise<Record<string, Uint8Array>> {
  const out: Record<string, Uint8Array> = {};
  for await (const [name, h] of dirHandle.entries()) {
    const path = prefix ? `${prefix}/${name}` : name;
    if (h.kind === 'file') {
      const f: File = await h.getFile();
      out[path] = new Uint8Array(await f.arrayBuffer());
    } else if (h.kind === 'directory') {
      const sub = await collectFolderFiles(h, path);
      Object.assign(out, sub);
    }
  }
  return out;
}

export function DropZone() {
  const addWorld = useWorldStore((s) => s.addWorld);
  const [active, setActive] = useState(false);
  const [hasFolderPicker, setHasFolderPicker] = useState(false);
  const t = useT();

  useEffect(() => {
    setHasFolderPicker('showDirectoryPicker' in window);
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const name = (f: File) => f.name.toLowerCase();
      const arr = Array.from(files).filter(
        (f) => name(f).endsWith('.mcworld') || name(f).endsWith('.zip'),
      );

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
      const archives: File[] = [];
      const folderWorlds: Array<{ name: string; handle: any }> = [];

      // 서브폴더에 level.dat이 직접 있으면 "원본 월드 폴더"로 취급.
      // 아니면 재귀 walk하면서 .mcworld/.zip 파일만 수집(기존 동작).
      async function hasLevelDat(dirHandle: any): Promise<boolean> {
        for await (const [n, h] of dirHandle.entries()) {
          if (h.kind === 'file' && n === 'level.dat') return true;
        }
        return false;
      }

      async function walk(dirHandle: any) {
        for await (const [name, h] of dirHandle.entries()) {
          if (h.kind === 'file') {
            const lower = name.toLowerCase();
            if (lower.endsWith('.mcworld') || lower.endsWith('.zip')) {
              archives.push(await h.getFile());
            }
          } else if (h.kind === 'directory') {
            if (await hasLevelDat(h)) {
              folderWorlds.push({ name, handle: h });
            } else {
              await walk(h);
            }
          }
        }
      }

      // 루트 자체가 월드 폴더인 경우도 지원 (사용자가 특정 월드 하나만 선택)
      if (await hasLevelDat(handle)) {
        folderWorlds.push({ name: handle.name ?? 'world', handle });
      } else {
        await walk(handle);
      }

      if (archives.length === 0 && folderWorlds.length === 0) {
        toast.info(t('dropzone.noWorldsInFolder'));
        return;
      }

      // 비압축 폴더 월드 처리
      for (const fw of folderWorlds) {
        try {
          toast.loading(t('dropzone.analyzing', { name: fw.name }), { id: fw.name });
          const files = await collectFolderFiles(fw.handle);
          const world = await parseFolderWorld(files, fw.name);
          addWorld(world);
          toast.success(t('dropzone.added', { name: world.levelName }), { id: fw.name });
        } catch (err) {
          toast.error(
            t('dropzone.parseError', { name: fw.name, error: (err as Error).message }),
            { id: fw.name },
          );
        }
      }

      if (archives.length > 0) handleFiles(archives);
    } catch (err) {
      if ((err as DOMException).name !== 'AbortError') {
        toast.error(t('dropzone.folderError'));
      }
    }
  }, [handleFiles, t, addWorld]);

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
            accept=".mcworld,.zip,application/zip,application/x-zip-compressed,application/octet-stream"
            className="hidden"
            onChange={onFileSelect}
          />
          <span className="inline-flex items-center gap-2 rounded-xl bg-accent-grass px-6 py-3 font-semibold text-black transition hover:brightness-110">
            <FileArchive className="size-5" />
            {t('dropzone.selectFiles')}
          </span>
        </label>

        {hasFolderPicker && (
          <button
            onClick={onFolderSelect}
            className="inline-flex items-center gap-2 rounded-xl bg-bg-elevated px-6 py-3 font-semibold transition hover:bg-bg-elevated/80"
          >
            <FolderOpen className="size-5" />
            {t('dropzone.selectFolder')}
          </button>
        )}
      </div>

      <p className="mt-6 text-xs text-text-muted">{t('dropzone.privacyNote')}</p>
    </motion.div>
  );
}

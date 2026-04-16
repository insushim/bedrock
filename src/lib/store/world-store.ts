import { create } from 'zustand';
import type { WorldInfo } from '@/lib/mcworld/parser';

export type WorldProcessState = 'idle' | 'processing' | 'success' | 'error';

export interface WorldEntry extends WorldInfo {
  selected: boolean;
  processState: WorldProcessState;
  errorMessage?: string;
  fixedBlob?: Blob;
}

interface WorldStore {
  worlds: WorldEntry[];
  isProcessing: boolean;
  addWorld: (world: WorldInfo) => void;
  removeWorld: (id: string) => void;
  toggleSelect: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  clear: () => void;
  setWorldState: (
    id: string,
    state: WorldProcessState,
    opts?: { error?: string; blob?: Blob },
  ) => void;
  setProcessing: (v: boolean) => void;
}

export const useWorldStore = create<WorldStore>((set) => ({
  worlds: [],
  isProcessing: false,

  addWorld: (world) =>
    set((s) => ({
      worlds: [
        ...s.worlds,
        { ...world, selected: world.status.isDisabled, processState: 'idle' as const },
      ],
    })),

  removeWorld: (id) => set((s) => ({ worlds: s.worlds.filter((w) => w.id !== id) })),

  toggleSelect: (id) =>
    set((s) => ({
      worlds: s.worlds.map((w) => (w.id === id ? { ...w, selected: !w.selected } : w)),
    })),

  selectAll: () =>
    set((s) => ({
      worlds: s.worlds.map((w) => ({ ...w, selected: w.status.isDisabled })),
    })),

  deselectAll: () => set((s) => ({ worlds: s.worlds.map((w) => ({ ...w, selected: false })) })),

  clear: () => set({ worlds: [], isProcessing: false }),

  setWorldState: (id, state, opts) =>
    set((s) => ({
      worlds: s.worlds.map((w) =>
        w.id === id
          ? { ...w, processState: state, errorMessage: opts?.error, fixedBlob: opts?.blob }
          : w,
      ),
    })),

  setProcessing: (v) => set({ isProcessing: v }),
}));

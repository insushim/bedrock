/**
 * 도전과제 관련 플래그 감지 및 수정
 */
import { Int8, Int32 } from 'nbtify';
import type { NBTData, CompoundTag, Tag } from 'nbtify';

export type AchievementBlocker =
  | 'creativeLoaded'
  | 'cheatsOn'
  | 'commandsOn'
  | 'gameTypeCreative';

export interface AchievementStatus {
  isDisabled: boolean;
  blockers: AchievementBlocker[];
  flags: {
    hasBeenLoadedInCreative: number;
    cheatsEnabled: number;
    commandsEnabled: number;
    GameType: number;
  };
}

function getNum(tag: Tag | undefined): number {
  if (tag == null) return 0;
  if (typeof tag === 'number') return tag;
  if (tag instanceof Number) return tag.valueOf();
  return 0;
}

export function getAchievementStatus(nbtData: NBTData<CompoundTag>): AchievementStatus {
  const root = nbtData.data;
  const flags = {
    hasBeenLoadedInCreative: getNum(root.hasBeenLoadedInCreative),
    cheatsEnabled: getNum(root.cheatsEnabled),
    commandsEnabled: getNum(root.commandsEnabled),
    GameType: getNum(root.GameType),
  };

  const blockers: AchievementBlocker[] = [];
  if (flags.hasBeenLoadedInCreative === 1) blockers.push('creativeLoaded');
  if (flags.cheatsEnabled === 1) blockers.push('cheatsOn');
  if (flags.commandsEnabled === 1) blockers.push('commandsOn');
  if (flags.GameType === 1) blockers.push('gameTypeCreative');

  return {
    isDisabled: blockers.length > 0,
    blockers,
    flags,
  };
}

export function restoreAchievements(nbtData: NBTData<CompoundTag>): {
  changed: boolean;
  before: AchievementStatus;
  after: AchievementStatus;
} {
  const before = getAchievementStatus(nbtData);
  const root = nbtData.data as Record<string, Tag | undefined>;

  root.hasBeenLoadedInCreative = new Int8(0);
  root.cheatsEnabled = new Int8(0);
  root.commandsEnabled = new Int8(0);

  if (getNum(root.GameType) === 1) {
    root.GameType = new Int32(0);
  }

  const after = getAchievementStatus(nbtData);
  return {
    changed: before.blockers.length > 0,
    before,
    after,
  };
}

export const BLOCKER_LABELS_KO: Record<AchievementBlocker, string> = {
  creativeLoaded: '창의모드 진입 이력',
  cheatsOn: '치트 활성화',
  commandsOn: '명령어 허용',
  gameTypeCreative: '현재 창의모드',
};

export const BLOCKER_LABELS_EN: Record<AchievementBlocker, string> = {
  creativeLoaded: 'Loaded in Creative',
  cheatsOn: 'Cheats Enabled',
  commandsOn: 'Commands Enabled',
  gameTypeCreative: 'Creative Mode',
};

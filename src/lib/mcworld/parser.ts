/**
 * .mcworld ZIP 파일 파싱 및 월드 정보 추출
 */
import { unzip, zip } from 'fflate';
import { parseLevelDat, patchAchievementFlags } from '@/lib/nbt/bedrock-nbt';
import { getAchievementStatus, type AchievementStatus } from './flags';
import type { NBTData, CompoundTag, Tag } from 'nbtify';

export interface WorldInfo {
  id: string;
  originalFile: File;
  levelName: string;
  iconDataUrl: string | null;
  lastPlayedDate: Date | null;
  gameVersion: string | null;
  difficulty: number | null;
  gameType: number;
  status: AchievementStatus;
  nbtData: NBTData<CompoundTag>;
  zipFiles: Record<string, Uint8Array>;
  sizeBytes: number;
  storageVersion: number;
}

const unzipAsync = (buf: Uint8Array): Promise<Record<string, Uint8Array>> =>
  new Promise((resolve, reject) => {
    unzip(buf, (err, data) => (err ? reject(err) : resolve(data)));
  });

const zipAsync = (files: Record<string, Uint8Array>): Promise<Uint8Array> =>
  new Promise((resolve, reject) => {
    zip(files, { level: 6 }, (err, data) => (err ? reject(err) : resolve(data)));
  });

function getNum(tag: Tag | undefined): number {
  if (tag == null) return 0;
  if (typeof tag === 'number') return tag;
  if (tag instanceof Number) return tag.valueOf();
  return 0;
}

export async function parseMcWorld(file: File): Promise<WorldInfo> {
  const arrayBuf = await file.arrayBuffer();
  const buf = new Uint8Array(arrayBuf);

  const zipFiles = await unzipAsync(buf);

  // level.dat 찾기 (루트 또는 한 단계 안쪽 폴더)
  const levelDatKey = Object.keys(zipFiles).find(
    (k) => k.endsWith('level.dat') && !k.endsWith('level.dat_old'),
  );
  if (!levelDatKey) throw new Error('level.dat을 찾을 수 없습니다');

  const parsed = await parseLevelDat(zipFiles[levelDatKey]);
  const status = getAchievementStatus(parsed.nbtData);

  // levelname.txt
  const levelNameKey = Object.keys(zipFiles).find((k) => k.endsWith('levelname.txt'));
  let levelName = 'Untitled World';
  if (levelNameKey) {
    try {
      levelName = new TextDecoder('utf-8').decode(zipFiles[levelNameKey]).trim();
    } catch {
      /* fallback */
    }
  } else {
    const root = parsed.nbtData.data;
    if (root.LevelName) levelName = String((root.LevelName as Tag).valueOf());
  }

  // world_icon.jpeg
  const iconKey = Object.keys(zipFiles).find((k) => k.endsWith('world_icon.jpeg'));
  let iconDataUrl: string | null = null;
  if (iconKey) {
    const iconBytes = new Uint8Array(zipFiles[iconKey]);
    const blob = new Blob([iconBytes] as BlobPart[], { type: 'image/jpeg' });
    iconDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  // 메타데이터 추출
  const root = parsed.nbtData.data;
  const lastPlayedTs = root.LastPlayed ? Number((root.LastPlayed as Tag).valueOf()) : null;
  const lastPlayedDate = lastPlayedTs ? new Date(lastPlayedTs * 1000) : null;

  const verTag = root.lastOpenedWithVersion;
  let gameVersion: string | null = null;
  if (Array.isArray(verTag)) {
    gameVersion = verTag
      .slice(0, 4)
      .map((v: Tag) => Number(v.valueOf()))
      .join('.');
  }

  const difficulty = root.Difficulty ? getNum(root.Difficulty) : null;
  const gameType = getNum(root.GameType);

  return {
    id: `${file.name}-${crypto.randomUUID()}`,
    originalFile: file,
    levelName,
    iconDataUrl,
    lastPlayedDate,
    gameVersion,
    difficulty,
    gameType,
    status,
    nbtData: parsed.nbtData,
    zipFiles,
    sizeBytes: file.size,
    storageVersion: parsed.header.storageVersion,
  };
}

/**
 * 월드 수정 및 재패킹
 * level.dat을 NBT 트리로 재직렬화하면 Bedrock 검증이 실패함("세계를 불러올 수 없습니다").
 * 대신 원본 바이트에서 4개 플래그 값만 in-place 패치 → 파일 크기·구조 완전 보존.
 */
export async function fixAndRepackWorld(world: WorldInfo): Promise<Blob> {
  const newFiles = { ...world.zipFiles };
  const levelDatKey = Object.keys(newFiles).find(
    (k) => k.endsWith('level.dat') && !k.endsWith('level.dat_old'),
  )!;

  newFiles[levelDatKey] = patchAchievementFlags(newFiles[levelDatKey]);

  const zipBuf = await zipAsync(newFiles);
  return new Blob([new Uint8Array(zipBuf)] as BlobPart[], { type: 'application/octet-stream' });
}

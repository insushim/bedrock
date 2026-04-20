/**
 * Minecraft Bedrock Edition NBT 읽기 + 바이트 레벨 패치
 * - 읽기: nbtify로 메타데이터 추출 (level name, icon 등 표시용)
 * - 쓰기: 원본 바이트에서 4개 플래그 태그 값만 in-place 덮어쓰기
 *   (NBT round-trip은 Bedrock 검증을 못 통과시켜 "세계를 불러올 수 없습니다" 에러 유발)
 */
import { read, NBTData } from 'nbtify';
import type { CompoundTag } from 'nbtify';

export interface BedrockNbtHeader {
  storageVersion: number;
  payloadLength: number;
}

export interface ParsedLevelDat {
  header: BedrockNbtHeader;
  nbtData: NBTData<CompoundTag>;
}

export async function parseLevelDat(buffer: Uint8Array): Promise<ParsedLevelDat> {
  if (buffer.byteLength < 8) {
    throw new Error('level.dat: 파일이 8바이트 헤더보다 작습니다');
  }

  const headerBuf = buffer.slice(0, 8);
  const view = new DataView(headerBuf.buffer, headerBuf.byteOffset, 8);
  const storageVersion = view.getInt32(0, true);
  const payloadLength = view.getInt32(4, true);

  if (payloadLength <= 0 || 8 + payloadLength > buffer.byteLength) {
    throw new Error(`level.dat: 잘못된 페이로드 길이 (${payloadLength})`);
  }

  const payload = buffer.slice(8, 8 + payloadLength);

  const nbtData = await read<CompoundTag>(payload, {
    endian: 'little',
    compression: null,
    bedrockLevel: false,
    strict: false,
  });

  return {
    header: { storageVersion, payloadLength },
    nbtData,
  };
}

/**
 * NBT 바이너리(리틀엔디안)에서 `[tagType][nameLen:u16 LE][name bytes]` 패턴을 찾아
 * 값 바이트가 시작되는 오프셋을 반환. 없으면 -1.
 */
function findTagValueOffset(bytes: Uint8Array, tagType: number, tagName: string): number {
  const nameBytes = new TextEncoder().encode(tagName);
  const nameLen = nameBytes.length;
  const headerLen = 3 + nameLen;
  const lo = nameLen & 0xff;
  const hi = (nameLen >> 8) & 0xff;

  outer: for (let i = 0; i <= bytes.length - headerLen; i++) {
    if (bytes[i] !== tagType) continue;
    if (bytes[i + 1] !== lo) continue;
    if (bytes[i + 2] !== hi) continue;
    for (let j = 0; j < nameLen; j++) {
      if (bytes[i + 3 + j] !== nameBytes[j]) continue outer;
    }
    return i + headerLen;
  }
  return -1;
}

/**
 * level.dat 원본 바이트에서 도전과제 차단 플래그만 in-place 수정한 사본을 반환.
 * - hasBeenLoadedInCreative / cheatsEnabled / commandsEnabled → 0
 * - GameType == 1 (창의) → 0 (서바이벌)
 *
 * 파일 크기·NBT 트리 구조·기타 태그는 1바이트도 변경하지 않음 → Bedrock 호환.
 */
export function patchAchievementFlags(original: Uint8Array): Uint8Array {
  const bytes = new Uint8Array(original);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  const setByteTag = (name: string, value: number) => {
    const off = findTagValueOffset(bytes, 0x01, name);
    if (off !== -1) bytes[off] = value & 0xff;
  };

  const setIntTagIfEquals = (name: string, expected: number, newValue: number) => {
    const off = findTagValueOffset(bytes, 0x03, name);
    if (off === -1) return;
    if (view.getInt32(off, true) === expected) {
      view.setInt32(off, newValue, true);
    }
  };

  setByteTag('hasBeenLoadedInCreative', 0);
  setByteTag('cheatsEnabled', 0);
  setByteTag('commandsEnabled', 0);
  setIntTagIfEquals('GameType', 1, 0);

  return bytes;
}

/**
 * Minecraft Bedrock Edition NBT 읽기/쓰기 래퍼
 * - nbtify 기반, 리틀엔디안 고정
 * - 8-byte 헤더 (storage version + payload length) 처리
 */
import { read, write, NBTData } from 'nbtify';
import type { CompoundTag } from 'nbtify';

export interface BedrockNbtHeader {
  storageVersion: number;
  payloadLength: number;
}

export interface ParsedLevelDat {
  header: BedrockNbtHeader;
  nbtData: NBTData<CompoundTag>;
}

/**
 * level.dat 바이너리를 파싱해서 NBT 트리 + 헤더 분리 반환
 */
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
 * NBT 트리 + 헤더를 level.dat 바이너리로 직렬화
 */
export async function writeLevelDat(
  nbtData: NBTData<CompoundTag>,
  storageVersion: number,
): Promise<Uint8Array> {
  const payload = await write(nbtData, {
    endian: 'little',
    compression: null,
    bedrockLevel: false,
  });

  const result = new Uint8Array(8 + payload.byteLength);
  const view = new DataView(result.buffer);
  view.setInt32(0, storageVersion, true);
  view.setInt32(4, payload.byteLength, true);
  result.set(new Uint8Array(payload), 8);

  return result;
}

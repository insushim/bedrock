'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLocale } from '@/lib/i18n/useT';

export default function AboutPage() {
  const locale = useLocale();

  return (
    <>
      <Header />
      <main className="px-6 pb-24 pt-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-4xl font-black">
            {locale === 'ko' ? 'BedrockAchiever 소개' : 'About BedrockAchiever'}
          </h1>

          <div className="space-y-6 text-text-muted">
            {locale === 'ko' ? (
              <>
                <p>
                  BedrockAchiever는 마인크래프트 배드락 에디션에서 창의모드나 치트 사용으로
                  비활성화된 도전과제를 복구해주는 무료 오픈소스 도구입니다.
                </p>
                <p>
                  모든 파일 처리는 여러분의 브라우저 안에서만 이루어지며, 어떤 데이터도 외부
                  서버로 전송되지 않습니다. 백엔드 서버 자체가 존재하지 않는 완전한 정적
                  사이트입니다.
                </p>
                <h2 className="text-2xl font-bold text-text-primary">작동 원리</h2>
                <p>
                  .mcworld 파일은 실제로는 ZIP 아카이브입니다. 내부의 level.dat 파일에는 월드
                  설정이 NBT(Named Binary Tag) 형식으로 저장되어 있습니다. 이 도구는 세 가지
                  플래그만 정확히 수정합니다:
                </p>
                <ul className="list-inside list-disc space-y-1">
                  <li>
                    <code className="rounded bg-bg-elevated px-1.5 py-0.5 text-sm">
                      hasBeenLoadedInCreative
                    </code>{' '}
                    &rarr; 0
                  </li>
                  <li>
                    <code className="rounded bg-bg-elevated px-1.5 py-0.5 text-sm">
                      cheatsEnabled
                    </code>{' '}
                    &rarr; 0
                  </li>
                  <li>
                    <code className="rounded bg-bg-elevated px-1.5 py-0.5 text-sm">
                      commandsEnabled
                    </code>{' '}
                    &rarr; 0
                  </li>
                </ul>
                <p>
                  청크 데이터(db/ 폴더), 인벤토리, 건축물, 리소스팩 설정 등 나머지 데이터는
                  일절 건드리지 않습니다.
                </p>
                <h2 className="text-2xl font-bold text-text-primary">라이선스</h2>
                <p>MIT License로 공개되어 있어 자유롭게 사용·수정·배포할 수 있습니다.</p>
              </>
            ) : (
              <>
                <p>
                  BedrockAchiever is a free, open-source tool that restores achievements in
                  Minecraft Bedrock Edition worlds disabled by Creative mode or cheats.
                </p>
                <p>
                  All file processing happens entirely in your browser. No data is ever sent to
                  any external server. There is no backend — this is a fully static site.
                </p>
                <h2 className="text-2xl font-bold text-text-primary">How It Works</h2>
                <p>
                  A .mcworld file is a ZIP archive. Inside, level.dat stores world settings in
                  NBT (Named Binary Tag) format. This tool modifies exactly three flags:
                </p>
                <ul className="list-inside list-disc space-y-1">
                  <li>
                    <code className="rounded bg-bg-elevated px-1.5 py-0.5 text-sm">
                      hasBeenLoadedInCreative
                    </code>{' '}
                    &rarr; 0
                  </li>
                  <li>
                    <code className="rounded bg-bg-elevated px-1.5 py-0.5 text-sm">
                      cheatsEnabled
                    </code>{' '}
                    &rarr; 0
                  </li>
                  <li>
                    <code className="rounded bg-bg-elevated px-1.5 py-0.5 text-sm">
                      commandsEnabled
                    </code>{' '}
                    &rarr; 0
                  </li>
                </ul>
                <p>
                  Chunk data (db/), inventory, builds, and resource pack settings are never
                  touched.
                </p>
                <h2 className="text-2xl font-bold text-text-primary">License</h2>
                <p>Released under the MIT License — free to use, modify, and distribute.</p>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

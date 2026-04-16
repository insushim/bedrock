'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useT, useLocale } from '@/lib/i18n/useT';

const STEPS_KO = [
  {
    n: 1,
    title: 'Minecraft에서 월드 내보내기',
    desc: 'Minecraft 배드락 에디션 실행 → "월드 편집" → 하단 "월드 내보내기" → .mcworld 파일 저장',
  },
  {
    n: 2,
    title: '이 사이트에 파일 업로드',
    desc: '.mcworld 파일을 드래그&드롭 또는 "파일 선택" 버튼으로 업로드. 여러 월드 동시 가능',
  },
  {
    n: 3,
    title: '월드 확인 후 선택',
    desc: '자동 분석 결과를 확인. 도전과제가 비활성된 월드에 체크. 아이콘과 이름으로 정확히 구별 가능',
  },
  {
    n: 4,
    title: '복구하기 버튼 클릭',
    desc: '선택된 모든 월드에 대해 3개 플래그(hasBeenLoadedInCreative, cheatsEnabled, commandsEnabled) 자동 수정',
  },
  {
    n: 5,
    title: '수정된 .mcworld 다운로드',
    desc: '개별 다운로드 또는 전체를 ZIP으로 한번에 받기',
  },
  {
    n: 6,
    title: 'Minecraft에 재가져오기',
    desc: '다운로드된 .mcworld 파일을 더블클릭하거나 Minecraft에서 "월드 가져오기"로 복원. 기존 월드는 덮어쓰기됩니다',
  },
];

const STEPS_EN = [
  {
    n: 1,
    title: 'Export your world from Minecraft',
    desc: 'Open Minecraft Bedrock Edition → Edit World → Export World (.mcworld)',
  },
  {
    n: 2,
    title: 'Upload .mcworld files',
    desc: 'Drag & drop or click "Select Files" to upload. Multiple worlds supported.',
  },
  {
    n: 3,
    title: 'Review and select worlds',
    desc: 'Check the analysis results and select worlds with disabled achievements.',
  },
  {
    n: 4,
    title: 'Click Restore',
    desc: 'Automatically fixes 3 flags: hasBeenLoadedInCreative, cheatsEnabled, commandsEnabled.',
  },
  {
    n: 5,
    title: 'Download fixed .mcworld',
    desc: 'Download individually or all at once as a ZIP archive.',
  },
  {
    n: 6,
    title: 'Import back into Minecraft',
    desc: 'Double-click the .mcworld file or use "Import" in Minecraft to restore.',
  },
];

const TIPS_KO = [
  '복구 후 월드에 들어가면 다시는 창의모드/치트를 켜지 마세요. 켜면 도전과제가 또 비활성화됩니다',
  '이미 획득한 도전과제 기록은 Xbox Live 계정에 있어 월드 수정과 무관합니다',
  '월드 데이터(청크, 건축물, 인벤토리)는 전혀 건드리지 않습니다',
  '공식적으로 Mojang이 막을 수 있으므로 지금 복구해두세요',
];

const TIPS_EN = [
  'After restoring, do not switch to Creative mode or enable cheats again — it will re-disable achievements.',
  'Existing achievement records are tied to your Xbox Live account and unaffected by world edits.',
  'World data (chunks, builds, inventory) is never modified.',
  'Mojang may patch this in the future — restore now while you can.',
];

export default function GuidePage() {
  const locale = useLocale();
  const steps = locale === 'ko' ? STEPS_KO : STEPS_EN;
  const tips = locale === 'ko' ? TIPS_KO : TIPS_EN;

  return (
    <>
      <Header />
      <main className="px-6 pb-24 pt-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-2 text-4xl font-black">
            {locale === 'ko' ? '사용법 가이드' : 'How to Use'}
          </h1>
          <p className="mb-10 text-text-muted">
            {locale === 'ko'
              ? '처음부터 끝까지 6단계로 도전과제를 복구하는 방법'
              : 'Restore achievements in 6 simple steps'}
          </p>

          <div className="space-y-6">
            {steps.map((s) => (
              <div key={s.n} className="glass flex gap-5 rounded-2xl p-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent-grass text-xl font-black text-black">
                  {s.n}
                </div>
                <div>
                  <h3 className="mb-1 text-xl font-bold">{s.title}</h3>
                  <p className="text-text-muted">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-accent-gold/30 bg-accent-gold/10 p-6">
            <h3 className="mb-2 font-bold text-accent-gold">
              {locale === 'ko' ? '중요 안내' : 'Important Notes'}
            </h3>
            <ul className="space-y-1 text-sm text-text-muted">
              {tips.map((tip, i) => (
                <li key={i}>&bull; {tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

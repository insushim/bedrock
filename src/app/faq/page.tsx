'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLocale } from '@/lib/i18n/useT';

const FAQS_KO = [
  {
    q: '이 사이트가 안전한가요?',
    a: '네. 모든 처리는 여러분의 브라우저 안에서만 일어납니다. .mcworld 파일이 저희 서버로 절대 전송되지 않으며, 서버 자체가 없습니다(정적 호스팅). 개발자도 여러분의 월드를 볼 수 없습니다.',
  },
  {
    q: '어떤 버전을 지원하나요?',
    a: 'Minecraft Bedrock Edition 1.21.x (2025~2026년 최신 포함). 1.16 이전 일부 구형 월드는 NBT 구조 차이로 실패할 수 있습니다.',
  },
  {
    q: '월드 데이터가 손상되지는 않나요?',
    a: 'level.dat 안의 도전과제 관련 3개 플래그만 수정합니다. 청크 데이터(db/ 폴더), 인벤토리, 건축물은 절대 건드리지 않습니다. 걱정되면 원본 .mcworld를 따로 백업해두세요.',
  },
  {
    q: 'Xbox/PlayStation/Switch에서도 되나요?',
    a: '콘솔은 월드 파일 시스템 접근이 막혀 있어 직접적으로는 불가능합니다. 단, 동일 계정에서 Realms를 통해 PC로 가져와 복구 후 다시 동기화하는 간접 방법이 가능할 수 있습니다.',
  },
  {
    q: '도전과제 기록이 날아가지는 않나요?',
    a: '아니요. 이미 획득한 도전과제는 Xbox Live 계정과 연결되어 있고 월드 수정과 무관합니다.',
  },
  {
    q: '여러 월드를 한번에 처리할 수 있나요?',
    a: '네. 드래그&드롭으로 여러 .mcworld 파일 또는 minecraftWorlds 폴더 전체를 한번에 처리 가능합니다.',
  },
  {
    q: '커맨드 블록은 계속 사용할 수 있나요?',
    a: '네. 이미 배치된 커맨드 블록은 레드스톤으로 트리거할 수 있습니다. 단 commandsEnabled를 0으로 되돌리므로 채팅창에서 /명령어는 막힙니다.',
  },
  {
    q: '비용이 있나요?',
    a: '완전 무료입니다. 로그인·가입·추적·광고 없습니다.',
  },
  {
    q: '복구 후 다시 창의모드를 켜면?',
    a: '즉시 도전과제가 다시 비활성화됩니다. 이 도구로 다시 복구 가능하지만, 가급적 서바이벌만 유지하세요.',
  },
];

const FAQS_EN = [
  {
    q: 'Is this site safe?',
    a: 'Yes. All processing happens in your browser. Files are never sent to any server — there is no backend. The developer cannot see your worlds.',
  },
  {
    q: 'Which versions are supported?',
    a: 'Minecraft Bedrock Edition 1.21.x (latest 2025–2026). Some pre-1.16 worlds may fail due to NBT structure differences.',
  },
  {
    q: 'Will my world data get corrupted?',
    a: 'Only 3 achievement-related flags in level.dat are modified. Chunk data (db/), inventory, and builds are never touched. Back up your original .mcworld just in case.',
  },
  {
    q: 'Does it work on Xbox/PlayStation/Switch?',
    a: 'Console file systems are restricted. You may export via Realms to PC, fix, and sync back.',
  },
  {
    q: 'Will I lose my achievement progress?',
    a: 'No. Earned achievements are tied to your Xbox Live account, independent of world files.',
  },
  {
    q: 'Can I process multiple worlds at once?',
    a: 'Yes. Drag & drop multiple .mcworld files or select a folder.',
  },
  {
    q: 'Will command blocks still work?',
    a: 'Placed command blocks still trigger via redstone. But chat commands will be disabled since commandsEnabled is set to 0.',
  },
  {
    q: 'Does it cost anything?',
    a: 'Completely free. No signup, no tracking, no ads.',
  },
  {
    q: 'What if I switch to Creative again?',
    a: 'Achievements will be disabled again immediately. You can re-fix, but try to stay in Survival.',
  },
];

export default function FAQPage() {
  const locale = useLocale();
  const faqs = locale === 'ko' ? FAQS_KO : FAQS_EN;

  return (
    <>
      <Header />
      <main className="px-6 pb-24 pt-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-10 text-4xl font-black">
            {locale === 'ko' ? '자주 묻는 질문' : 'Frequently Asked Questions'}
          </h1>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="glass group rounded-2xl p-5">
                <summary className="cursor-pointer list-none font-bold">
                  <span className="mr-2 text-accent-grass">Q.</span>
                  {f.q}
                </summary>
                <p className="mt-3 text-text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

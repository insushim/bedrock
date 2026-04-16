'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLocale } from '@/lib/i18n/useT';

export default function PrivacyPage() {
  const locale = useLocale();

  return (
    <>
      <Header />
      <main className="px-6 pb-24 pt-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-4xl font-black">
            {locale === 'ko' ? '개인정보 처리방침' : 'Privacy Policy'}
          </h1>

          <div className="space-y-6 text-text-muted">
            {locale === 'ko' ? (
              <>
                <p>최종 업데이트: 2026년 4월 16일</p>
                <h2 className="text-2xl font-bold text-text-primary">
                  수집하는 개인정보: 없음
                </h2>
                <p>
                  BedrockAchiever는 어떠한 개인정보도 수집하지 않습니다. 이 사이트에는 백엔드
                  서버가 없으며, 모든 파일 처리는 100% 여러분의 브라우저에서만 이루어집니다.
                </p>
                <h2 className="text-2xl font-bold text-text-primary">파일 처리</h2>
                <p>
                  업로드하신 .mcworld 파일은 브라우저의 메모리에서만 처리되며, 처리 후 브라우저
                  탭을 닫으면 즉시 삭제됩니다. 파일은 네트워크를 통해 어디로도 전송되지
                  않습니다.
                </p>
                <h2 className="text-2xl font-bold text-text-primary">쿠키 및 추적</h2>
                <p>
                  이 사이트는 쿠키, 분석 도구, 추적 스크립트를 사용하지 않습니다. 언어 설정만
                  localStorage에 저장됩니다.
                </p>
                <h2 className="text-2xl font-bold text-text-primary">제3자 서비스</h2>
                <p>
                  이 사이트는 Vercel에서 정적으로 호스팅됩니다. Vercel의 기본 서버 로그(IP,
                  요청 경로)는 Vercel 서비스 약관에 따라 처리됩니다. 그 외 제3자 서비스와의
                  데이터 공유는 없습니다.
                </p>
              </>
            ) : (
              <>
                <p>Last updated: April 16, 2026</p>
                <h2 className="text-2xl font-bold text-text-primary">
                  Personal Data Collected: None
                </h2>
                <p>
                  BedrockAchiever does not collect any personal data. This site has no backend
                  server — all file processing happens 100% in your browser.
                </p>
                <h2 className="text-2xl font-bold text-text-primary">File Processing</h2>
                <p>
                  Uploaded .mcworld files are processed in browser memory only and deleted when
                  you close the tab. Files are never transmitted over the network.
                </p>
                <h2 className="text-2xl font-bold text-text-primary">Cookies & Tracking</h2>
                <p>
                  This site uses no cookies, analytics, or tracking scripts. Only the language
                  preference is saved in localStorage.
                </p>
                <h2 className="text-2xl font-bold text-text-primary">Third-Party Services</h2>
                <p>
                  This site is statically hosted on Vercel. Standard Vercel server logs (IP,
                  request path) are governed by Vercel&apos;s terms. No other third-party data
                  sharing occurs.
                </p>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

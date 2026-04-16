import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { I18nProvider } from '@/components/providers/i18n-provider';

export const metadata: Metadata = {
  title: 'BedrockAchiever — MCBE 도전과제 복구소',
  description:
    '마인크래프트 배드락 에디션 월드의 도전과제를 한 번에 복구. 100% 브라우저 처리로 파일은 서버로 전송되지 않습니다.',
  keywords: ['Minecraft', 'Bedrock', '마인크래프트', '배드락', '도전과제', 'achievements'],
  openGraph: {
    title: 'BedrockAchiever',
    description: 'MCBE 도전과제 복구소',
    images: ['/og.png'],
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0A0E1A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen bg-bg-primary font-pretendard text-text-primary antialiased">
        <ThemeProvider>
          <I18nProvider>
            {children}
            <Toaster theme="dark" position="bottom-right" richColors />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

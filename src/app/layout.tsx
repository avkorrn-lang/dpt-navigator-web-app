import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Manrope } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const display = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
  display: 'swap',
});

const sans = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ДПТ-Навигатор — навыки диалектико-поведенческой терапии',
  description:
    'Подбор навыков ДПТ и радикально-открытой ДПТ под ваш профиль регуляции, эмоцию и её интенсивность. Не заменяет профессиональную психотерапию.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f4f1e8',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={`${display.variable} ${sans.variable} flex min-h-dvh flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line bg-cream/60">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <p className="font-display text-base font-semibold">ДПТ-Навигатор</p>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-mist">
              Приложение для самостоятельной тренировки навыков диалектико-поведенческой терапии
              (M. Linehan) и радикально-открытой ДПТ (T. R. Lynch). Не является медицинской услугой
              и не заменяет психотерапию. В остром состоянии обращайтесь к специалисту; при угрозе
              жизни звоните 112.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, BookOpenText, CalendarDays, Info } from 'lucide-react';
import clsx from 'clsx';

const NAV = [
  { href: '/', label: 'Навигатор', icon: Compass },
  { href: '/skills', label: 'Навыки', icon: BookOpenText },
  { href: '/history', label: 'История', icon: CalendarDays },
  { href: '/about', label: 'О проекте', icon: Info },
];

export default function Header() {
  const pathname = usePathname();

  const renderLink = (item: (typeof NAV)[number]) => {
    const active =
      item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={clsx(
          'inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors whitespace-nowrap',
          active ? 'bg-ink text-cream' : 'text-ink/70 hover:bg-cream hover:text-ink',
        )}
      >
        <Icon size={16} strokeWidth={2.2} />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <span className="grid size-9 place-items-center rounded-xl bg-ink text-cream">
            <Compass size={19} strokeWidth={2.2} />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[17px] font-bold">ДПТ-Навигатор</span>
            <span className="hidden text-[11px] font-medium text-mist sm:block">
              навыки для эмоционального равновесия
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">{NAV.map(renderLink)}</nav>
      </div>
      {/* Мобильное меню — уменьшенный шрифт и отступы, чтобы всё влезало в одну строку */}
      <nav className="nice-scroll flex gap-0.5 overflow-x-auto px-4 pb-2.5 md:hidden">
        {NAV.map((item) => {
          const active =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap',
                active ? 'bg-ink text-cream' : 'text-ink/70 hover:bg-cream hover:text-ink',
              )}
            >
              <Icon size={14} strokeWidth={2.2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

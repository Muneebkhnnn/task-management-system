import type { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <main className="grid min-h-screen grid-cols-1 md:grid-cols-[5fr_6fr]">
      <aside className="hidden flex-col justify-between bg-(--brand) p-12 text-white md:flex">
        <span className="text-xl font-bold tracking-[-0.02em] text-white">Taskline</span>
        <p className="max-w-[14ch] text-4xl font-bold leading-[1.15] tracking-[-0.03em]">
          Get the day’s work out of your head and onto a list.
        </p>
      </aside>
      <section className="grid place-items-center px-4 py-6">
        <div className="w-full max-w-100">
          <span className="mb-7 block text-xl font-bold tracking-[-0.02em] text-(--brand) md:hidden">
            Taskline
          </span>
          <h1 className="mb-1.5 text-[1.75rem] font-bold leading-[1.2] tracking-[-0.02em] md:text-[2rem]">{title}</h1>
          <p className="mb-6 text-(--muted)">{subtitle}</p>
          {children}
        </div>
      </section>
    </main>
  );
}

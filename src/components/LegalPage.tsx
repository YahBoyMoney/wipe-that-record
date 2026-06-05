import React from 'react'

interface LegalPageProps {
  title: string
  updated: string
  children: React.ReactNode
}

export function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <main className="bg-white dark:bg-slate-900 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-10 pb-8 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            {title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: {updated}
          </p>
        </header>

        <article className="prose-legal text-slate-700 dark:text-slate-300 leading-relaxed space-y-6">
          {children}
        </article>
      </div>

      <style>{`
        .prose-legal h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: rgb(15 23 42);
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        .dark .prose-legal h2 { color: rgb(241 245 249); }
        .prose-legal h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: rgb(30 41 59);
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .dark .prose-legal h3 { color: rgb(226 232 240); }
        .prose-legal p { margin-bottom: 1rem; }
        .prose-legal ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
        .prose-legal ul li { margin-bottom: 0.4rem; }
        .prose-legal a { color: rgb(37 99 235); text-decoration: underline; }
        .prose-legal a:hover { color: rgb(29 78 216); }
        .prose-legal strong { color: rgb(15 23 42); font-weight: 600; }
        .dark .prose-legal strong { color: rgb(241 245 249); }
      `}</style>
    </main>
  )
}

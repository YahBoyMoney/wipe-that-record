import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How It Works | California Record Cleaning | Wipe That Record',
  description:
    'How our California record-cleaning process works: check eligibility, get your recommended path, prepare your petition, and file with the court. Court timelines vary by county.',
};

const steps = [
  {
    title: 'Check your eligibility',
    body: 'Take the free 2-minute assessment. We ask about your conviction type, county, probation status, and goals to see which options may apply.',
  },
  {
    title: 'Get your recommended path',
    body: 'Based on your answers, we point you to the option that usually fits: the DIY kit, expert review, or attorney-managed full service.',
  },
  {
    title: 'Prepare your petition',
    body: 'With the DIY kit you get California-focused forms, step-by-step instructions, and samples. With expert review or full service, a specialist or attorney prepares your paperwork.',
  },
  {
    title: 'File with the court',
    body: 'You (or your attorney, with full service) file the petition with the correct court for your county. The court reviews it on its own schedule.',
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[var(--parchment)]">
      <section className="ink-texture py-20 text-[var(--text-ink)]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[var(--brass)]" />
            <span className="eyebrow text-[var(--brass)]">The process</span>
          </div>
          <h1 className="font-display mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">How it works</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-ink-muted)]">
            A clear, four-step process for pursuing California record relief. You can get started in
            minutes; court approval depends on the court, case type, and eligibility.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ol className="space-y-6">
            {steps.map((step, i) => (
              <li key={step.title} className="card-paper flex gap-5 p-6">
                <span className="font-display flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-[var(--brass)] text-lg font-semibold text-[var(--brass-600)]">
                  {i + 1}
                </span>
                <div>
                  <h2 className="font-display text-lg font-semibold text-[var(--ink)]">{step.title}</h2>
                  <p className="mt-1 leading-relaxed text-[var(--text-muted)]">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 rounded-xl border border-[var(--brass)]/30 bg-[var(--brass-100)]/40 p-7 text-center">
            <p className="font-display text-xl font-semibold text-[var(--ink)]">Ready to see your options?</p>
            <Link href="/eligibility" className="btn btn-primary mt-5">
              Check eligibility free
            </Link>
          </div>

          <p className="mt-8 text-sm leading-relaxed text-[var(--text-muted)]">
            This page is general information and not legal advice. True expungement does not exist in
            California; eligible cases may qualify for dismissal, sealing, felony reduction, or other
            relief. Court timelines vary by county.
          </p>
        </div>
      </section>
    </main>
  );
}

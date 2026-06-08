import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Los Angeles Record Cleaning | California Record Relief | Wipe That Record',
  description:
    'Record-cleaning help for Los Angeles County. We prepare California forms for LA Superior Court filings in Downtown LA, Santa Monica, Van Nuys, and surrounding courts. Court timelines vary by county.',
  keywords:
    'Los Angeles expungement, LA criminal record clearing, dismissal, record sealing, LA Superior Court',
};

const courts = [
  'Stanley Mosk (Downtown LA)',
  'Santa Monica',
  'Van Nuys',
  'Pasadena',
  'Long Beach',
  'Norwalk',
];

const benefits = [
  {
    title: 'Built around LA Superior Court',
    body: 'LA County has its own filing procedures across multiple courthouses. Our forms and guidance are prepared for California courts so your paperwork matches what the court expects.',
  },
  {
    title: 'County-specific filing guidance',
    body: 'Where you file in Los Angeles depends on where your case was originally heard. We help you identify the right courthouse and prepare the matching California forms.',
  },
  {
    title: 'Choose the level of help you need',
    body: 'Prepare your own paperwork with the DIY kit, add a specialist review before filing, or hand the whole process to an attorney with Full Service.',
  },
];

export default function LosAngelesPage() {
  return (
    <main className="min-h-screen bg-[var(--parchment)]">
      {/* Hero */}
      <section className="ink-texture py-20 text-[var(--text-ink)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[var(--brass)]" />
            <span className="eyebrow text-[var(--brass)]">Los Angeles County, California</span>
          </div>
          <h1 className="font-display mt-6 max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Clean your record in Los Angeles County
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-ink-muted)]">
            We help people across Los Angeles County pursue California record relief &mdash; dismissal,
            sealing, or felony reduction where eligible. Our forms and guidance are built around LA
            Superior Court procedures. Filing processes and court timelines vary by county and case type.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/eligibility" className="btn btn-brass">
              Check eligibility free
            </Link>
            <Link href="/#plans" className="btn btn-ghost-ink">
              See service options
            </Link>
          </div>
        </div>
      </section>

      {/* Why LA */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-[var(--ink)] sm:text-3xl">
            Record-cleaning help built for LA
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="card-paper p-7">
                <h3 className="font-display text-lg font-semibold text-[var(--ink)]">{b.title}</h3>
                <p className="mt-2 text-[var(--text-muted)]">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courts served */}
      <section className="py-4 pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="rounded-xl border border-[var(--brass)]/30 bg-[var(--brass-100)]/40 p-7">
            <h2 className="font-display text-lg font-semibold text-[var(--ink)]">
              LA Superior Court locations we prepare filings for
            </h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Where you file depends on where your case was originally heard. We help you identify the
              correct courthouse.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {courts.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-sm font-medium text-[var(--text)]"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--line)] bg-[var(--paper)] py-16 px-4 text-center sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-[var(--ink)] sm:text-3xl">
            Start with a free eligibility check
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-muted)]">
            Answer a few private questions to see which California record-cleaning options may apply to
            your LA County case. This is not legal advice, and results vary by case.
          </p>
          <Link href="/eligibility" className="btn btn-primary mt-7">
            Check eligibility free
          </Link>
          <p className="mx-auto mt-8 max-w-2xl text-xs leading-relaxed text-[var(--text-muted)]">
            Wipe That Record provides California-focused record-cleaning support. We do not control
            court schedules and cannot guarantee a specific outcome or timeline. With Full Service, an
            attorney-client relationship is formed only after a written engagement agreement is signed.
          </p>
        </div>
      </section>
    </main>
  );
}

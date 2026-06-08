import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'California Service Areas | Wipe That Record',
  description:
    'We help with record cleaning across California, including Los Angeles, Orange County, San Bernardino, Riverside, San Diego, and more. Court timelines vary by county.',
};

const featured = [
  { href: '/los-angeles', name: 'Los Angeles County', note: 'LA Superior Court and surrounding cities' },
  { href: '/orange-county', name: 'Orange County', note: 'Santa Ana, Anaheim, and OC courts' },
];

const counties = [
  'San Bernardino',
  'Riverside',
  'San Diego',
  'Ventura',
  'Kern',
  'Sacramento',
  'Fresno',
  'Santa Clara',
  'Alameda',
  'San Francisco',
];

export default function LocationsPage() {
  return (
    <main className="min-h-screen bg-[var(--parchment)]">
      <section className="ink-texture py-20 text-[var(--text-ink)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[var(--brass)]" />
            <span className="eyebrow text-[var(--brass)]">Statewide California</span>
          </div>
          <h1 className="font-display mt-6 max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Where we help in California
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-ink-muted)]">
            Our forms and guidance are built around California courts and procedures. Each county has
            its own filing process, and court timelines vary by county and case type.
          </p>
          <Link href="/eligibility" className="btn btn-brass mt-8">
            Check eligibility free
          </Link>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">Featured areas</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {featured.map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className="card-paper block p-7 transition-colors hover:border-[var(--brass)]"
              >
                <h3 className="font-display text-lg font-semibold text-[var(--ink)]">{f.name}</h3>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{f.note}</p>
                <span className="link-ink mt-4 inline-block">View page &rarr;</span>
              </Link>
            ))}
          </div>

          <h2 className="font-display mt-14 text-2xl font-semibold text-[var(--ink)]">Other California counties we serve</h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            We support record-cleaning paperwork statewide. Start with a free eligibility check for
            your county.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {counties.map((c) => (
              <span
                key={c}
                className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-sm font-medium text-[var(--text)]"
              >
                {c} County
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

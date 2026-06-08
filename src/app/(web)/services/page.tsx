import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'California Record-Cleaning Services | Wipe That Record',
  description:
    'Explore California record-cleaning services: misdemeanor dismissal, DUI record relief, felony reduction, and arrest record sealing. DIY, expert review, and attorney-managed options.',
};

const services = [
  {
    href: '/services/misdemeanor-dismissal',
    title: 'Misdemeanor Dismissal',
    forWho: 'People with eligible misdemeanor convictions who have completed probation.',
    helps: 'Petition to dismiss eligible misdemeanors under California Penal Code 1203.4.',
    cannot: 'Cannot guarantee approval; the court decides based on your case and eligibility.',
    fits: 'DIY Kit for straightforward cases; Expert Review if you are unsure.',
  },
  {
    href: '/services/dui-record-relief',
    title: 'DUI Record Relief',
    forWho: 'People with an eligible DUI conviction seeking to limit its impact.',
    helps: 'Prepare a petition to dismiss an eligible DUI and understand what relief does and does not do.',
    cannot: 'A dismissed DUI may still be usable as a prior in some circumstances and visible to certain agencies.',
    fits: 'DIY Kit or Expert Review depending on complexity.',
  },
  {
    href: '/services/felony-reduction',
    title: 'Felony Reduction',
    forWho: 'People with certain "wobbler" felony convictions who may qualify for reduction.',
    helps: 'Petition to reduce an eligible felony to a misdemeanor under Penal Code 17(b), often before dismissal.',
    cannot: 'Not all felonies are eligible; eligibility depends on the offense and your record.',
    fits: 'Expert Review or Full Service for complex cases.',
  },
  {
    href: '/services/record-sealing',
    title: 'Arrest Record Sealing',
    forWho: 'People arrested without a conviction who want the arrest sealed.',
    helps: 'Petition to seal an arrest record under Penal Code 851.91 where eligible.',
    cannot: 'Sealed records can still be accessed by some government agencies and for certain purposes.',
    fits: 'DIY Kit or Expert Review.',
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[var(--parchment)]">
      <section className="ink-texture py-20 text-[var(--text-ink)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[var(--brass)]" />
            <span className="eyebrow text-[var(--brass)]">Relief paths</span>
          </div>
          <h1 className="font-display mt-6 max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            What kind of record help do you need?
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-ink-muted)]">
            We help Californians pursue several forms of record relief. True expungement does not exist
            in California, so we focus on the options that may actually apply to your case.
          </p>
          <Link href="/eligibility" className="btn btn-brass mt-8">
            Check eligibility free
          </Link>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((s) => (
              <div key={s.href} className="card-paper flex flex-col p-7">
                <h2 className="font-display text-xl font-semibold text-[var(--ink)]">{s.title}</h2>
                <dl className="mt-5 space-y-4 text-sm">
                  <div>
                    <dt className="eyebrow text-[var(--brass-600)]">Who it&rsquo;s for</dt>
                    <dd className="mt-1 text-[var(--text-muted)]">{s.forWho}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow text-[var(--brass-600)]">What it can help with</dt>
                    <dd className="mt-1 text-[var(--text-muted)]">{s.helps}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow text-[var(--brass-600)]">What it cannot guarantee</dt>
                    <dd className="mt-1 text-[var(--text-muted)]">{s.cannot}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow text-[var(--brass-600)]">Which plan usually fits</dt>
                    <dd className="mt-1 text-[var(--text-muted)]">{s.fits}</dd>
                  </div>
                </dl>
                <Link href={s.href} className="link-ink mt-6 inline-block">
                  Learn more &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

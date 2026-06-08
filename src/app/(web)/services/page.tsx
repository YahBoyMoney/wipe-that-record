import { Metadata } from 'next';
import { EligibilityCtaLink } from '@/components/EligibilityCtaLink';
import { ServiceCardLink } from '@/components/ServiceCardLink';

export const metadata: Metadata = {
  title: 'California Record-Cleaning Services | Wipe That Record',
  description:
    'Explore California record-cleaning services: misdemeanor dismissal, DUI record relief, felony reduction, and arrest record sealing. DIY, expert review, and attorney-managed options.',
};

const services = [
  {
    slug: 'misdemeanor-dismissal',
    href: '/services/misdemeanor-dismissal',
    title: 'Misdemeanor Dismissal',
    forWho: 'People with eligible misdemeanor convictions who have completed probation.',
    helps: 'Petition to dismiss eligible misdemeanors under California Penal Code 1203.4.',
    cannot: 'Cannot guarantee approval; the court decides based on your case and eligibility.',
    fits: 'DIY Kit for straightforward cases; Expert Review if you are unsure.',
  },
  {
    slug: 'dui-record-relief',
    href: '/services/dui-record-relief',
    title: 'DUI Record Relief',
    forWho: 'People with an eligible DUI conviction seeking to limit its impact.',
    helps: 'Prepare a petition to dismiss an eligible DUI and understand what relief does and does not do.',
    cannot: 'A dismissed DUI may still be usable as a prior in some circumstances and visible to certain agencies.',
    fits: 'DIY Kit or Expert Review depending on complexity.',
  },
  {
    slug: 'felony-reduction',
    href: '/services/felony-reduction',
    title: 'Felony Reduction',
    forWho: 'People with certain "wobbler" felony convictions who may qualify for reduction.',
    helps: 'Petition to reduce an eligible felony to a misdemeanor under Penal Code 17(b), often before dismissal.',
    cannot: 'Not all felonies are eligible; eligibility depends on the offense and your record.',
    fits: 'Expert Review or Full Service for complex cases.',
  },
  {
    slug: 'record-sealing',
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
      <section className="ink-texture overflow-hidden py-20 text-[var(--text-ink)] sm:py-24">
        <div className="mx-auto grid max-w-6xl items-end gap-10 px-4 sm:px-6 lg:grid-cols-[7fr_5fr]">
          <div>
            <span className="eyebrow-line eyebrow text-[var(--brass)]">Relief paths</span>
            <h1 className="font-display display-xl mt-5 font-semibold text-white">
              What kind of record help do you need?
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--text-ink-muted)]">
              We help Californians pursue several forms of record relief. True expungement does not
              exist in California, so we focus on the options that may actually apply to your case.
            </p>
            <EligibilityCtaLink
              sourcePage="/services"
              ctaLabel="services_hero"
              className="btn btn-brass mt-8"
            >
              Check eligibility free
            </EligibilityCtaLink>
          </div>
          <div className="hidden lg:block">
            <div className="rounded-xl border border-[var(--line-ink)] bg-white/[0.04] p-7">
              <span className="eyebrow text-[var(--brass)]">Not sure which applies?</span>
              <p className="mt-3 text-[var(--text-ink-muted)]">
                The free 2-minute review reads your conviction type, county, and timeline, then points
                you to the paths that may fit &mdash; before you pay anything.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-px overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--line)] md:grid-cols-2">
            {services.map((s, i) => (
              <div key={s.href} className="card-lift flex flex-col bg-[var(--paper)] p-8">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-2xl font-semibold text-[var(--brass)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-display text-xl font-semibold text-[var(--ink)]">{s.title}</h2>
                </div>
                <dl className="mt-6 space-y-4 text-sm">
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
                <ServiceCardLink href={s.href} service={s.slug} className="link-ink mt-6 inline-block">
                  Learn more &rarr;
                </ServiceCardLink>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

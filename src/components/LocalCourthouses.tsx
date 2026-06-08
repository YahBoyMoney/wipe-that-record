import Image from 'next/image';
import { EligibilityCtaLink } from '@/components/EligibilityCtaLink';
import sanBernardino from '../../public/images/courthouses/san-bernardino-county-courthouse.webp';
import riverside from '../../public/images/courthouses/riverside-county-courthouse.webp';

interface LocalCourthousesProps {
  /** Analytics source-page tag for the CTA, e.g. "/" or "/locations". */
  sourcePage: string;
}

const courthouses = [
  {
    src: sanBernardino,
    county: 'San Bernardino County',
    courthouse: 'San Bernardino County Courthouse',
    alt: 'The San Bernardino County Courthouse, a historic stone building in San Bernardino, California, where Inland Empire record-relief petitions are filed.',
    note: 'Inland Empire filings, including San Bernardino Superior Court.',
    credit: {
      author: 'Einbierbitte',
      license: 'CC BY-SA 3.0',
      licenseHref: 'https://creativecommons.org/licenses/by-sa/3.0/',
      sourceHref: 'https://commons.wikimedia.org/wiki/File:San_Bernardino_County_Courthouse_2.jpg',
    },
  },
  {
    src: riverside,
    county: 'Riverside County',
    courthouse: 'Riverside County Courthouse',
    alt: 'The historic 1903 Riverside County Courthouse, a neoclassical landmark in Riverside, California, serving Riverside County record-relief cases.',
    note: 'Riverside Superior Court and surrounding Inland Empire cities.',
    credit: {
      author: 'michael h j c',
      license: 'CC BY-SA 2.0',
      licenseHref: 'https://creativecommons.org/licenses/by-sa/2.0/',
      sourceHref: 'https://commons.wikimedia.org/wiki/File:Riverside_County_Courthouse,_1903.jpg',
    },
  },
];

/**
 * Local trust/coverage section featuring the San Bernardino and Riverside
 * county courthouses. Reinforces that the service is built around the actual
 * Inland Empire courts where petitions are filed.
 */
export function LocalCourthouses({ sourcePage }: LocalCourthousesProps) {
  return (
    <section className="section-paper border-y border-[var(--line)] py-20 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="eyebrow-line eyebrow text-[var(--brass-600)]">Inland Empire coverage</span>
          <h2 className="font-display display-lg mt-4 font-semibold text-[var(--ink)]">
            Built around the courts where your case is actually filed.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[var(--text-muted)]">
            Record relief is decided county by county. Our forms and guidance follow the local
            procedures at the San Bernardino and Riverside courthouses &mdash; two of the busiest
            superior courts in Southern California.
          </p>
        </div>

        {/* Asymmetric editorial pair: larger lead image, offset second */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[7fr_5fr] lg:gap-10">
          {courthouses.map((c, i) => (
            <figure
              key={c.county}
              className={
                i === 1
                  ? 'group overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--paper)] lg:mt-16 lg:self-start'
                  : 'group overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--paper)]'
              }
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={c.src}
                  alt={c.alt}
                  placeholder="blur"
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--ink)]/35 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-[var(--ink)]/85 px-3 py-1 text-xs font-medium tracking-wide text-[var(--text-ink)]">
                  {c.county}
                </span>
              </div>
              <figcaption className="p-6">
                <h3 className="font-display text-lg font-semibold text-[var(--ink)]">{c.courthouse}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">{c.note}</p>
                <p className="mt-3 text-[0.7rem] leading-relaxed text-[var(--text-muted)]/80">
                  Photo by {c.credit.author},{' '}
                  <a
                    href={c.credit.sourceHref}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="underline decoration-[var(--line)] underline-offset-2 hover:text-[var(--brass-600)]"
                  >
                    via Wikimedia Commons
                  </a>
                  ,{' '}
                  <a
                    href={c.credit.licenseHref}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="underline decoration-[var(--line)] underline-offset-2 hover:text-[var(--brass-600)]"
                  >
                    {c.credit.license}
                  </a>
                  . Cropped &amp; optimized for web.
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">
            Independent service. Not affiliated with any court or government agency. Court timelines
            and procedures vary by county and case type.
          </p>
          <EligibilityCtaLink
            sourcePage={sourcePage}
            ctaLabel="local_courthouses"
            className="btn btn-primary whitespace-nowrap"
          >
            Check eligibility free
          </EligibilityCtaLink>
        </div>
      </div>
    </section>
  );
}

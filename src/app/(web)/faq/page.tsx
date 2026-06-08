import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ | California Record Cleaning | Wipe That Record',
  description:
    'Answers about California record cleaning: is this legal advice, what relief does and does not do, employer background checks, court timelines, and refunds.',
};

const faqs = [
  {
    q: 'Is this legal advice?',
    a: 'The DIY kit is document-preparation support, not legal advice. Using this site does not create an attorney-client relationship. With full service, an attorney-client relationship is formed only after a written engagement agreement is signed.',
  },
  {
    q: 'Will this erase my record completely?',
    a: 'True expungement does not exist in California. Depending on your case, you may be eligible for relief such as dismissal, record sealing, felony reduction, or automatic record relief. These options limit the impact of a record rather than deleting it.',
  },
  {
    q: 'Can employers still see my record?',
    a: 'Record relief can limit what appears in many public and employment background checks, but some government agencies, licensing bodies, and legally authorized employers may still access certain records.',
  },
  {
    q: 'What does record relief do and not do?',
    a: 'It can update a disposition, seal an arrest, or reduce a felony to a misdemeanor where eligible, which helps with many private background checks. It does not guarantee that every entity is barred from seeing the record, and it does not change the underlying facts of the case.',
  },
  {
    q: 'How long does the court take?',
    a: 'You can get started and prepare paperwork quickly, but court timelines vary by county, case type, and eligibility. We do not control court schedules and cannot guarantee a specific approval date.',
  },
  {
    q: 'Do I need an attorney?',
    a: 'Many straightforward cases can be handled with the DIY kit. If your case is complex, or you want someone to manage filing and any court appearances, expert review or full service may be a better fit.',
  },
  {
    q: 'What happens after I buy the DIY kit?',
    a: 'You get instant access to the California forms package, step-by-step instructions, and sample completed forms, plus email support. You can upgrade to expert review or full service at any time.',
  },
  {
    q: 'What if I don’t qualify?',
    a: 'Start with the free eligibility check before paying. If you buy the DIY kit and your case does not match your eligibility after review, you are covered by our 30-day refund policy.',
  },
  {
    q: 'What counties do you support?',
    a: 'We support California record-cleaning paperwork statewide, with dedicated information for areas like Los Angeles and Orange County. Filing processes and timelines vary by county.',
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-[var(--parchment)]">
      <section className="ink-texture py-20 text-[var(--text-ink)]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[var(--brass)]" />
            <span className="eyebrow text-[var(--brass)]">Answers</span>
          </div>
          <h1 className="font-display mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-ink-muted)]">
            Straight answers about California record cleaning, what to expect, and how our service works.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-3xl space-y-3 px-4 sm:px-6">
          {faqs.map((faq) => (
            <details key={faq.q} className="group card-paper">
              <summary className="flex cursor-pointer items-center justify-between p-5">
                <h2 className="pr-4 font-semibold text-[var(--ink)]">{faq.q}</h2>
                <span className="text-xl leading-none text-[var(--brass-600)] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="px-5 pb-5 leading-relaxed text-[var(--text-muted)]">{faq.a}</p>
            </details>
          ))}

          <div className="mt-8 rounded-xl border border-[var(--brass)]/30 bg-[var(--brass-100)]/40 p-7 text-center">
            <p className="font-display text-xl font-semibold text-[var(--ink)]">Still have questions about your case?</p>
            <Link href="/contact" className="btn btn-primary mt-5">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

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
    <main className="min-h-screen bg-white">
      <section className="bg-[#0f2747] py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold sm:text-4xl">Frequently asked questions</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Straight answers about California record cleaning, what to expect, and how our service works.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-3xl space-y-4 px-4 sm:px-6">
          {faqs.map((faq) => (
            <details key={faq.q} className="group rounded-lg border border-slate-200">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg p-5 hover:bg-slate-50">
                <h2 className="pr-4 font-semibold text-slate-900">{faq.q}</h2>
                <span className="text-slate-500 transition-transform group-open:rotate-180">&#9662;</span>
              </summary>
              <p className="px-5 pb-5 leading-relaxed text-slate-600">{faq.a}</p>
            </details>
          ))}

          <div className="mt-8 rounded-xl bg-slate-50 p-6 text-center">
            <p className="font-semibold text-slate-900">Still have questions about your case?</p>
            <Link
              href="/contact"
              className="mt-4 inline-block rounded-lg bg-[#0f2747] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#163a66]"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

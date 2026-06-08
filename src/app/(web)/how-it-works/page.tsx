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
    <main className="min-h-screen bg-white">
      <section className="bg-[#0f2747] py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold sm:text-4xl">How it works</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            A clear, four-step process for pursuing California record relief. You can get started in
            minutes; court approval depends on the court, case type, and eligibility.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ol className="space-y-8">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-5">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#0f2747] font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{step.title}</h2>
                  <p className="mt-1 text-slate-600">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 rounded-2xl bg-slate-50 p-6 text-center">
            <p className="font-semibold text-slate-900">Ready to see your options?</p>
            <Link
              href="/eligibility"
              className="mt-4 inline-block rounded-lg bg-[#0f2747] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#163a66]"
            >
              Check Eligibility Free
            </Link>
          </div>

          <p className="mt-8 text-sm text-slate-500">
            This page is general information and not legal advice. True expungement does not exist in
            California; eligible cases may qualify for dismissal, sealing, felony reduction, or other
            relief. Court timelines vary by county.
          </p>
        </div>
      </section>
    </main>
  );
}

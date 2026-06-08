'use client';

import { LeadCaptureForm } from '@/components/LeadCaptureForm';

export default function EligibilityPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-[#0f2747] py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold sm:text-4xl">Free California Eligibility Check</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Answer a few private questions to see which California record-cleaning options may apply to
            your case &mdash; including dismissal, sealing, felony reduction, or attorney-managed support.
            This is not legal advice, and results vary by case.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-md px-4 sm:px-6">
          <LeadCaptureForm variant="inline" leadMagnet="eligibility-page" />
        </div>
      </section>
    </main>
  );
}

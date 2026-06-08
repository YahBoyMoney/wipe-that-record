import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact | Wipe That Record',
  description:
    'Contact Wipe That Record for help with California record cleaning. Email support and a free eligibility check are available.',
};

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@wipethatrecord.com';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-[#0f2747] py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold sm:text-4xl">Contact us</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Have a question about your situation or our service? We&rsquo;re happy to help point you in
            the right direction.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900">Email support</h2>
              <p className="mt-2 text-slate-600">
                Reach our support team and we&rsquo;ll get back to you.
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="mt-4 inline-block font-semibold text-[#0f2747] hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900">Not sure where to start?</h2>
              <p className="mt-2 text-slate-600">
                The free eligibility check is the fastest way to see which options may apply to your
                case.
              </p>
              <Link
                href="/eligibility"
                className="mt-4 inline-block rounded-lg bg-[#0f2747] px-5 py-2.5 font-semibold text-white transition-colors hover:bg-[#163a66]"
              >
                Check Eligibility Free
              </Link>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-6">
            <h2 className="text-lg font-bold text-slate-900">Service area</h2>
            <p className="mt-2 text-slate-600">
              Wipe That Record provides California-focused record-cleaning support statewide, including
              Los Angeles and Orange County. Filing processes and court timelines vary by county.
            </p>
          </div>

          <p className="mt-8 text-sm text-slate-500">
            Contacting us does not create an attorney-client relationship. Please do not send sensitive
            or confidential case details until an engagement agreement is in place.
          </p>
        </div>
      </section>
    </main>
  );
}

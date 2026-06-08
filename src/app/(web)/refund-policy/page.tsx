import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund Policy | Wipe That Record',
  description:
    'Our 30-day refund policy for the California record-cleaning DIY kit and related services.',
};

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@wipethatrecord.com';
const LAST_UPDATED = 'June 8, 2026';

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-[#0f2747] py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold sm:text-4xl">Refund Policy</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Last updated {LAST_UPDATED}
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">30-day refund</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              If you purchase the DIY kit and your case does not match your eligibility after review, or
              you are otherwise not satisfied, you may request a refund within 30 days of purchase.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">How to request a refund</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              Email{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-[#0f2747] hover:underline">
                {SUPPORT_EMAIL}
              </a>{' '}
              with the email address used at checkout and a brief note about your request. We will
              process approved refunds to your original payment method.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">What is not covered</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              Court filing fees paid directly to a court are set by the court and are not refundable by
              us. For full service, work already performed by a specialist or attorney may be deducted
              from a refund as described in your engagement agreement. We cannot refund based on a
              court&rsquo;s decision or timeline, which are outside our control.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">Not sure yet?</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              The free eligibility check is the best way to understand your options before you buy.
            </p>
            <Link
              href="/eligibility"
              className="mt-4 inline-block rounded-lg bg-[#0f2747] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#163a66]"
            >
              Check Eligibility Free
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

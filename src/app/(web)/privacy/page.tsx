import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Wipe That Record',
  description:
    'How Wipe That Record collects, uses, and protects the information you share when using our California record-cleaning service.',
};

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@wipethatrecord.com';
const LAST_UPDATED = 'June 8, 2026';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-[#0f2747] py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Last updated {LAST_UPDATED}
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Information we collect</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              When you use our eligibility check or purchase a product, we collect the information you
              provide, such as your name, email address, and details about your case that you choose to
              share. Payment is processed by our payment provider; we do not store full card numbers on
              our servers.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">How we use your information</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              We use your information to provide the service you requested, prepare and deliver your
              record-cleaning documents, respond to your questions, process payments, and send you
              service-related updates. We may use aggregated, non-identifying data to improve our site.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">Sharing your information</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              We do not sell your personal information. We share information only with service providers
              that help us operate (for example, payment processing, email delivery, and hosting), and
              only as needed to provide the service. We may disclose information if required by law.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">Data retention and security</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              We retain your information for as long as needed to provide the service and to meet legal
              or accounting requirements. We use reasonable administrative and technical safeguards to
              protect your information, though no method of transmission or storage is completely secure.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">Your choices</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              You may request access to, correction of, or deletion of your personal information by
              contacting us. You can opt out of marketing emails using the unsubscribe link in any
              message.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">Contact us</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              Questions about this policy? Email{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-[#0f2747] hover:underline">
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

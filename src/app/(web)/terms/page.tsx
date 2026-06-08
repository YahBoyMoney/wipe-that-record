import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Wipe That Record',
  description:
    'The terms that govern your use of Wipe That Record and our California record-cleaning document-preparation service.',
};

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@wipethatrecord.com';
const LAST_UPDATED = 'June 8, 2026';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-[#0f2747] py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold sm:text-4xl">Terms of Service</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Last updated {LAST_UPDATED}
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Acceptance of terms</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              By using this site or purchasing a product, you agree to these terms. If you do not agree,
              please do not use the service.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">What we provide</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              We provide California-focused document-preparation support and information to help you
              pursue record relief such as dismissal, arrest sealing, or felony reduction where eligible.
              The DIY kit is a self-help product and is not legal advice. Using this site does not create
              an attorney-client relationship. With full service, an attorney-client relationship is
              formed only after a written engagement agreement is signed.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">No guarantee of outcome</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              True expungement does not exist in California, and we cannot guarantee that any petition
              will be approved or that a court will act within a particular timeframe. Eligibility and
              outcomes depend on your specific case, the county, and the court&rsquo;s own schedule.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">Your responsibilities</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              You are responsible for providing accurate information and for reviewing and filing your
              documents with the correct court. The accuracy of your paperwork depends on the accuracy of
              the information you provide.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">Payments and refunds</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              Prices are shown at checkout. Refunds are governed by our{' '}
              <a href="/refund-policy" className="font-semibold text-[#0f2747] hover:underline">
                Refund Policy
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">Limitation of liability</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              To the extent permitted by law, our liability for any claim arising from the service is
              limited to the amount you paid for the product giving rise to the claim.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">Contact us</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              Questions about these terms? Email{' '}
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

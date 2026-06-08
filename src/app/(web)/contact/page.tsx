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
    <main className="min-h-screen bg-[var(--parchment)]">
      <section className="ink-texture py-20 text-[var(--text-ink)]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[var(--brass)]" />
            <span className="eyebrow text-[var(--brass)]">Get in touch</span>
          </div>
          <h1 className="font-display mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">Contact us</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-ink-muted)]">
            Have a question about your situation or our service? We&rsquo;re happy to help point you in
            the right direction.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="card-paper p-7">
              <h2 className="font-display text-lg font-semibold text-[var(--ink)]">Email support</h2>
              <p className="mt-2 text-[var(--text-muted)]">
                Reach our support team and we&rsquo;ll get back to you.
              </p>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="link-ink mt-4 inline-block">
                {SUPPORT_EMAIL}
              </a>
            </div>

            <div className="card-paper p-7">
              <h2 className="font-display text-lg font-semibold text-[var(--ink)]">Not sure where to start?</h2>
              <p className="mt-2 text-[var(--text-muted)]">
                The free eligibility check is the fastest way to see which options may apply to your
                case.
              </p>
              <Link href="/eligibility" className="btn btn-primary mt-4 text-sm">
                Check eligibility free
              </Link>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-[var(--brass)]/30 bg-[var(--brass-100)]/40 p-7">
            <h2 className="font-display text-lg font-semibold text-[var(--ink)]">Service area</h2>
            <p className="mt-2 text-[var(--text-muted)]">
              Wipe That Record provides California-focused record-cleaning support statewide, including
              Los Angeles and Orange County. Filing processes and court timelines vary by county.
            </p>
          </div>

          <p className="mt-8 text-sm leading-relaxed text-[var(--text-muted)]">
            Contacting us does not create an attorney-client relationship. Please do not send sensitive
            or confidential case details until an engagement agreement is in place.
          </p>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Legal Disclaimer | Wipe That Record',
  description:
    'Important legal disclaimers regarding the information and services available on wipethatrecord.com.',
  alternates: { canonical: '/disclaimer' },
}

export default function Disclaimer() {
  return (
    <LegalPage title="Legal Disclaimer" updated="June 5, 2026">
      <h2>Attorney Advertising</h2>
      <p>
        This website is an advertisement for legal services. The information provided on{' '}
        <a href="https://wipethatrecord.com">wipethatrecord.com</a> (the &ldquo;Site&rdquo;) is
        published by The Berhe Law Firm, APC. The attorney responsible for the content of this Site
        is <strong>Tamerat S. Berhe</strong>, California State Bar No. 298992, with offices at 901
        Via Piemonte, Suite 230, Ontario, CA 91764.
      </p>

      <h2>Not Legal Advice</h2>
      <p>
        Nothing on this Site constitutes legal advice or a legal opinion. The information is
        provided for general educational and informational purposes only. The law changes
        frequently and varies by jurisdiction and individual facts. <strong>You should not act or
        rely on any information on this Site without seeking the advice of a qualified attorney
        licensed in your state.</strong>
      </p>

      <h2>No Attorney-Client Relationship</h2>
      <p>
        Use of this Site, purchase of the DIY Expungement Kit, submission of an eligibility
        questionnaire, or contact through the Site does <strong>not</strong> create an
        attorney-client relationship between you and The Berhe Law Firm, APC. An attorney-client
        relationship is formed only upon execution of a written engagement agreement and payment
        of any applicable retainer.
      </p>
      <p>
        Communications sent through the Site or by email are not necessarily confidential or
        protected by the attorney-client privilege until an engagement agreement is in place.
        Please do not send sensitive or confidential information through unsecured channels.
      </p>

      <h2>DIY Service Is Not Legal Representation</h2>
      <p>
        The DIY Expungement Kit and Expert Review options are{' '}
        <strong>self-help legal products</strong>. They provide educational materials, court forms,
        and assistance with form completion, but they do not constitute legal representation. If
        you purchase one of these tiers:
      </p>
      <ul>
        <li>You are representing yourself in court (pro se / pro per).</li>
        <li>We do not appear on your behalf or sign documents as your attorney of record.</li>
        <li>
          You are responsible for filing documents, meeting court deadlines, attending hearings,
          and complying with all procedural rules.
        </li>
      </ul>
      <p>
        Full attorney representation is available through our <strong>Full Service</strong> tier
        and requires a separate signed engagement agreement.
      </p>

      <h2>No Guarantee of Outcome</h2>
      <p>
        Statements regarding success rates, processing times, and prior client outcomes describe
        general experience and do not guarantee a particular result in your case. Every case is
        unique, and the outcome of any legal matter depends on the specific facts, the discretion
        of the court, and other factors outside our control.
      </p>

      <h2>Testimonials</h2>
      <p>
        Testimonials and client stories on this Site are based on real experiences but have been
        edited for clarity and length, and client names and likenesses may have been changed to
        protect privacy. Past results do not predict or guarantee future outcomes.
      </p>

      <h2>External Links</h2>
      <p>
        This Site may contain links to third-party websites. We do not control and are not
        responsible for the content, accuracy, or practices of those websites. Links are provided
        for convenience and do not constitute an endorsement.
      </p>

      <h2>Jurisdiction</h2>
      <p>
        The Berhe Law Firm, APC is licensed to practice law only in the State of California. We
        accept matters only involving California courts and California state law. If you reside
        outside California or need representation in another jurisdiction, please consult a
        licensed attorney in your state.
      </p>

      <h2>Contact</h2>
      <p>
        <strong>The Berhe Law Firm, APC</strong>
        <br />
        Attorney Tamerat S. Berhe — CA Bar No. 298992
        <br />
        901 Via Piemonte, Suite 230
        <br />
        Ontario, CA 91764
        <br />
        Phone: <a href="tel:+19096096685">(909) 609-6685</a>
        <br />
        Email: <a href="mailto:support@wipethatrecord.com">support@wipethatrecord.com</a>
        <br />
        Bar verification:{' '}
        <a
          href="https://apps.calbar.ca.gov/attorney/Licensee/Detail/298992"
          target="_blank"
          rel="noopener noreferrer"
        >
          State Bar of California profile
        </a>
      </p>
    </LegalPage>
  )
}

import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Terms of Service | Wipe That Record',
  description:
    'The terms and conditions governing your use of wipethatrecord.com and our California expungement services.',
  alternates: { canonical: '/terms' },
}

export default function TermsOfService() {
  return (
    <LegalPage title="Terms of Service" updated="June 5, 2026">
      <p>
        These Terms of Service (&ldquo;<strong>Terms</strong>&rdquo;) govern your use of{' '}
        <a href="https://wipethatrecord.com">wipethatrecord.com</a> (the &ldquo;Site&rdquo;) and the
        services offered through it (the &ldquo;Services&rdquo;), which are provided by The Berhe
        Law Firm, APC (&ldquo;<strong>we</strong>,&rdquo; &ldquo;<strong>our</strong>,&rdquo; or
        &ldquo;<strong>us</strong>&rdquo;). By accessing or using the Site, you agree to be bound by
        these Terms. If you do not agree, do not use the Site.
      </p>

      <h2>1. Eligibility</h2>
      <p>
        You must be at least 18 years old and a resident of the United States to use the Services.
        Our expungement services are limited to convictions that occurred in the State of
        California.
      </p>

      <h2>2. Description of Services</h2>
      <p>
        We offer three service tiers for California criminal record relief:
      </p>
      <ul>
        <li>
          <strong>DIY Expungement Kit ($97):</strong> A self-service package that includes
          California court forms, written instructions, and email support. You complete and file
          the documents yourself.
        </li>
        <li>
          <strong>Expert Review ($297):</strong> Form completion by our team, a case review, and a
          phone consultation. You still file the documents with the court.
        </li>
        <li>
          <strong>Full Service ($1,497):</strong> Full attorney representation, including
          preparation, filing, and any required court appearances.
        </li>
      </ul>

      <h2>3. Attorney-Client Relationship</h2>
      <p>
        <strong>No attorney-client relationship is created</strong> by your use of the Site, the DIY
        Expungement Kit, by submitting an eligibility questionnaire, or by sending us an email. An
        attorney-client relationship is formed only when you and The Berhe Law Firm, APC have
        executed a written engagement agreement and you have paid the applicable retainer.
      </p>
      <p>
        The DIY Expungement Kit is a <strong>self-help legal product</strong>, similar to those
        offered by services such as LegalZoom and Rocket Lawyer. It is not legal advice tailored to
        your circumstances.
      </p>

      <h2>4. Payment and Refunds</h2>
      <ul>
        <li>All fees are charged in U.S. dollars and processed by Stripe.</li>
        <li>
          <strong>Money-back guarantee:</strong> If your case does not qualify for expungement
          based on the information you provide and our review, we will refund the purchase price in
          full. Refund requests must be submitted within 30 days of purchase and before any court
          filing is made on your behalf.
        </li>
        <li>
          Once court filing fees have been paid to a third party (the Superior Court), those
          fees are non-refundable because they are paid to the court, not to us.
        </li>
        <li>
          <strong>Chargebacks:</strong> If you initiate a chargeback without first contacting us,
          we reserve the right to suspend further service.
        </li>
      </ul>

      <h2>5. Your Responsibilities</h2>
      <p>You agree to:</p>
      <ul>
        <li>Provide accurate, complete, and up-to-date information.</li>
        <li>
          Promptly review documents we prepare and notify us of any errors before filing.
        </li>
        <li>Comply with all court rules, deadlines, and notice requirements.</li>
        <li>Not use the Services for any unlawful purpose or to defraud any party.</li>
      </ul>
      <p>
        Providing false or incomplete information about your criminal history may render your
        petition defective and is, in some cases, a crime. We are not liable for outcomes that
        result from inaccurate information you provide.
      </p>

      <h2>6. No Guarantee of Outcome</h2>
      <p>
        Every case is unique. While we are proud of our high success rate on eligible cases, we do
        not and cannot guarantee that any specific petition will be granted by a court. Statements
        about success rates, processing times, and the number of clients served on the Site are
        provided for general informational purposes only and do not constitute a warranty.
      </p>

      <h2>7. Intellectual Property</h2>
      <p>
        All content on the Site — including text, graphics, logos, form templates, instructions,
        and software — is owned by or licensed to us and is protected by United States and
        international copyright, trademark, and other intellectual property laws. You may use the
        DIY Expungement Kit solely for your own personal, non-commercial use. You may not resell,
        sublicense, or redistribute any portion of our content.
      </p>

      <h2>8. Disclaimer of Warranties</h2>
      <p>
        THE SITE AND SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
        WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS
        FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. We do not warrant that the Site will be
        uninterrupted, error-free, or secure.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        TO THE FULLEST EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY ARISING OUT OF OR RELATING TO
        THESE TERMS OR THE SERVICES SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE 12 MONTHS
        BEFORE THE EVENT GIVING RISE TO THE CLAIM. WE WILL NOT BE LIABLE FOR ANY INDIRECT,
        INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
        DAMAGES. This limitation does not apply to claims for legal malpractice arising out of an
        attorney-client relationship governed by a signed engagement agreement, which are governed
        by California law and the California Rules of Professional Conduct.
      </p>

      <h2>10. Indemnification</h2>
      <p>
        You agree to indemnify, defend, and hold harmless The Berhe Law Firm, APC and its
        attorneys, employees, and agents from any claim, demand, loss, or damage (including
        reasonable attorneys&rsquo; fees) arising out of your use of the Services, your violation
        of these Terms, or your violation of any law or third-party right.
      </p>

      <h2>11. Governing Law and Dispute Resolution</h2>
      <p>
        These Terms are governed by the laws of the State of California, without regard to its
        conflict-of-laws principles. Any dispute arising out of or relating to these Terms or the
        Services shall be resolved exclusively in the state or federal courts located in San
        Bernardino County, California, and you consent to the personal jurisdiction of those
        courts.
      </p>

      <h2>12. Modifications</h2>
      <p>
        We may update these Terms at any time. Material changes will be communicated by email or a
        prominent notice on the Site. Continued use of the Site after changes take effect
        constitutes acceptance of the revised Terms.
      </p>

      <h2>13. Contact Us</h2>
      <p>
        <strong>The Berhe Law Firm, APC</strong>
        <br />
        901 Via Piemonte, Suite 230
        <br />
        Ontario, CA 91764
        <br />
        Email: <a href="mailto:support@wipethatrecord.com">support@wipethatrecord.com</a>
        <br />
        Phone: <a href="tel:+19096096685">(909) 609-6685</a>
      </p>
    </LegalPage>
  )
}

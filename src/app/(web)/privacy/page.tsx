import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Privacy Policy | Wipe That Record',
  description:
    'How Wipe That Record collects, uses, and protects your personal information when you use our California expungement service.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy" updated="June 5, 2026">
      <p>
        Wipe That Record (&ldquo;<strong>we</strong>,&rdquo; &ldquo;<strong>our</strong>,&rdquo; or
        &ldquo;<strong>us</strong>&rdquo;), operated by The Berhe Law Firm, APC, respects your privacy.
        This Privacy Policy explains what information we collect, how we use it, and the choices you
        have regarding your personal information when you use{' '}
        <a href="https://wipethatrecord.com">wipethatrecord.com</a> (the &ldquo;Site&rdquo;) and our
        related services (collectively, the &ldquo;Services&rdquo;).
      </p>

      <h2>1. Information We Collect</h2>

      <h3>Information You Provide</h3>
      <ul>
        <li>
          <strong>Contact information</strong> — name, email address, phone number, and mailing
          address when you sign up, request an eligibility check, or contact us.
        </li>
        <li>
          <strong>Case information</strong> — facts about your criminal record (charges,
          convictions, dates, county, sentencing) provided through our questionnaires.
        </li>
        <li>
          <strong>Payment information</strong> — credit card details and billing address are
          collected and processed by our payment processor, Stripe. We do not store full card
          numbers on our servers.
        </li>
        <li>
          <strong>Communications</strong> — messages you send to us by email, contact form, SMS, or
          phone, and recordings or transcripts of consultation calls when permitted by law.
        </li>
      </ul>

      <h3>Information Collected Automatically</h3>
      <ul>
        <li>IP address, device type, browser type, and operating system.</li>
        <li>Pages visited, referring URL, click data, and session duration.</li>
        <li>Cookies and similar technologies (see &ldquo;Cookies&rdquo; below).</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>Evaluate eligibility for expungement and prepare your case documents.</li>
        <li>Process payments and deliver the Services you purchased.</li>
        <li>Communicate with you about your case, scheduling, and account updates.</li>
        <li>
          Send marketing communications (you may opt out at any time via the unsubscribe link in
          any email or by visiting our <a href="/unsubscribe">unsubscribe page</a>).
        </li>
        <li>Improve and secure the Site, prevent fraud, and comply with legal obligations.</li>
      </ul>

      <h2>3. Attorney-Client Confidentiality</h2>
      <p>
        Information you submit specifically in the course of receiving legal services from The Berhe
        Law Firm, APC is protected by the attorney-client privilege and California Rule of
        Professional Conduct 1.6, in addition to this Privacy Policy. Submitting information through
        this Site alone does <strong>not</strong> create an attorney-client relationship — that
        relationship is formed only by a signed engagement agreement with the firm.
      </p>

      <h2>4. How We Share Information</h2>
      <p>
        We do not sell your personal information. We share it only as follows:
      </p>
      <ul>
        <li>
          <strong>Service providers</strong> — Stripe (payments), Resend and SendGrid (email),
          Supabase and MongoDB Atlas (database hosting), Vercel (web hosting), Twilio (SMS), and
          analytics providers. These vendors are contractually bound to protect your data.
        </li>
        <li>
          <strong>Courts and government agencies</strong> — required filings with California
          Superior Courts, the California Department of Justice, and the FBI when necessary to
          perform the Services.
        </li>
        <li>
          <strong>Legal requirements</strong> — to comply with a subpoena, court order, or other
          legal process, or to protect our rights, property, or safety.
        </li>
        <li>
          <strong>Business transfers</strong> — in connection with a merger, acquisition, or sale of
          assets, subject to confidentiality protections.
        </li>
      </ul>

      <h2>5. Cookies and Tracking</h2>
      <p>
        We use cookies and similar technologies to operate the Site, remember your preferences, and
        analyze traffic. You can disable cookies in your browser, but parts of the Site may not
        function correctly. We also use Google Analytics; you can opt out using the{' '}
        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
          Google Analytics opt-out browser add-on
        </a>
        .
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We retain personal information for as long as needed to provide the Services, comply with
        our legal obligations (including California Rules of Professional Conduct, which require
        client files to be retained for at least 5 years after the matter closes), resolve disputes,
        and enforce our agreements.
      </p>

      <h2>7. Security</h2>
      <p>
        We use industry-standard administrative, technical, and physical safeguards — including TLS
        encryption in transit, encryption at rest, role-based access controls, and regular reviews
        — to protect your information. No system is 100% secure, however, and we cannot guarantee
        absolute security.
      </p>

      <h2>8. Your California Privacy Rights</h2>
      <p>
        Under the California Consumer Privacy Act (CCPA) and CPRA, California residents have the
        right to:
      </p>
      <ul>
        <li>Know what personal information we collect, use, and disclose.</li>
        <li>Request deletion of personal information we hold about you.</li>
        <li>Correct inaccurate personal information.</li>
        <li>Limit use of sensitive personal information.</li>
        <li>Opt out of the sale or sharing of personal information (we do not sell your data).</li>
        <li>Non-discrimination for exercising your privacy rights.</li>
      </ul>
      <p>
        To exercise any of these rights, email{' '}
        <a href="mailto:privacy@wipethatrecord.com">privacy@wipethatrecord.com</a> or call{' '}
        <a href="tel:+19096096685">(909) 609-6685</a>. We may need to verify your identity before
        responding.
      </p>

      <h2>9. Children&rsquo;s Privacy</h2>
      <p>
        Our Services are not directed to children under 18, and we do not knowingly collect personal
        information from children. If you believe we have collected information from a child,
        please contact us so we can delete it.
      </p>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. When we do, we will post the new
        policy on this page and update the &ldquo;Last updated&rdquo; date above. Material changes
        will be communicated by email or a prominent notice on the Site.
      </p>

      <h2>11. Contact Us</h2>
      <p>
        Questions about this Privacy Policy? Contact us at:
      </p>
      <p>
        <strong>The Berhe Law Firm, APC</strong>
        <br />
        901 Via Piemonte, Suite 230
        <br />
        Ontario, CA 91764
        <br />
        Email: <a href="mailto:privacy@wipethatrecord.com">privacy@wipethatrecord.com</a>
        <br />
        Phone: <a href="tel:+19096096685">(909) 609-6685</a>
      </p>
    </LegalPage>
  )
}

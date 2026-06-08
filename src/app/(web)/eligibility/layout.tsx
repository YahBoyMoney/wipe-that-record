import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Check Your Eligibility | Wipe That Record',
  description:
    'Free, private California eligibility check. Answer a few questions to see which record-cleaning options may apply to your case — dismissal, sealing, felony reduction, or attorney-managed support. Not legal advice; results vary by case.',
  alternates: {
    canonical: '/eligibility',
  },
};

export default function EligibilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

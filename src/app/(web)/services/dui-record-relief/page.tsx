import { Metadata } from 'next';
import ServiceDetail from '@/components/ServiceDetail';

export const metadata: Metadata = {
  title: 'DUI Record Relief in California | Wipe That Record',
  description:
    'Prepare a petition to dismiss an eligible California DUI conviction and learn what record relief does and does not do.',
};

export default function Page() {
  return (
    <ServiceDetail
      title="DUI Record Relief"
      intro="An eligible DUI conviction may qualify for a dismissal that limits its impact on many background checks. We help you understand your options and prepare the paperwork."
      whoFor={[
        'People with an eligible California DUI conviction',
        'People who have completed probation and any required programs',
        'People who want to reduce how the conviction appears on private background checks',
      ]}
      canHelp={[
        'Preparing a petition to dismiss an eligible DUI under Penal Code 1203.4',
        'Explaining what a dismissal changes and what it does not',
        'Clarifying timeline expectations, which vary by county',
      ]}
      cannotDo={[
        'A dismissed DUI may still count as a prior in certain later cases',
        'Certain agencies and the DMV may still see the underlying record',
        'We cannot guarantee approval or a specific court timeline',
      ]}
      recommendedPlan="DIY Kit for clear-cut cases, or Expert Review if your DUI history is more complex or you want a specialist to review your case first."
    />
  );
}

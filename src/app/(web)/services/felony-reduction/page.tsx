import { Metadata } from 'next';
import ServiceDetail from '@/components/ServiceDetail';

export const metadata: Metadata = {
  title: 'Felony Reduction in California | Wipe That Record',
  description:
    'Petition to reduce an eligible California "wobbler" felony to a misdemeanor under Penal Code 17(b). Learn who qualifies and which plan fits.',
};

export default function Page() {
  return (
    <ServiceDetail
      title="Felony Reduction"
      intro={`Certain "wobbler" felonies can be reduced to misdemeanors under Penal Code 17(b). For many people, reduction is an important step that can come before pursuing a dismissal.`}
      whoFor={[
        'People with an eligible "wobbler" felony that can be charged as a misdemeanor',
        'People who were granted probation rather than a state prison sentence',
        'People who have completed probation or can request early termination',
      ]}
      canHelp={[
        'Determining whether your felony may be eligible for reduction',
        'Preparing a Penal Code 17(b) reduction petition',
        'Planning a sensible order of steps, such as reduction before dismissal',
      ]}
      cannotDo={[
        'Not all felonies are eligible; serious and violent offenses generally are not',
        'Reduction does not delete the record and some agencies may still access it',
        'The court decides each petition; we cannot guarantee the outcome',
      ]}
      recommendedPlan="Felony reduction is often best handled with Expert Review or Full Service so a specialist or attorney can assess eligibility and prepare the petition."
    />
  );
}

import { Metadata } from 'next';
import ServiceDetail from '@/components/ServiceDetail';

export const metadata: Metadata = {
  title: 'Misdemeanor Dismissal in California | Wipe That Record',
  description:
    'Petition to dismiss an eligible California misdemeanor under Penal Code 1203.4. Understand who qualifies, what dismissal does, and which plan fits.',
};

export default function Page() {
  return (
    <ServiceDetail
      title="Misdemeanor Dismissal"
      intro="If you completed probation on an eligible California misdemeanor, you may be able to petition the court for a dismissal under Penal Code 1203.4."
      whoFor={[
        'People with an eligible misdemeanor conviction in California',
        'People who have completed probation, or can ask the court for early termination',
        'People who are not currently charged with another offense or on probation for another case',
      ]}
      canHelp={[
        'Preparing a petition for dismissal under Penal Code 1203.4',
        'Understanding how a dismissal can affect many private background checks',
        'Identifying whether felony reduction should come first for "wobbler" offenses',
      ]}
      cannotDo={[
        'It does not erase or delete your record; a dismissal updates the disposition',
        'Some government agencies and licensing bodies may still access the record',
        'The court decides each petition; approval and timelines are not guaranteed',
      ]}
      recommendedPlan="The DIY Kit fits straightforward cases. Choose Expert Review if you are unsure about eligibility or want a specialist to check your paperwork before filing."
    />
  );
}

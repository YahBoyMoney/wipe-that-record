import { Metadata } from 'next';
import ServiceDetail from '@/components/ServiceDetail';

export const metadata: Metadata = {
  title: 'Arrest Record Sealing in California | Wipe That Record',
  description:
    'Petition to seal an eligible California arrest record under Penal Code 851.91. Learn who qualifies and what sealing does and does not do.',
};

export default function Page() {
  return (
    <ServiceDetail
      title="Arrest Record Sealing"
      intro="If you were arrested but not convicted, you may be able to petition to seal the arrest record under Penal Code 851.91 so it is no longer part of the public record."
      whoFor={[
        'People arrested in California where the case did not lead to a conviction',
        'People whose charges were dropped, dismissed, or who were found not guilty',
        'People who want the arrest removed from public-facing records',
      ]}
      canHelp={[
        'Preparing a petition to seal an eligible arrest record',
        'Explaining how sealing affects what most members of the public can see',
        'Clarifying which situations may still require disclosure',
      ]}
      cannotDo={[
        'Some government agencies, including law enforcement, can still access sealed records',
        'You may still need to disclose for public office, peace officer roles, or certain licenses',
        'Eligibility depends on the case; approval and timelines are not guaranteed',
      ]}
      recommendedPlan="The DIY Kit fits clear, no-conviction arrests. Choose Expert Review if the history is complicated or you want a specialist to confirm eligibility first."
    />
  );
}

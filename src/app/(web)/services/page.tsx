import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'California Record-Cleaning Services | Wipe That Record',
  description:
    'Explore California record-cleaning services: misdemeanor dismissal, DUI record relief, felony reduction, and arrest record sealing. DIY, expert review, and attorney-managed options.',
};

const services = [
  {
    href: '/services/misdemeanor-dismissal',
    title: 'Misdemeanor Dismissal',
    forWho: 'People with eligible misdemeanor convictions who have completed probation.',
    helps: 'Petition to dismiss eligible misdemeanors under California Penal Code 1203.4.',
    cannot: 'Cannot guarantee approval; the court decides based on your case and eligibility.',
    fits: 'DIY Kit for straightforward cases; Expert Review if you are unsure.',
  },
  {
    href: '/services/dui-record-relief',
    title: 'DUI Record Relief',
    forWho: 'People with an eligible DUI conviction seeking to limit its impact.',
    helps: 'Prepare a petition to dismiss an eligible DUI and understand what relief does and does not do.',
    cannot: 'A dismissed DUI may still be usable as a prior in some circumstances and visible to certain agencies.',
    fits: 'DIY Kit or Expert Review depending on complexity.',
  },
  {
    href: '/services/felony-reduction',
    title: 'Felony Reduction',
    forWho: 'People with certain "wobbler" felony convictions who may qualify for reduction.',
    helps: 'Petition to reduce an eligible felony to a misdemeanor under Penal Code 17(b), often before dismissal.',
    cannot: 'Not all felonies are eligible; eligibility depends on the offense and your record.',
    fits: 'Expert Review or Full Service for complex cases.',
  },
  {
    href: '/services/record-sealing',
    title: 'Arrest Record Sealing',
    forWho: 'People arrested without a conviction who want the arrest sealed.',
    helps: 'Petition to seal an arrest record under Penal Code 851.91 where eligible.',
    cannot: 'Sealed records can still be accessed by some government agencies and for certain purposes.',
    fits: 'DIY Kit or Expert Review.',
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-[#0f2747] py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold sm:text-4xl">What kind of record help do you need?</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            We help Californians pursue several forms of record relief. True expungement does not exist
            in California, so we focus on the options that may actually apply to your case.
          </p>
          <Link
            href="/eligibility"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-[#0f2747] transition-colors hover:bg-slate-100"
          >
            Check Eligibility Free
          </Link>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((s) => (
              <div key={s.href} className="rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">{s.title}</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="font-semibold text-slate-700">Who it&rsquo;s for</dt>
                    <dd className="text-slate-600">{s.forWho}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-700">What it can help with</dt>
                    <dd className="text-slate-600">{s.helps}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-700">What it cannot guarantee</dt>
                    <dd className="text-slate-600">{s.cannot}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-700">Which plan usually fits</dt>
                    <dd className="text-slate-600">{s.fits}</dd>
                  </div>
                </dl>
                <Link
                  href={s.href}
                  className="mt-5 inline-block font-semibold text-[#0f2747] hover:underline"
                >
                  Learn more &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

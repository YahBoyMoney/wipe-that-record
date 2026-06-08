import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'California Service Areas | Wipe That Record',
  description:
    'We help with record cleaning across California, including Los Angeles, Orange County, San Bernardino, Riverside, San Diego, and more. Court timelines vary by county.',
};

const featured = [
  { href: '/los-angeles', name: 'Los Angeles County', note: 'LA Superior Court and surrounding cities' },
  { href: '/orange-county', name: 'Orange County', note: 'Santa Ana, Anaheim, and OC courts' },
];

const counties = [
  'San Bernardino',
  'Riverside',
  'San Diego',
  'Ventura',
  'Kern',
  'Sacramento',
  'Fresno',
  'Santa Clara',
  'Alameda',
  'San Francisco',
];

export default function LocationsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-[#0f2747] py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold sm:text-4xl">Where we help in California</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Our forms and guidance are built around California courts and procedures. Each county has
            its own filing process, and court timelines vary by county and case type.
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
          <h2 className="text-xl font-bold text-slate-900">Featured areas</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {featured.map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className="block rounded-2xl border border-slate-200 p-6 shadow-sm transition-colors hover:border-[#0f2747]"
              >
                <h3 className="text-lg font-bold text-slate-900">{f.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{f.note}</p>
                <span className="mt-4 inline-block font-semibold text-[#0f2747]">View page &rarr;</span>
              </Link>
            ))}
          </div>

          <h2 className="mt-14 text-xl font-bold text-slate-900">Other California counties we serve</h2>
          <p className="mt-2 text-sm text-slate-600">
            We support record-cleaning paperwork statewide. Start with a free eligibility check for
            your county.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {counties.map((c) => (
              <span
                key={c}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
              >
                {c} County
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

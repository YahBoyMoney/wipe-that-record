import Link from 'next/link';

export interface ServiceDetailProps {
  title: string;
  intro: string;
  whoFor: string[];
  canHelp: string[];
  cannotDo: string[];
  recommendedPlan: string;
}

export default function ServiceDetail({
  title,
  intro,
  whoFor,
  canHelp,
  cannotDo,
  recommendedPlan,
}: ServiceDetailProps) {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-[#0f2747] py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link href="/services" className="text-sm text-slate-300 hover:text-white">
            &larr; All services
          </Link>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h1>
          <p className="mt-4 text-lg text-slate-300">{intro}</p>
          <Link
            href="/eligibility"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-[#0f2747] transition-colors hover:bg-slate-100"
          >
            Check Eligibility Free
          </Link>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6">
          <Block heading="Who this is for" items={whoFor} />
          <Block heading="What it can help with" items={canHelp} />
          <Block heading="What it cannot guarantee" items={cannotDo} />

          <div className="rounded-2xl bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Which plan usually fits</h2>
            <p className="mt-2 text-slate-600">{recommendedPlan}</p>
            <Link
              href="/#plans"
              className="mt-4 inline-block font-semibold text-[#0f2747] hover:underline"
            >
              Compare plans &rarr;
            </Link>
          </div>

          <p className="border-t border-slate-200 pt-6 text-sm text-slate-500">
            This page is general information, not legal advice. True expungement does not exist in
            California. Eligibility and outcomes depend on your specific case, and court timelines
            vary by county.
          </p>
        </div>
      </section>
    </main>
  );
}

function Block({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900">{heading}</h2>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-slate-600">
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#0f2747]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

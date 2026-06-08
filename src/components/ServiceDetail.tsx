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
    <main className="min-h-screen bg-[var(--parchment)]">
      <section className="ink-texture py-20 text-[var(--text-ink)]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link href="/services" className="text-sm text-[var(--brass)] hover:text-white">
            &larr; All services
          </Link>
          <h1 className="font-display mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-ink-muted)]">{intro}</p>
          <Link href="/eligibility" className="btn btn-brass mt-8">
            Check eligibility free
          </Link>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl space-y-12 px-4 sm:px-6">
          <Block heading="Who this is for" items={whoFor} />
          <Block heading="What it can help with" items={canHelp} />
          <Block heading="What it cannot guarantee" items={cannotDo} />

          <div className="card-paper p-7">
            <span className="eyebrow text-[var(--brass-600)]">Which plan usually fits</span>
            <p className="mt-3 text-[var(--text-muted)]">{recommendedPlan}</p>
            <Link href="/#plans" className="link-ink mt-4 inline-block">
              Compare plans &rarr;
            </Link>
          </div>

          <p className="border-t border-[var(--line)] pt-6 text-sm leading-relaxed text-[var(--text-muted)]">
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
      <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">{heading}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[var(--text)]">
            <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--brass)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

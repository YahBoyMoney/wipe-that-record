import { cookies } from 'next/headers';
import payload from 'payload';
export const dynamic = 'force-dynamic';

export default async function Portal({ searchParams }: { searchParams: { session_id?: string } }) {
  const session_id = searchParams.session_id;
  const lead = session_id
    ? await payload.find({ collection: 'leads', where: { stripeCheckoutSession: { equals: session_id } } })
    : null;

  if (!lead || !lead.docs[0]?.paid) {
    return <p className="p-10 text-red-600">Could not verify payment.</p>;
  }
  const l = lead.docs[0];
  return (
    <main className="max-w-xl mx-auto p-10">
      <h1 className="text-2xl font-bold mb-4">Welcome back, {l.firstName}!</h1>
      <p>Your expungement file is being prepared. We'll email you updates.</p>
    </main>
  );
} 
'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const priceUp   = process.env.NEXT_PUBLIC_STRIPE_PRICE_UPCHARGE!;
const priceFull = process.env.NEXT_PUBLIC_STRIPE_PRICE_FULL!;

export default function ThankYou() {
  const q        = useSearchParams();
  const parentId = q?.get('session_id');          // original DIY session

  return (
    <main className='flex flex-col items-center justify-center px-4 py-16 space-y-8 text-center'>
      <h1 className='text-3xl font-bold'>Payment received 🎉</h1>

      <p className='max-w-md'>
        Your DIY packet will be emailed shortly. <br/>
        Want us to do the leg-work? Choose an option below —
        you'll be back here in seconds.
      </p>

      <div className='flex flex-col gap-4 w-72'>
        <Link
          className='bg-amber-500 hover:bg-amber-600 text-white py-3 rounded shadow'
          href={{
            pathname: '/api/checkout/upgrade',
            query: { parent: parentId, priceId: priceUp, upgrade: 'lookup' },
          }}
        >
          🔍 Add record lookup + $100
        </Link>

        <Link
          className='bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded shadow'
          href={{
            pathname: '/api/checkout/upgrade',
            query: { parent: parentId, priceId: priceFull, upgrade: 'full' },
          }}
        >
          🚀 Upgrade to full-service $1,500
        </Link>

        <Link href='/' className='underline text-sm mt-2'>
          No thanks, take me back
        </Link>
      </div>
    </main>
  );
} 
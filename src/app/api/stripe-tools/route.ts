import { z } from 'zod';
import Stripe from 'stripe';
import { createMcpHandler } from '@vercel/mcp-adapter';
import payload from 'payload';
import type { NextRequest } from 'next/server';

// Initialize Stripe lazily to avoid build-time errors
const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is required');
  }
  return new Stripe(secretKey);
};

// Temporary no-op auth check (replace with real Payload auth if desired)
const assertAdmin = async (): Promise<void> => {
  return;
};

const handler = createMcpHandler(
  (server: any) => {
    // ────────────────── stripe_get_payment ──────────────────
    server.tool(
      'stripe_get_payment',
      'Returns amount, status and customer email for a PaymentIntent (pi_) or Charge (ch_)',
      { id: z.string() },
      async ({ id }: { id: string }) => {
        await assertAdmin();

        if (id.startsWith('pi_')) {
          const pi = await getStripe().paymentIntents.retrieve(id);
          const amt = (pi.amount_received ?? pi.amount ?? 0) / 100;
          return {
            content: [
              {
                type: 'text',
                text: `💳 ${amt} ${pi.currency.toUpperCase()} — status \`${pi.status}\` — email \`${pi.receipt_email ?? 'n/a'}\``,
              },
            ],
          };
        }

        if (id.startsWith('ch_')) {
          const ch = await getStripe().charges.retrieve(id);
          const amt = (ch.amount ?? 0) / 100;
          return {
            content: [
              {
                type: 'text',
                text: `💳 ${amt} ${ch.currency.toUpperCase()} — status \`${ch.status}\` — email \`${ch.billing_details?.email ?? 'n/a'}\``,
              },
            ],
          };
        }

        return {
          content: [{ type: 'text', text: `❌ Unknown ID: ${id}` }],
        };
      },
    );

    // ────────────────── stripe_recent_payments ──────────────────
    server.tool(
      'stripe_recent_payments',
      'Returns the last N successful charges',
      { limit: z.number().int().min(1).max(100).default(10) },
      async ({ limit }: { limit: number }) => {
        await assertAdmin();
        const list = await getStripe().charges.list({ limit });
        const lines = list.data.map((c: Stripe.Charge) => `• ${new Date(c.created * 1000).toLocaleString()} — ${(c.amount / 100).toFixed(2)} ${c.currency.toUpperCase()} — ${c.status}`);
        return { content: [{ type: 'text', text: lines.join('\n') }] };
      },
    );

    // ────────────────── stripe_refund ──────────────────
    server.tool(
      'stripe_refund',
      'Creates a full refund for a Charge ID',
      { chargeId: z.string() },
      async ({ chargeId }: { chargeId: string }) => {
        await assertAdmin();
        const refund = await getStripe().refunds.create({ charge: chargeId });
        return {
          content: [
            {
              type: 'text',
              text: `↩️  Refund \`${refund.id}\` created — status: \`${refund.status}\``,
            },
          ],
        };
      },
    );

    // ────────────────── stripe_balance ──────────────────
    server.tool(
      'stripe_balance',
      'Returns available & pending Stripe balance',
      {},
      async () => {
        await assertAdmin();
        const bal = await getStripe().balance.retrieve();
        const available = bal.available[0]?.amount ?? 0;
        const pending = bal.pending[0]?.amount ?? 0;
        return {
          content: [
            {
              type: 'text',
              text: `💰 **Available:** ${(available / 100).toFixed(2)}\n⏳ **Pending:** ${(pending / 100).toFixed(2)}`,
            },
          ],
        };
      },
    );
  },
  {},
  { basePath: '/api/stripe-tools' },
);

export { handler as GET, handler as POST, handler as DELETE }; 
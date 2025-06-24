import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error(
    'Missing STRIPE_SECRET_KEY in environment variables. ' +
    'Please add your Stripe secret key to your .env file.'
  );
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-05-28.basil'
}); 
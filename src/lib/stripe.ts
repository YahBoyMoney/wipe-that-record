import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!stripeSecretKey) {
      throw new Error(
        'Missing STRIPE_SECRET_KEY in environment variables. ' +
        'Please add your Stripe secret key to your .env file.'
      );
    }
    
    stripeInstance = new Stripe(stripeSecretKey, {
      apiVersion: '2025-05-28.basil'
    });
  }
  
  return stripeInstance;
}

export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    const stripeInstance = getStripe();
    const value = stripeInstance[prop as keyof Stripe];
    return typeof value === 'function' ? value.bind(stripeInstance) : value;
  }
}); 
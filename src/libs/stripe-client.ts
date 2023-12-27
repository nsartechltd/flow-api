import Stripe from 'stripe';

let stripeClient: Stripe;

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const getStripeClient = (): Stripe => {
  if (!stripeSecretKey) {
    throw new Error('Stripe secret key has not been set.');
  }

  if (!stripeClient) {
    stripeClient = new Stripe(stripeSecretKey);
  }

  return stripeClient;
};

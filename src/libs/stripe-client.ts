import Stripe from 'stripe';

import config from '../config';

let stripeClient: Stripe;

export const getStripeClient = (): Stripe => {
  const secretKey = config.stripe.secretKey;

  if (!secretKey) {
    throw new Error('Stripe secret key has not been set.');
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }

  return stripeClient;
};

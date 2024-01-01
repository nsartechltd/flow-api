import Stripe from 'stripe';

import config from '../config';

let stripeClient: Stripe;

export const getStripeClient = (): Stripe => {
  if (!config.stripeSecretKey) {
    throw new Error('Stripe secret key has not been set.');
  }

  if (!stripeClient) {
    stripeClient = new Stripe(config.stripeSecretKey);
  }

  return stripeClient;
};

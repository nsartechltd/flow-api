const nodeEnv = process.env.NODE_ENV;

const config = {
  cors:
    nodeEnv === 'production'
      ? 'https://flow.nsar-tech.co.uk'
      : 'https://flow-dev.nsar-tech.co.uk',
  flowAppUrl: process.env.FLOW_APP_URL,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
};

export default config;

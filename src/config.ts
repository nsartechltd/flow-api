const nodeEnv = process.env.NODE_ENV;

const config = {
  cors:
    nodeEnv === 'production'
      ? 'https://flow.nsar-tech.co.uk'
      : nodeEnv === 'development'
      ? 'https://flow-dev.nsar-tech.co.uk'
      : 'http://localhost:5173',
  flowAppUrl: process.env.FLOW_APP_URL,
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
};

export default config;

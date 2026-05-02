import Stripe from 'stripe';

let stripe: Stripe | null = null;

function getStripeSecretKey() {
  return process.env.STRIPE_SECRET_KEY;
}

function getStripePublishableKeyEnv() {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
}

export function getStripe() {
  if (!stripe) {
    const stripeSecretKey = getStripeSecretKey();
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20',
    });
  }
  return stripe;
}

export function getStripePublishableKey() {
  const publishableKey = getStripePublishableKeyEnv();
  if (!publishableKey) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable is not set');
  }
  return publishableKey;
}
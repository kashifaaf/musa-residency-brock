import Stripe from "stripe"

let stripe: Stripe | null = null

export function getStripe() {
  if (!stripe) {
    if (typeof window !== "undefined") {
      throw new Error("Stripe should not be accessed on the client side")
    }
    
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set")
    }
    stripe = new Stripe(secretKey, {
      apiVersion: "2024-06-20",
    })
  }
  return stripe
}
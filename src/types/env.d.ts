declare namespace NodeJS {
  interface ProcessEnv {
    // Database
    DATABASE_URL: string;
    
    // NextAuth
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    
    // OAuth Providers
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    
    // Stripe
    STRIPE_SECRET_KEY: string;
    STRIPE_PUBLISHABLE_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    
    // Upload Thing
    UPLOADTHING_SECRET: string;
    UPLOADTHING_APP_ID: string;
    
    // Email (Resend)
    RESEND_API_KEY: string;
    RESEND_FROM_EMAIL: string;
    
    // AI (optional)
    OPENAI_API_KEY?: string;
    
    // Analytics (optional)
    VERCEL_ANALYTICS_ID?: string;
  }
}
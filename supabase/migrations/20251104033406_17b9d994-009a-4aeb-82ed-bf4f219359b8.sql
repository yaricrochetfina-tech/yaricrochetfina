-- Add Stripe tracking fields to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS stripe_session_id text UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text;
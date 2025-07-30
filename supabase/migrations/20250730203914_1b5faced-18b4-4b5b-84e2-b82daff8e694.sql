-- Fix verified_by column type in payments table to accept text IDs
ALTER TABLE public.payments ALTER COLUMN verified_by TYPE TEXT;
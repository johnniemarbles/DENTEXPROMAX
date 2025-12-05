
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// Declare require to avoid "Cannot find name 'require'" errors when @types/node is missing
declare var require: any;

// Load env vars
const SUPABASE_URL = "https://tufwbvnnzckrdvixsuht.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1Zndidm5uemNrcmR2aXhzdWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODI2OTQsImV4cCI6MjA4MDE1ODY5NH0.rT2dwuTRGMiYyr20tVOZu9HRWgEeK7mjymiW9_b0k";

export const createDataServerClient = () => {
  // SIMULATION: If running in browser, return a standard client or mock
  // This prevents "Error: cookies() is not a function" in the SPA preview
  if (typeof window !== 'undefined') {
      console.warn("createDataServerClient called on Client Side. Returning standard client.");
      const { createClient } = require('@supabase/supabase-js');
      return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  // Server-side logic (Keep imports dynamic to avoid bundling issues)
  const { cookies } = require('next/headers');
  const cookieStore = cookies();

  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Server Components cannot set cookies
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Server Components cannot delete cookies
          }
        },
      },
    }
  );
};

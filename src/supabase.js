import { createClient } from '@supabase/supabase-js';

// Access environment variables using import.meta.env for Vite
// The || operator provides a fallback for local development ONLY.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://avqsryfzntdvofhwdvvi.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cXNyeWZ6bnRkdm9maHdkdnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MzUyOTUsImV4cCI6MjA3MDQxMTI5NX0.A3-6pNhJtzOFgDaV_-3D9SZSxdZT1eXjaPxVXZVVEhA';

// This check is crucial. It prevents the application from building for production
// with the hardcoded fallback keys, which is a security risk.
if (import.meta.env.PROD && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in the environment for production builds.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
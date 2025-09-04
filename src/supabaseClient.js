// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Add a check to ensure the environment variables are loaded correctly
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL or Anon Key is missing. Make sure you have a .env file in the project root with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, and restart the development server.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || supabaseAnonKey

// Public client for frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service client for backend (server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export default supabase
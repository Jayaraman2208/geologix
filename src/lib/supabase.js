import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gjmfmmgoxjecygcnijnq.supabase.co'
const supabaseAnonKey = 'sb_publishable_X8FAAhpY3OxNveMtOJM9eg_sii5Ju8F'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export default supabase

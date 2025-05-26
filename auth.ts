import { createClient } from '@supabase/supabase-js'
import assert from 'assert'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? assert.fail(), process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? assert.fail(), {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
})
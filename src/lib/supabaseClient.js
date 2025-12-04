import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lzhkllanoocytcspscqc.supabase.co'
const supabaseAnonKey = 'sb_publishable_qLQwV3h6IkPYw2uyGm2kLQ_SZJm-KTh'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

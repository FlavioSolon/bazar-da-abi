import { createClient } from '@supabase/supabase-js'
import { S3Client } from '@aws-sdk/client-s3'

const supabaseUrl = 'https://lzhkllanoocytcspscqc.supabase.co'
const supabaseAnonKey = 'sb_publishable_qLQwV3h6IkPYw2uyGm2kLQ_SZJm-KTh'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// S3 Configuration
export const s3Config = {
    endpoint: 'https://lzhkllanoocytcspscqc.supabase.co/storage/v1/s3',
    region: 'us-east-1',
    credentials: {
        accessKeyId: '1e207e797f8cacc4209e9601bbba7f03',
        secretAccessKey: '0fbf9a83ab0af93e721447c44452e316492180e2b01237349fd963cf71f87184'
    },
    forcePathStyle: true
}

export const s3 = new S3Client(s3Config)

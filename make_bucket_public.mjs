import { S3Client, PutBucketAclCommand } from '@aws-sdk/client-s3';

const s3Config = {
    endpoint: 'https://lzhkllanoocytcspscqc.supabase.co/storage/v1/s3',
    region: 'us-east-1',
    credentials: {
        accessKeyId: '1e207e797f8cacc4209e9601bbba7f03',
        secretAccessKey: '0fbf9a83ab0af93e721447c44452e316492180e2b01237349fd963cf71f87184'
    },
    forcePathStyle: true
};

const s3 = new S3Client(s3Config);

async function makeBucketPublic() {
    try {
        console.log('Attempting to set bucket "products" to public-read...');
        await s3.send(new PutBucketAclCommand({
            Bucket: 'products',
            ACL: 'public-read'
        }));
        console.log('Bucket "products" ACL set to public-read successfully!');
    } catch (err) {
        console.error('Error setting bucket ACL:', err);
    }
}

makeBucketPublic();

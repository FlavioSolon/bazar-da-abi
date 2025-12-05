import { S3Client, CreateBucketCommand } from '@aws-sdk/client-s3';

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

async function createBucket() {
    try {
        console.log('Attempting to create bucket "products"...');
        await s3.send(new CreateBucketCommand({ Bucket: 'products' }));
        console.log('Bucket "products" created successfully!');
    } catch (err) {
        console.error('Error creating bucket:', err);
    }
}

createBucket();

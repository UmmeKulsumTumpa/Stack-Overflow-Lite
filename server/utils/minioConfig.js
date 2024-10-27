// config/minioClient.js
const Minio = require('minio');
require('dotenv').config();

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
});

// Ensure the bucket exists
minioClient.bucketExists(process.env.MINIO_BUCKET, (err) => {
    if (err) {
        if (err.code === 'NoSuchBucket') {
            minioClient.makeBucket(process.env.MINIO_BUCKET, 'us-east-1', (err) => {
                if (err) return console.error('Error creating bucket.', err);
                console.log(`Bucket "${process.env.MINIO_BUCKET}" created successfully.`);
            });
        } else {
            console.error('Error checking bucket:', err);
        }
    } else {
        console.log(`Bucket "${process.env.MINIO_BUCKET}" exists.`);
    }
});

module.exports = minioClient;

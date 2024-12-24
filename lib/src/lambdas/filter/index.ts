import { S3Event } from 'aws-lambda';

export const handler = async (event: S3Event): Promise<void> => {
  console.log(JSON.stringify(event, null, 2));

  event.Records.forEach(record => {
    const bucketName = record.s3.bucket.name;
    const objectKey = record.s3.object.key;

    console.log(`Bucket: ${bucketName}`);
    console.log(`Key: ${objectKey}`);
    // TODO: Get image from /input folder
    // TODO: Delete image from /input folder
    // TODO: Apply filter
    // TODO: Put image in /output folder
  });
};

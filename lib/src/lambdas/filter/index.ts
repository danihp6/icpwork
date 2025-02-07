import { S3Event } from "aws-lambda";
import * as AWS from "aws-sdk";
import sharp from "sharp";

const s3 = new AWS.S3();
const INPUT_FOLDER = "input/";
const OUTPUT_FOLDER = "output/";

export const handler = async (event: S3Event): Promise<void> => {
  console.log(JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    const bucketName = record.s3.bucket.name;
    const objectKey = record.s3.object.key;

    if (!objectKey.startsWith(INPUT_FOLDER)) {
      console.log(`Skipping non-input folder file: ${objectKey}`);
      continue;
    }

    try {
      // 1. Descargar imagen original desde S3
      const imageBuffer = await getImageFromS3(bucketName, objectKey);

      // 2. Crear una marca de agua (texto o imagen)
      const watermarkBuffer = await generateWatermark("Hello FROM THE CLOUD");

      // 3. Aplicar la marca de agua
      const processedImageBuffer = await applyWatermark(
        imageBuffer,
        watermarkBuffer
      );

      // 4. Subir la imagen procesada a S3
      const outputKey = objectKey.replace(INPUT_FOLDER, OUTPUT_FOLDER);
      await putImageToS3(bucketName, outputKey, processedImageBuffer);

      // 5. Eliminar la imagen original de /input
      await deleteImageFromS3(bucketName, objectKey);

      console.log(`Processed and moved ${objectKey} to ${outputKey}`);
    } catch (error) {
      console.error(`Error processing ${objectKey}:`, error);
    }
  }
};

const getImageFromS3 = async (bucket: string, key: string): Promise<Buffer> => {
  const response = await s3.getObject({ Bucket: bucket, Key: key }).promise();
  return response.Body as Buffer;
};

// Crear una imagen de marca de agua con texto
const generateWatermark = async (text: string): Promise<Buffer> => {
  return await sharp({
    text: {
      text: `<span foreground="white" background="black">${text}</span>`,
      rgba: true,
      width: 200,
      height: 50,
    },
  }).toBuffer();
};

// Aplicar la marca de agua sobre la imagen original
const applyWatermark = async (
  imageBuffer: Buffer,
  watermarkBuffer: Buffer
): Promise<Buffer> => {
  return await sharp(imageBuffer)
    .composite([{ input: watermarkBuffer, gravity: "southeast" }])
    .toBuffer();
};

const putImageToS3 = async (
  bucket: string,
  key: string,
  body: Buffer
): Promise<void> => {
  await s3
    .putObject({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: "image/png",
    })
    .promise();
};

const deleteImageFromS3 = async (
  bucket: string,
  key: string
): Promise<void> => {
  await s3.deleteObject({ Bucket: bucket, Key: key }).promise();
};

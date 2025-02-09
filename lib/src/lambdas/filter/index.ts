import * as AWS from "aws-sdk";

const s3 = new AWS.S3();

export const handler = async (event: any) => {
  const bucketName = process.env.BUCKET_NAME || "";

  try {
    const record = event.Records?.[0];

    const inputKey = record.s3.object.key;
    if (!inputKey.startsWith("input/")) {
      console.log("El archivo no está en la carpeta input/, se ignora.");
      return {
        statusCode: 200,
        body: "Archivo fuera de la carpeta input/, ignorado.",
      };
    }
    const data = await s3
      .getObject({ Bucket: bucketName, Key: inputKey })
      .promise();
    if (!data.Body) throw new Error("El archivo está vacío o no se pudo leer.");

    const text = data.Body.toString("utf-8");
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const wordCount: Record<string, number> = {};
    words.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    const outputContent = Object.entries(wordCount)
      .map(([word, count]) => `${word}: ${count}`)
      .join("\n");
    const outputKey = inputKey
      .replace("input/", "output/")
      .replace(".txt", "_wordcount.txt");
    await s3
      .putObject({
        Bucket: bucketName,
        Key: outputKey,
        Body: outputContent,
        ContentType: "text/plain",
      })
      .promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Conteo de palabras generado",
        outputKey,
      }),
    };
  } catch (error: any) {
    console.error("Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

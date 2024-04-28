import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
} from "@aws-sdk/client-s3";

const bucketName = "post-app";

const client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_ENDPOINT as string,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.CLOUDFLARE_ACCESS_KEY as string,
  },
});

function getFileExtension(file: File): string | null {
  // ファイル名を取得
  const fileName = file.name;
  // ファイル名から拡張子を正規表現を使って抽出
  const match = /\.\w+$/.exec(fileName);
  // マッチした場合は拡張子を返し、そうでなければnullを返す
  return match ? match[0] : null;
}

export const putImage = async (formData: FormData, pathname: string) => {
  const thumbnailFile = formData.get("thumbnail") as File;
  const extension = getFileExtension(thumbnailFile);

  const uploadParams: PutObjectCommandInput = {
    Bucket: bucketName,
    Key: pathname,
    Body: Buffer.from(await thumbnailFile.arrayBuffer()),
    ContentType: `image/${extension}`,
    ACL: "public-read",
  };

  const command = new PutObjectCommand(uploadParams);
  await client.send(command);

  return `${process.env.IMAGE_HOST_URL}/${pathname}`;
};

export const deleteImage = async (pathname: string) => {
  const uploadParams: DeleteObjectCommandInput = {
    Bucket: bucketName,
    Key: pathname,
  };

  const command = new DeleteObjectCommand(uploadParams);
  return client.send(command);
};

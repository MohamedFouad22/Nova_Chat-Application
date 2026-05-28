import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { storageApproachEnum } from "./multer.utils";
import { v4 as uuid } from "uuid";
import { BadRequestException } from "../Response/error.response.utils";
import { Upload } from "@aws-sdk/lib-storage";

export const s3Config = () => {
  return new S3Client({
    region: process.env.AWS_REGION as string,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });
};

export const uploadFile = async ({
  storageApproach = storageApproachEnum.MEMORY,
  Bucket = process.env.BUCKET_NAME as string,
  ACL = "private",
  path = "general",
  file,
}: {
  storageApproach?: storageApproachEnum;
  Bucket?: string;
  ACL?: ObjectCannedACL;
  path?: string;
  file: Express.Multer.File;
}) => {
  const command = new PutObjectCommand({
    Bucket,
    ACL,
    Key: `${process.env.APPLICATION_NAME}/${path}/${uuid()}-${file.originalname}`,
    Body:
      storageApproach === storageApproachEnum.MEMORY ? file.buffer : file.path,
    ContentType: file.mimetype,
  });
  await s3Config().send(command);
  if (!command.input?.Key)
    throw new BadRequestException("Failed To Upload File");

  return command?.input.Key;
};

export const uploadFiles = async ({
  storageApproach = storageApproachEnum.MEMORY,
  Bucket = process.env.BUCKET_NAME as string,
  ACL = "private",
  path = "general",
  files,
}: {
  storageApproach?: storageApproachEnum;
  Bucket?: string;
  ACL?: ObjectCannedACL;
  path?: string;
  files: Express.Multer.File[];
}) => {
  let urls: string[] = [];
  urls = await Promise.all(
    files.map((file) => {
      return uploadFile({
        storageApproach,
        Bucket,
        ACL,
        file,
        path,
      });
    }),
  );

  return urls;
};

export const uploadLargeFiles = async ({
  storageApproach = storageApproachEnum.MEMORY,
  Bucket = process.env.BUCKET_NAME as string,
  ACL = "private",
  path = "general",
  files,
}: {
  storageApproach?: storageApproachEnum;
  Bucket?: string;
  ACL?: ObjectCannedACL;
  path?: string;
  files: Express.Multer.File[];
}) => {
  const urls = await Promise.all(
    files.map(async (file) => {
      const upload = new Upload({
        client: s3Config(),
        params: {
          Bucket,
          ACL,
          Body:
            storageApproach === storageApproachEnum.MEMORY
              ? file.buffer
              : file.path,
          Key: `${process.env.APPLICATION_NAME}/${path}/${uuid()}-${file.originalname}`,
          ContentType: file.mimetype,
        },
        partSize: 5 * 1024 * 1024,
      });
      upload.on("httpUploadProgress", (progress) => {
        console.log(progress.Key);
      });

      const result = await upload.done();
      return result.Key;
    }),
  );
  return urls;
};

export const deleteFile = async ({
  Bucket = process.env.BUCKET_NAME as string,
  Key,
}: {
  Bucket?: string;
  Key: string;
}) => {
  const command = new DeleteObjectCommand({
    Bucket,
    Key,
  });

  return await s3Config().send(command);
};

export const deleteFiles = async ({
  Bucket = process.env.BUCKET_NAME as string,
  urls,
  Quiet = false,
}: {
  Bucket?: string;
  urls: string[];
  Quiet?: boolean;
}) => {
  const Objects = urls.map((url) => {
    return { Key: url };
  });

  const command = new DeleteObjectsCommand({
    Bucket,
    Delete: {
      Objects,
    },
  });

  return await s3Config().send(command);
};

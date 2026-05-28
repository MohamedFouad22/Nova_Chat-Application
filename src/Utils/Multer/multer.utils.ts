import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import os from "node:os";
import { v4 as uuid } from "uuid";
import { BadRequestException } from "../Response/error.response.utils";

export const ValidationTypeEnum = {
  image: ["image/jpeg", "image/png", "image/pjpeg", "image/webp"],
  video: ["video/mp4", "video/webm", "video/jpeg"],
  Document: [
    "application/vnd.ms-word.document.macroenabled.12",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
  pdf: ["application/pdf"],
  audio: ["audio/mpeg"],
};

export enum storageApproachEnum {
  MEMORY = "MEMORY",
  DISK = "DISK",
}

export const cloudFileValidtion = ({
  validation = [],
  maxSize = 2,
  storageApproach,
}: {
  validation: string[];
  maxSize: number;
  storageApproach: storageApproachEnum;
}) => {
  const storage =
    storageApproach === storageApproachEnum.MEMORY
      ? multer.memoryStorage()
      : multer.diskStorage({
          destination: (req: Request, file: Express.Multer.File, cb) => {
            return cb(null, os.tmpdir());
          },
          filename(req: Request, file: Express.Multer.File, cb) {
            return cb(null, `/${uuid}/${file.originalname}`);
          },
        });

  const fileFilter = function (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) {
    if (validation.length && !validation.includes(file.mimetype)) {
      return cb(new BadRequestException("File Filter Validation Error"));
    }
    return cb(null, true);
  };

  return multer({
    fileFilter,
    limits: { fileSize: maxSize * 1024 * 1024 },
    storage,
  });
};

import { Router } from "express";
const router = Router();
import userServices from "./user.services";
import { authentication } from "../../Middleware/authentication.middleware";
import { tokenTypeEnum } from "../../Utils/Token/token.utils";
import { RoleEnum } from "../../DB/Models/user.model";
import {
  cloudFileValidtion,
  storageApproachEnum,
  ValidationTypeEnum,
} from "../../Utils/Multer/multer.utils";
import chatRouter from "../Chat/chat.controller";

router.use("/:userId/chat", chatRouter);
router.post("/search", userServices.searchUser);
router.get(
  "/get-profile",
  authentication(tokenTypeEnum.ACCESS, [RoleEnum.USER, RoleEnum.ADMIN]),
  userServices.getProfile,
);
router.patch(
  "{/:userId}/freezed-account",
  authentication(tokenTypeEnum.ACCESS, [RoleEnum.USER, RoleEnum.ADMIN]),
  userServices.freezedAccount,
);
router.patch(
  "{/:userId}/restored-account",
  authentication(tokenTypeEnum.ACCESS, [RoleEnum.USER, RoleEnum.ADMIN]),
  userServices.restoredAccount,
);
router.post(
  "/profile-image",
  authentication(tokenTypeEnum.ACCESS, [RoleEnum.USER, RoleEnum.ADMIN]),
  cloudFileValidtion({
    validation: [...ValidationTypeEnum.image],
    maxSize: 10,
    storageApproach: storageApproachEnum.MEMORY,
  }).single("profileImage"),
  userServices.profileImage,
);
router.post(
  "/cover-images",
  authentication(tokenTypeEnum.ACCESS, [RoleEnum.USER, RoleEnum.ADMIN]),
  cloudFileValidtion({
    validation: [...ValidationTypeEnum.image],
    maxSize: 50,
    storageApproach: storageApproachEnum.MEMORY,
  }).array("coverImages", 5),
  userServices.coverImages,
);
router.post(
  "/large-files",
  authentication(tokenTypeEnum.ACCESS, [RoleEnum.USER, RoleEnum.ADMIN]),
  cloudFileValidtion({
    validation: [
      ...ValidationTypeEnum.image,
      ...ValidationTypeEnum.video,
      ...ValidationTypeEnum.audio,
      ...ValidationTypeEnum.pdf,
      ...ValidationTypeEnum.Document,
    ],
    maxSize: 5 * 1024,
    storageApproach: storageApproachEnum.MEMORY,
  }).array("largeFile", 10),
  userServices.largeFiles,
);
router.delete(
  "/delete-aws-file",
  authentication(tokenTypeEnum.ACCESS, [RoleEnum.USER, RoleEnum.ADMIN]),
  userServices.deleteAwsFile,
);
router.delete(
  "/delete-aws-files",
  authentication(tokenTypeEnum.ACCESS, [RoleEnum.USER, RoleEnum.ADMIN]),
  userServices.deleteAwsFiles,
);
router.post(
  "/delete-account-request",
  authentication(tokenTypeEnum.ACCESS, [RoleEnum.USER, RoleEnum.ADMIN]),
  userServices.deleteAccountRequest,
);
router.delete(
  "/delete-account",
  authentication(tokenTypeEnum.ACCESS, [RoleEnum.USER, RoleEnum.ADMIN]),
  userServices.deleteAccount,
);

export default router;

import { Router } from "express";
import chatServices from "../Chat/chat.services";
import { authentication } from "../../Middleware/authentication.middleware";
import { tokenTypeEnum } from "../../Utils/Token/token.utils";
import { RoleEnum } from "../../DB/Models/user.model";
const router = Router({
  mergeParams: true,
});

router.get(
  "/getChat",
  authentication(tokenTypeEnum.ACCESS, [RoleEnum.USER, RoleEnum.ADMIN]),
  chatServices.getChat,
);

export default router;

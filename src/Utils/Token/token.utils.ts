import {
  JwtPayload,
  PrivateKey,
  PublicKey,
  Secret,
  sign,
  SignOptions,
  verify,
} from "jsonwebtoken";
import { HUserDocument, RoleEnum, userModel } from "../../DB/Models/user.model";
import { v4 as uuid } from "uuid";
import {
  BadRequestException,
  NotFoundException,
  UnAuthorizedException,
} from "../Response/error.response.utils";
import { UserRepository } from "../../DB/Repository/user.repository";
import { TokenRepository } from "../../DB/Repository/token.repository";
import { tokenModel } from "../../DB/Models/token.model";

export enum signatureLevelEnum {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum tokenTypeEnum {
  ACCESS = "ACCESS",
  REFRESH = "REFRESH",
}

export const generateToken = async ({
  payload,
  secretKey,
  options,
}: {
  payload: string | Buffer | object;
  secretKey: Secret | PrivateKey;
  options?: SignOptions;
}): Promise<string> => {
  return await sign(payload, secretKey, options);
};

export const verifyToken = async ({
  token,
  secretKey,
}: {
  token: string;
  secretKey: Secret | PublicKey;
}): Promise<JwtPayload> => {
  return (await verify(token, secretKey)) as JwtPayload;
};

export const getSignatureLevel = async (role: RoleEnum = RoleEnum.USER) => {
  let signatureLevel: signatureLevelEnum = signatureLevelEnum.USER;

  switch (role) {
    case RoleEnum.USER:
      signatureLevel = signatureLevelEnum.USER;
      break;

    case RoleEnum.ADMIN:
      signatureLevel = signatureLevelEnum.ADMIN;
      break;

    default:
      break;
  }

  return signatureLevel;
};

export const getSignatures = async (
  signatureLevel: signatureLevelEnum = signatureLevelEnum.USER,
): Promise<{ accessToken: string; refreshToken: string }> => {
  let signatures: { accessToken: string; refreshToken: string } = {
    accessToken: "",
    refreshToken: "",
  };

  switch (signatureLevel) {
    case signatureLevelEnum.USER:
      signatures.accessToken = process.env.ACCESS_USER_TOKEN_SECRET as string;
      signatures.refreshToken = process.env.REFRESH_USER_TOKEN_SECRET as string;
      break;
    case signatureLevelEnum.ADMIN:
      signatures.accessToken = process.env.ACCESS_ADMIN_TOKEN_SECRET as string;
      signatures.refreshToken = process.env
        .REFRESH_ADMIN_TOKEN_SECRET as string;
      break;
    default:
      break;
  }

  return signatures;
};

export const createLoginCredentials = async (
  user: HUserDocument,
): Promise<{ accessToken: string; refreshToken: string }> => {
  let signatureLevel = await getSignatureLevel(user.role);
  let signatures = await getSignatures(signatureLevel);

  const accessToken = await generateToken({
    payload: {
      _id: user._id,
      email: user.email,
      name: user.userName,
      role: user.role,
    },
    secretKey: signatures.accessToken,
    options: {
      expiresIn: Number(process.env.ACCESS_KEY_EXPIRES_IN),
      jwtid: uuid(),
    },
  });

  const refreshToken = await generateToken({
    payload: {
      _id: user._id,
      email: user.email,
      name: user.userName,
      role: user.role,
    },
    secretKey: signatures.refreshToken,
    options: {
      expiresIn: Number(process.env.REFRESH_KEY_EXPIRES_IN),
      jwtid: uuid(),
    },
  });

  return { accessToken, refreshToken };
};

export const decodedToken = async ({
  authorization,
  tokenType = tokenTypeEnum.ACCESS,
}: {
  authorization: string;
  tokenType: tokenTypeEnum;
}) => {
  const _userModel = new UserRepository(userModel);

  const [bearer, token] = authorization.split(" ");
  if (!bearer || !token)
    throw new UnAuthorizedException("Invalid Token Format");

  const signatures = await getSignatures(bearer as signatureLevelEnum);

  const decoded = await verifyToken({
    token,
    secretKey:
      tokenType === tokenTypeEnum.REFRESH
        ? signatures.refreshToken
        : signatures.accessToken,
  });
  if (!decoded._id || !decoded.jti)
    throw new UnAuthorizedException("Invalid Token");

  const user = await _userModel.findOne({
    filter: {
      _id: decoded._id,
    },
  });
  if (!user) throw new NotFoundException("User Not Found");
  const _tokenModel = new TokenRepository(tokenModel);

  const checkToken = await _tokenModel.findOne({
    filter: {
      jwtid: decoded?.jti,
    },
  });
  if (checkToken) throw new BadRequestException("Token Revoked");

  if (
    !decoded.iat ||
    (user.changeCredientialsTime?.getTime() as number) > decoded.iat * 1000
  ) {
    throw new UnAuthorizedException("Token Revoked");
  }

  return { user, decoded };
};

export const createRevokedToken = async (decoded: JwtPayload) => {
  const _tokenModel = new TokenRepository(tokenModel);

  const [token] =
    (await _tokenModel.create({
      data: [
        {
          jwtid: decoded.jti as string,
          expiresIn: decoded.iat as number,
          userId: decoded._id,
        },
      ],
    })) || [];
  if (!token) throw new BadRequestException("Failed To Revoke Token");

  return token;
};

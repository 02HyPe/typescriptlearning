import { sign } from "jsonwebtoken";
import { string } from "zod";

export const AccessAndRefreshTokenGenerator = (
  userName: string,
  email: string
) => {
  const accessToken = accessTokenGenerator(userName, email);
  const refreshToken = refreshTokenGenerator(userName, email);
  return { accessToken, refreshToken };
};

export const accessTokenGenerator = (userName: string, email: string) => {
  const accessToken = sign(
    {
      userName: userName,
      email: email,
    },
    process.env.ACCESS_TOKEN_SECERET,
    { expiresIn: 60 * 3 }
  );
  return accessToken;
};
export const refreshTokenGenerator = (userName: string, email: string) => {
  const refreshToken = sign(
    {
      userName: userName,
      email: email,
    },
    process.env.REFRESH_TOKEN_SECERET,
    { expiresIn: "7h" }
  );
  return refreshToken;
};

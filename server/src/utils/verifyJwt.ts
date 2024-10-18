import jwt, { JwtPayload } from "jsonwebtoken";
type Payload = {
  id: string;
  username: string;
};
interface DecodedToken extends JwtPayload {
  id: string;
}
export const signJWT = (payload: Payload) => {
  if (!process.env.JWT_SECRET) {
    return;
  }
  return jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
  });
};

export const verifyJWT = (token: string): DecodedToken => {
  if (!process.env.JWT_SECRET) {
    return {} as DecodedToken;
  }
  return jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
};

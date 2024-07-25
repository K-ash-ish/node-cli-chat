import { createHash } from "crypto";

export const createToken = (value: string): string => {
  return createHash("sha256").update(value).digest("hex");
};

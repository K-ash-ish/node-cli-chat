import { compare, hash } from "bcrypt";

const saltRounds = 10;

export function createPasswordHash(plainText: string) {
  return new Promise((resolve, reject) => {
    hash(plainText, saltRounds, function hashing(err, hash) {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });
}

export function verifyHash(plainText: string, passwordHash: string) {
  return new Promise((resolve, reject) => {
    compare(plainText, passwordHash, function vefiy(err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

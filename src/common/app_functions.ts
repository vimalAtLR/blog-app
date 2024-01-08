import joi from 'joi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export function isEmpty(value: any): boolean {
  return value == null || value === undefined || value.length <= 0;
}

export async function isValidObject(payLoad: object, validation: object) {
  try {
    const validationObject = joi.object(validation);
    await validationObject.validateAsync(payLoad);
    return { status: true };
  } catch (error) {
    return { status: false, error: error.message };
  }
}

export function generateJWT(payLoad: object): string {
  payLoad = JSON.parse(JSON.stringify(payLoad));
  const token = jwt.sign(payLoad, process.env.JWT, {
    expiresIn: '24h',
  });
  return token;
}

export async function generateBcrypt(password: string): Promise<string> {
  let hash = await bcrypt.hash(password, 10);
  return hash;
}

export async function campareBcrypt(hash: string, password: string): Promise<any> {
  return bcrypt.compare(password, hash);
}

export function generateOtp(): String {
  return Math.floor(Math.random() * (999999 - 100000) + 100000).toString();
}

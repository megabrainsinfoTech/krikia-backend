import * as crypto from 'crypto';
/**
 * This Method generates a sha256 hash that can be used for sending token
 * @returns
 */
export function GenerateCryptoHash(seed?: string): string {
  const Token = seed ? seed : crypto.randomBytes(32).toString('hex');
  return crypto.createHash('sha256').update(Token).digest('hex');
}

export function compareCryptoHash(
  toHashStr: string,
  hashtoCompare: string,
): boolean {
  return GenerateCryptoHash(toHashStr) === hashtoCompare;
}

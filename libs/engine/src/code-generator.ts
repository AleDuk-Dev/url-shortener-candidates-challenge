const CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const CODE_LENGTH = 7;

export function generateShortCode(length: number = CODE_LENGTH): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes)
    .map((byte) => CHARSET[byte % CHARSET.length])
    .join('');
}

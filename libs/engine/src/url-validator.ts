const ALLOWED_PROTOCOLS = ['http:', 'https:'];
const MAX_URL_LENGTH = 2048;

export interface ValidationResult {
  valid: boolean;
  error?: string;
  normalizedUrl?: string;
}

export function validateUrl(input: string): ValidationResult {
  if (!input || input.trim().length === 0) {
    return { valid: false, error: 'URL is required' };
  }

  if (input.length > MAX_URL_LENGTH) {
    return { valid: false, error: 'URL is too long (max 2048 characters)' };
  }

  try {
    const url = new URL(input);
    if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
      return { valid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
    }
    return { valid: true, normalizedUrl: url.toString() };
  } catch {
    return { valid: false, error: 'Invalid URL format. Include http:// or https://' };
  }
}

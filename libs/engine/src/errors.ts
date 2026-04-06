export class UrlValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UrlValidationError';
  }
}

export class UrlNotFoundError extends Error {
  constructor(code: string) {
    super(`Short URL with code "${code}" not found`);
    this.name = 'UrlNotFoundError';
  }
}

export class RateLimitError extends Error {
  constructor() {
    super('Too many requests. Please try again later.');
    this.name = 'RateLimitError';
  }
}

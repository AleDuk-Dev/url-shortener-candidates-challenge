import type { IUrlRepository, CreateUrlResult, UrlStats } from "./types.js";
import { validateUrl } from "./url-validator.js";
import { generateShortCode } from "./code-generator.js";
import { UrlValidationError } from "./errors.js";

export class UrlShortenerService {
  constructor(private readonly repository: IUrlRepository) {}

  async createShortUrl(
    input: string,
    baseUrl: string
  ): Promise<CreateUrlResult> {
    const result = validateUrl(input);
    if (!result.valid || !result.normalizedUrl) {
      throw new UrlValidationError(result.error ?? "Invalid URL");
    }
    const normalizedUrl = result.normalizedUrl;

    const existing = await this.repository.findByOriginalUrl(normalizedUrl);
    if (existing) {
      return {
        code: existing.code,
        shortUrl: `${baseUrl}/s/${existing.code}`,
      };
    }

    let code: string | null = null;
    for (let i = 0; i < 5; i++) {
      const candidate = generateShortCode();
      const exists = await this.repository.codeExists(candidate);
      if (!exists) {
        code = candidate;
        break;
      }
    }
    if (!code) {
      throw new Error("Failed to generate a unique short code");
    }

    await this.repository.create(code, normalizedUrl);
    return { code, shortUrl: `${baseUrl}/s/${code}` };
  }

  async resolveCode(code: string): Promise<string | null> {
    const url = await this.repository.findByCode(code);
    if (!url) return null;
    void this.repository.incrementClicks(code).catch(() => {});
    return url.originalUrl;
  }

  async getUrlStats(code: string): Promise<UrlStats | null> {
    const url = await this.repository.findByCode(code);
    if (!url) return null;
    return {
      code: url.code,
      originalUrl: url.originalUrl,
      clicks: url.clicks,
      createdAt: url.createdAt,
    };
  }

  async getAllUrls(): Promise<UrlStats[]> {
    const urls = await this.repository.findAll();
    return urls.map((url) => ({
      code: url.code,
      originalUrl: url.originalUrl,
      clicks: url.clicks,
      createdAt: url.createdAt,
    }));
  }
}

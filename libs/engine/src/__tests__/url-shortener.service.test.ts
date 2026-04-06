import { describe, it, expect, beforeEach } from "vitest";
import { UrlShortenerService } from "../url-shortener.service.js";
import { UrlValidationError } from "../errors.js";
import type { IUrlRepository, ShortenedUrl } from "../types.js";

class InMemoryUrlRepository implements IUrlRepository {
  private store = new Map<string, ShortenedUrl>();

  async create(code: string, originalUrl: string): Promise<ShortenedUrl> {
    const record: ShortenedUrl = {
      id: crypto.randomUUID(),
      code,
      originalUrl,
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.store.set(code, record);
    return record;
  }

  async findByCode(code: string): Promise<ShortenedUrl | null> {
    return this.store.get(code) ?? null;
  }

  async findByOriginalUrl(originalUrl: string): Promise<ShortenedUrl | null> {
    for (const record of this.store.values()) {
      if (record.originalUrl === originalUrl) return record;
    }
    return null;
  }

  async incrementClicks(code: string): Promise<void> {
    const record = this.store.get(code);
    if (record) record.clicks += 1;
  }

  async findAll(): Promise<ShortenedUrl[]> {
    return [...this.store.values()];
  }

  async codeExists(code: string): Promise<boolean> {
    return this.store.has(code);
  }
}

const BASE_URL = "http://localhost:5173";

describe("UrlShortenerService", () => {
  let service: UrlShortenerService;

  beforeEach(() => {
    service = new UrlShortenerService(new InMemoryUrlRepository());
  });

  describe("createShortUrl", () => {
    it("creates a short URL for valid input", async () => {
      const result = await service.createShortUrl("https://example.com", BASE_URL);
      expect(result.code).toBeTruthy();
      expect(result.shortUrl).toBe(`${BASE_URL}/s/${result.code}`);
    });

    it("throws UrlValidationError for invalid URL", async () => {
      await expect(
        service.createShortUrl("not-a-url", BASE_URL)
      ).rejects.toThrow(UrlValidationError);
    });

    it("returns the same code for a duplicate original URL", async () => {
      const first = await service.createShortUrl("https://example.com", BASE_URL);
      const second = await service.createShortUrl("https://example.com", BASE_URL);
      expect(second.code).toBe(first.code);
    });
  });

  describe("resolveCode", () => {
    it("returns the original URL for an existing code", async () => {
      const { code } = await service.createShortUrl("https://example.com", BASE_URL);
      const resolved = await service.resolveCode(code);
      expect(resolved).toBe("https://example.com/");
    });

    it("returns null for a non-existent code", async () => {
      const resolved = await service.resolveCode("nonexistent");
      expect(resolved).toBeNull();
    });
  });

  describe("getAllUrls", () => {
    it("returns all stored URLs", async () => {
      await service.createShortUrl("https://example.com", BASE_URL);
      await service.createShortUrl("https://google.com", BASE_URL);
      const all = await service.getAllUrls();
      expect(all).toHaveLength(2);
    });
  });
});

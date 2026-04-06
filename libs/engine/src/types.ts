export interface ShortenedUrl {
  id: string;
  code: string;
  originalUrl: string;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUrlResult {
  code: string;
  shortUrl: string;
}

export interface UrlStats {
  code: string;
  originalUrl: string;
  clicks: number;
  createdAt: Date;
}

export interface IUrlRepository {
  create(code: string, originalUrl: string): Promise<ShortenedUrl>;
  findByCode(code: string): Promise<ShortenedUrl | null>;
  findByOriginalUrl(originalUrl: string): Promise<ShortenedUrl | null>;
  incrementClicks(code: string): Promise<void>;
  findAll(): Promise<ShortenedUrl[]>;
  codeExists(code: string): Promise<boolean>;
}

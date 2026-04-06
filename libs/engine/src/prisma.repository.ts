import type { IUrlRepository, ShortenedUrl } from "./types.js";
import type { PrismaClient } from "@prisma/client";

export class PrismaUrlRepository implements IUrlRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(code: string, originalUrl: string): Promise<ShortenedUrl> {
    return this.prisma.shortenedUrl.create({
      data: { code, originalUrl },
    });
  }

  async findByCode(code: string): Promise<ShortenedUrl | null> {
    return this.prisma.shortenedUrl.findUnique({
      where: { code },
    });
  }

  async findByOriginalUrl(originalUrl: string): Promise<ShortenedUrl | null> {
    return this.prisma.shortenedUrl.findFirst({
      where: { originalUrl },
    });
  }

  async incrementClicks(code: string): Promise<void> {
    await this.prisma.shortenedUrl.update({
      where: { code },
      data: { clicks: { increment: 1 } },
    });
  }

  async findAll(): Promise<ShortenedUrl[]> {
    return this.prisma.shortenedUrl.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async codeExists(code: string): Promise<boolean> {
    const count = await this.prisma.shortenedUrl.count({
      where: { code },
    });
    return count > 0;
  }
}

import { redirect } from "react-router";
import type { Route } from "./+types/s.$code";
import {
  UrlShortenerService,
  PrismaUrlRepository,
  prisma,
} from "@url-shortener/engine";

const repository = new PrismaUrlRepository(prisma);
const service = new UrlShortenerService(repository);

export async function loader({ params }: Route.LoaderArgs) {
  const { code } = params;
  const originalUrl = await service.resolveCode(code);

  if (!originalUrl) {
    throw new Response("Short URL not found", { status: 404 });
  }

  return redirect(originalUrl);
}

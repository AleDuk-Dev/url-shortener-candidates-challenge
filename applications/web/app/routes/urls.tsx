import { Link } from "react-router";
import type { Route } from "./+types/urls";
import {
  UrlShortenerService,
  PrismaUrlRepository,
  prisma,
} from "@url-shortener/engine";
import { UrlList } from "../components/url-list";

const repository = new PrismaUrlRepository(prisma);
const service = new UrlShortenerService(repository);

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Link Statistics — URL Shortener" },
    { name: "description", content: "View statistics for all shortened URLs" },
  ];
}

export async function loader(_args: Route.LoaderArgs) {
  const baseUrl = process.env.PUBLIC_URL ?? "http://localhost:5173";
  const urls = await service.getAllUrls();
  return {
    urls: urls.map((u) => ({
      ...u,
      shortUrl: `${baseUrl}/s/${u.code}`,
    })),
  };
}

export default function UrlsPage({ loaderData }: Route.ComponentProps) {
  const { urls } = loaderData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Link Statistics</h1>
        <Link
          to="/"
          className="text-sm text-violet-600 hover:text-violet-800 font-medium transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
      <UrlList urls={urls} />
    </div>
  );
}

import { useNavigation, useActionData } from "react-router";
import type { Route } from "./+types/_index";
import {
  UrlShortenerService,
  PrismaUrlRepository,
  prisma,
  RateLimiter,
  UrlValidationError,
} from "@url-shortener/engine";
import { UrlForm } from "../components/url-form";
import { UrlResult } from "../components/url-result";
import { UrlList } from "../components/url-list";
import { ErrorMessage } from "../components/error-message";

const repository = new PrismaUrlRepository(prisma);
const service = new UrlShortenerService(repository);
const rateLimiter = new RateLimiter();

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "URL Shortener" },
    { name: "description", content: "Shorten your URLs quickly and easily" },
  ];
}

export async function loader(_args: Route.LoaderArgs) {
  const baseUrl = process.env.PUBLIC_URL ?? "http://localhost:5173";
  const urls = await service.getAllUrls();
  return {
    baseUrl,
    urls: urls.map((u) => ({
      ...u,
      shortUrl: `${baseUrl}/s/${u.code}`,
    })),
  };
}

export async function action({ request }: Route.ActionArgs) {
  const baseUrl = process.env.PUBLIC_URL ?? "http://localhost:5173";
  const formData = await request.formData();
  const url = String(formData.get("url") ?? "");

  const ip =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("host") ??
    "unknown";

  if (!rateLimiter.isAllowed(ip)) {
    return { result: null, error: "Too many requests. Please try again later." };
  }

  try {
    const result = await service.createShortUrl(url, baseUrl);
    return { result: { shortUrl: result.shortUrl, originalUrl: url }, error: null };
  } catch (err) {
    if (err instanceof UrlValidationError) {
      return { result: null, error: err.message };
    }
    return { result: null, error: "An unexpected error occurred." };
  }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { urls, baseUrl: _baseUrl } = loaderData;
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center pt-6 pb-2">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 leading-tight tracking-tight">
          Shorter Links.
          <br />
          <span className="text-violet-600">Deeper Engagement.</span>
        </h1>
        <p className="mt-4 text-slate-500 text-lg max-w-md mx-auto">
          Paste a long URL and get a clean, shareable short link instantly.
        </p>
      </div>

      {/* Form */}
      <UrlForm isSubmitting={isSubmitting} />

      {/* Error */}
      {actionData?.error && <ErrorMessage message={actionData.error} />}

      {/* Result */}
      {actionData?.result && (
        <UrlResult
          shortUrl={actionData.result.shortUrl}
          originalUrl={actionData.result.originalUrl}
        />
      )}

      {/* List */}
      <UrlList urls={urls} />
    </div>
  );
}

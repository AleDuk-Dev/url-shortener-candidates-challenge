interface UrlItem {
  code: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: Date;
}

interface UrlListProps {
  urls: UrlItem[];
}

export function UrlList({ urls }: UrlListProps) {
  if (urls.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        No links yet. Create your first one above!
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-base font-semibold text-slate-700">Recent Links</h2>
        <div className="flex-1 h-px bg-slate-100" />
      </div>
      <div className="space-y-2">
        {urls.map((item) => (
          <div
            key={item.code}
            className="bg-white rounded-xl border border-slate-100 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
          >
            <a
              href={item.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={item.shortUrl}
              className="text-sm font-medium text-violet-600 hover:text-violet-800 transition-colors shrink-0"
            >
              {item.shortUrl}
            </a>
            <span
              className="flex-1 text-sm text-slate-500 truncate"
              title={item.originalUrl}
            >
              {item.originalUrl}
            </span>
            <div className="flex items-center gap-3 shrink-0">
              <span className="bg-violet-100 text-violet-700 rounded-full px-3 py-0.5 text-xs font-medium">
                {item.clicks} {item.clicks === 1 ? "click" : "clicks"}
              </span>
              <span className="hidden sm:block text-xs text-slate-400">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

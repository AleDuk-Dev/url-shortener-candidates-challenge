import { useState } from "react";

interface UrlResultProps {
  shortUrl: string;
  originalUrl: string;
}

export function UrlResult({ shortUrl, originalUrl }: UrlResultProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(shortUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border-l-4 border-violet-500 p-5">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
        Your shortened URL
      </p>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-lg font-semibold text-violet-600 hover:text-violet-800 break-all transition-colors"
        >
          {shortUrl}
        </a>
        <button
          onClick={handleCopy}
          className={`min-h-[36px] px-4 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none cursor-pointer whitespace-nowrap ${
            copied
              ? "bg-green-100 text-green-700 focus-visible:ring-green-500"
              : "bg-violet-100 text-violet-700 hover:bg-violet-200 focus-visible:ring-violet-500"
          }`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p
        className="mt-2 text-sm text-slate-400 break-words"
        title={originalUrl}
      >
        {originalUrl}
      </p>
    </div>
  );
}

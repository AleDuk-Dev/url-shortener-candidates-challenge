import { Form } from "react-router";

interface UrlFormProps {
  isSubmitting: boolean;
}

export function UrlForm({ isSubmitting }: UrlFormProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-violet-100 p-4">
      <Form method="post" action="?index" className="flex flex-col sm:flex-row gap-3">
        <input
          type="url"
          name="url"
          required
          placeholder="Paste your long URL here..."
          className="flex-1 min-h-[44px] px-4 py-2.5 text-base text-slate-800 placeholder-slate-400 bg-slate-50 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-violet-500 transition-shadow"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-[44px] px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white text-sm font-medium rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isSubmitting ? "Shortening…" : "Shorten URL"}
        </button>
      </Form>
    </div>
  );
}

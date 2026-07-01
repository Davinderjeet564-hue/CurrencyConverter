import React, { useState } from "react";

interface ApiKeyModalProps {
  onKeySave: (key: string) => void;
}

export default function ApiKeyModal({ onKeySave }: ApiKeyModalProps) {
  const [keyInput, setKeyInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedKey = keyInput.trim();
    if (!trimmedKey) {
      setError("API Key cannot be empty");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Validate the API key by making a request to the ExchangeRate-API endpoint
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${trimmedKey}/latest/USD`
      );
      const data = await response.json();

      if (response.ok && data.result === "success") {
        onKeySave(trimmedKey);
      } else {
        const errorMsg = data["error-type"]
          ? `Invalid API Key: ${data["error-type"]}`
          : "Invalid API key. Please check the key and try again.";
        setError(errorMsg);
      }
    } catch (err) {
      console.error("API validation error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 transition-all duration-300">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-100 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m-3.418 4.818l-2.828-2.828M11.5 8.5a4.5 4.5 0 10-4.5 4.5h2.5l.5 1.5.5-1.5H11.5z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              API Key Required
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              To fetch live exchange rates, please enter your ExchangeRate-API key.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="api-key"
              className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              API Key
            </label>
            <input
              id="api-key"
              type="text"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="e.g. a5439ed7055279365376085e"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 focus:outline-none transition-all placeholder-slate-400 text-slate-900 dark:text-white"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-xl text-sm text-red-600 dark:text-red-400 flex items-start gap-2.5">
              <svg
                className="w-5 h-5 shrink-0 text-red-500 dark:text-red-400 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-linear-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Validating Key...</span>
              </>
            ) : (
              <span>Save & Connect</span>
            )}
          </button>
        </form>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don't have an API key?{" "}
            <a
              href="https://www.exchangerate-api.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline transition-colors"
            >
              Get a free key here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

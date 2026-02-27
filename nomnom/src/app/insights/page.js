"use client";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { useEffect, useState } from "react";

export default function Page() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function retrieve_insights() {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            startDate: "2025-01-02",
            endDate: "2025-04-04",
            question: "Give me a few suggestions for the next few weeks",
          }),
        });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const data = await res.json();
        console.log("API response:", data);

        // Handle both {insights: {...}} and a flat object returned directly
        setInsights(data.insights ?? data);
      } catch (err) {
        // Ignore aborts — this is Strict Mode cleaning up the first call
        if (err.name === "AbortError") return;
        console.error("Failed to fetch insights:", err);
        setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    retrieve_insights();

    // Strict Mode calls this cleanup, aborting the first fetch at the network level.
    // The second mount starts a fresh request with a new controller.
    return () => controller.abort();
  }, []);

  const priorityColor = (p) => {
    if (p === "high") return "bg-red-300 text-red-800";
    if (p === "medium") return "bg-yellow-300 text-yellow-800";
    return "bg-green-300 text-green-800";
  };

  const recommendationColor = (r) => {
    if (r === "halt") return "bg-red-300 text-red-800";
    if (r === "reduce") return "bg-yellow-300 text-yellow-800";
    if (r === "increase") return "bg-blue-300 text-blue-800";
    return "bg-green-300 text-green-800";
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="flex flex-col text-white w-full h-full gap-6 p-20">

        {/* ── Loading state ── */}
        {loading && (
          <p className="text-zinc-400 text-center text-lg animate-pulse">
            Generating AI insights…
          </p>
        )}

        {/* ── Error state ── */}
        {error && (
          <div className="bg-red-900 border border-red-500 rounded-xl p-4 text-red-200">
            <p className="font-semibold">Failed to load insights</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* ── Loaded state ── */}
        {!loading && !error && insights && (
          <>
            {/* Summary banner */}
            {insights.summary && (
              <div className="bg-zinc-800 rounded-xl p-5 border border-zinc-700">
                <p className="text-zinc-200 text-lg">{insights.summary}</p>
              </div>
            )}

            {/* Suggested Actions */}
            {insights.suggested_actions?.length > 0 && (
              <>
                <h1 className="text-3xl font-semibold text-zinc-50">Suggested Actions</h1>
                <div className="flex flex-col gap-3">
                  {insights.suggested_actions.map((action, i) => (
                    <div key={i} className="bg-zinc-800 rounded-xl p-4 flex flex-col gap-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        {action.priority && (
                          <span className={`text-sm px-3 py-1 rounded-xl font-medium ${priorityColor(action.priority)}`}>
                            {action.priority}
                          </span>
                        )}
                        <h2 className="text-xl font-bold text-zinc-50">{action.title}</h2>
                      </div>
                      <p className="text-zinc-300">{action.description}</p>
                      {action.estimated_savings > 0 && (
                        <p className="text-green-400 font-medium">
                          Estimated savings: RM{Number(action.estimated_savings).toFixed(2)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Overstocked Ingredients */}
            {insights.overstocked?.length > 0 && (
              <>
                <h1 className="text-3xl font-semibold text-zinc-50">Overstocked Ingredients</h1>
                <div className="flex flex-col gap-3">
                  {insights.overstocked.map((item, i) => (
                    <div key={i} className="bg-zinc-800 rounded-xl p-4 flex flex-row justify-between items-center flex-wrap gap-3">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-bold text-zinc-50">{item.ingredient}</h2>
                        <p className="text-zinc-400 text-sm">
                          {item.stock} units · {item.days_of_supply} days supply · shelf life {item.shelf_life_days} days
                        </p>
                        <p className="text-red-400 text-sm">{item.action}</p>
                      </div>
                      {item.estimated_value != null && (
                        <p className="text-zinc-200 font-semibold text-lg">
                          RM{Number(item.estimated_value).toFixed(2)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Poor Sellers */}
            {insights.poor_sellers?.length > 0 && (
              <>
                <h1 className="text-3xl font-semibold text-zinc-50">Poor Selling Items</h1>
                <div className="flex flex-col gap-3">
                  {insights.poor_sellers.map((item, i) => (
                    <div key={i} className="bg-zinc-800 rounded-xl p-4 flex flex-row justify-between items-center flex-wrap gap-3">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-bold text-zinc-50">{item.item}</h2>
                        <p className="text-zinc-400 text-sm">{item.note}</p>
                      </div>
                      <p className="text-red-400 font-semibold">{item.units_sold} sold</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Purchasing Adjustments */}
            {insights.purchasing_adjustments?.length > 0 && (
              <>
                <h1 className="text-3xl font-semibold text-zinc-50">Purchasing Adjustments</h1>
                <div className="flex flex-col gap-3">
                  {insights.purchasing_adjustments.map((item, i) => (
                    <div key={i} className="bg-zinc-800 rounded-xl p-4 flex flex-row justify-between items-center flex-wrap gap-3">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-bold text-zinc-50">{item.ingredient}</h2>
                        <p className="text-zinc-400 text-sm">{item.detail}</p>
                      </div>
                      {item.recommendation && (
                        <span className={`px-3 py-1 rounded-xl font-medium text-sm ${recommendationColor(item.recommendation)}`}>
                          {item.recommendation}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Fallback: loaded but no data */}
        {!loading && !error && !insights && (
          <p className="text-zinc-500 text-center">No insights returned from the server.</p>
        )}

      </main>
    </div>
  );
}
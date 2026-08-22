import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import api from "../api/client";

const metricMeta = [
  { key: "girlsSupported", name: "Girls Reached", color: "#5B21B6" },
  { key: "schoolsReached", name: "Schools Visited", color: "#F4B400" },
  { key: "padsDistributed", name: "Pads Distributed", color: "#EC4899" },
  { key: "materialsDelivered", name: "Educational Materials", color: "#A78BFA" },
];

export default function ImpactAnalytics() {
  const [totals, setTotals] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/schools/analytics")
      .then((res) => {
        const t = res.data.totals || {};
        setTotals({
          girlsSupported: t.totalGirlsSupported || 0,
          schoolsReached: t.totalSchools || 0,
          padsDistributed: t.totalPadsDistributed || 0,
          materialsDelivered: t.totalMaterialsDelivered || 0,
        });
      })
      .catch(() => setError("Couldn't load impact data."));
  }, []);

  const data = metricMeta.map((m) => ({
    ...m,
    value: totals ? totals[m.key] : 0,
  }));

  const hasData = totals && data.some((d) => d.value > 0);

  return (
    <div className="bg-white rounded-2xl border border-charcoal/10 p-5 sm:p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-heading font-bold text-charcoal">Impact Analytics</h3>
        <span className="text-xs font-semibold text-charcoal/40 border border-charcoal/15 rounded-full px-3 py-1">
          All-time
        </span>
      </div>

      {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
      {!totals && !error && <p className="text-xs text-charcoal/50">Loading...</p>}

      {totals && (
        <div className="flex items-center gap-4">
          <div className="w-32 h-32 shrink-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={hasData ? data : [{ name: "empty", value: 1, color: "#F5F3FF" }]}
                  dataKey="value"
                  innerRadius={38}
                  outerRadius={58}
                  paddingAngle={hasData ? 2 : 0}
                  stroke="none"
                >
                  {(hasData ? data : [{ color: "#F5F3FF" }]).map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-heading font-bold text-lg text-charcoal">
                {totals.girlsSupported.toLocaleString()}
              </p>
              <p className="text-[10px] text-charcoal/50">Girls Supported</p>
            </div>
          </div>

          <div className="flex-1 space-y-2.5 min-w-0">
            {data.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs gap-2">
                <span className="flex items-center gap-2 text-charcoal/70 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="truncate">{d.name}</span>
                </span>
                <span className="font-semibold text-charcoal shrink-0">
                  {d.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
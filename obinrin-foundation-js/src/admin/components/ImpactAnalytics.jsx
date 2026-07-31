import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Girls Reached", value: 5320, change: "+15.7%", color: "#5B21B6" },
  { name: "Schools Visited", value: 87, change: "+10.2%", color: "#F4B400" },
  { name: "Pads Distributed", value: 3850, change: "+18.4%", color: "#FCE7F3" },
  { name: "Educational Materials", value: 2150, change: "+14.2%", color: "#22C55E" },
];

export default function ImpactAnalytics() {
  return (
    <div className="bg-white rounded-2xl border border-charcoal/10 p-5 sm:p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-heading font-bold text-charcoal">Impact Analytics</h3>
        <button className="text-xs font-medium text-charcoal/50 border border-charcoal/15 rounded-full px-3 py-1">
          This Month
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-32 h-32 shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={38}
                outerRadius={58}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-heading font-bold text-lg text-charcoal">5,320</p>
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
              <span className="flex items-center gap-1.5 shrink-0">
                <span className="font-semibold text-charcoal">{d.value.toLocaleString()}</span>
                <span className="text-success">{d.change}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

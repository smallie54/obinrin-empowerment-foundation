import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import api from "../../admin/api/client";

const COLORS = ["#5B21B6", "#F4B400", "#FCE7F3", "#22C55E"];

function formatMoney(amountInSmallestUnit, currency) {
  const value = (amountInSmallestUnit || 0) / 100;
  const symbol = currency === "USD" ? "$" : currency === "NGN" ? "₦" : `${currency} `;
  return `${symbol}${value.toLocaleString()}`;
}

export default function Reports() {
  const [donationAnalytics, setDonationAnalytics] = useState(null);
  const [schoolAnalytics, setSchoolAnalytics] = useState(null);
  const [volunteerAnalytics, setVolunteerAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/donations/analytics"),
      api.get("/schools/analytics"),
      api.get("/volunteers/analytics"),
    ])
      .then(([d, s, v]) => {
        setDonationAnalytics(d.data);
        setSchoolAnalytics(s.data);
        setVolunteerAnalytics(v.data);
      })
      .catch(() => setError("Couldn't load report data."));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-heading font-bold text-2xl text-charcoal">Reports & Analytics</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-charcoal/10 p-6">
          <h3 className="font-heading font-bold text-charcoal mb-4">Donations by Provider</h3>
          {donationAnalytics?.byProvider?.length > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donationAnalytics.byProvider.map((p) => ({
                      name: p._id,
                      value: p.count,
                    }))}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                  >
                    {donationAnalytics.byProvider.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-charcoal/50">No successful donations yet.</p>
          )}
          <div className="mt-4 space-y-2">
            {donationAnalytics?.byProvider?.map((p) => (
              <div key={p._id} className="flex justify-between text-sm">
                <span className="capitalize text-charcoal/70">{p._id}</span>
                <span className="font-semibold text-charcoal">
                  {formatMoney(p.amount, p._id === "stripe" ? "USD" : "NGN")} ({p.count} gifts)
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-charcoal/10 p-6">
          <h3 className="font-heading font-bold text-charcoal mb-4">Girls Supported by Country</h3>
          {schoolAnalytics?.byCountry?.length > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={schoolAnalytics.byCountry}>
                  <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="girlsSupported" fill="#5B21B6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-charcoal/50">No school records yet.</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-charcoal/10 p-6">
          <h3 className="font-heading font-bold text-charcoal mb-4">Programs by Status</h3>
          <div className="space-y-3">
            {schoolAnalytics?.byStatus?.map((s) => (
              <div key={s._id} className="flex items-center justify-between text-sm">
                <span className="capitalize text-charcoal/70">{s._id}</span>
                <span className="font-heading font-bold text-charcoal">{s.count}</span>
              </div>
            ))}
            {!schoolAnalytics?.byStatus?.length && (
              <p className="text-sm text-charcoal/50">No data yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-charcoal/10 p-6">
          <h3 className="font-heading font-bold text-charcoal mb-4">Volunteers by Status</h3>
          <div className="space-y-3">
            {volunteerAnalytics?.byStatus?.map((v) => (
              <div key={v._id} className="flex items-center justify-between text-sm">
                <span className="capitalize text-charcoal/70">{v._id}</span>
                <span className="font-heading font-bold text-charcoal">{v.count}</span>
              </div>
            ))}
            {!volunteerAnalytics?.byStatus?.length && (
              <p className="text-sm text-charcoal/50">No volunteers yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
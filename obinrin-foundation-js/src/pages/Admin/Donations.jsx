import { useEffect, useState } from "react";
import { CheckCircle2, Clock, XCircle, Repeat } from "lucide-react";
import api from "../../admin/api/client";

function formatMoney(amountInSmallestUnit, currency) {
  const value = (amountInSmallestUnit || 0) / 100;
  const symbol = currency === "USD" ? "$" : currency === "NGN" ? "₦" : `${currency} `;
  return `${symbol}${value.toLocaleString()}`;
}

const statusStyle = {
  successful: { icon: CheckCircle2, className: "text-success" },
  pending: { icon: Clock, className: "text-gold" },
  failed: { icon: XCircle, className: "text-red-500" },
};

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [search, setSearch] = useState("");

  function load() {
    setLoading(true);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    if (providerFilter) params.provider = providerFilter;

    Promise.all([
      api.get("/donations", { params }),
      api.get("/donations/analytics"),
    ])
      .then(([donationsRes, analyticsRes]) => {
        setDonations(donationsRes.data);
        setAnalytics(analyticsRes.data);
      })
      .catch(() => setError("Couldn't load donations."))
      .finally(() => setLoading(false));
  }

  useEffect(load, [statusFilter, providerFilter]);

  const filtered = donations.filter(
    (d) =>
      !search ||
      d.donorEmail?.toLowerCase().includes(search.toLowerCase()) ||
      d.donorName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="font-heading font-bold text-2xl text-charcoal">Donations</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-charcoal/10 p-4">
          <p className="text-xs text-charcoal/50">Total Successful Gifts</p>
          <p className="font-heading font-bold text-2xl text-charcoal mt-1">
            {analytics?.totals?.totalDonations?.toLocaleString() ?? "…"}
          </p>
        </div>
        {analytics?.byProvider?.map((p) => (
          <div key={p._id} className="bg-white rounded-2xl border border-charcoal/10 p-4">
            <p className="text-xs text-charcoal/50 capitalize">{p._id} Total</p>
            <p className="font-heading font-bold text-2xl text-charcoal mt-1">
              {formatMoney(p.amount, p._id === "stripe" ? "USD" : "NGN")}
            </p>
            <p className="text-xs text-charcoal/40 mt-1">{p.count} gifts</p>
          </div>
        ))}
        {!analytics?.byProvider?.length && (
          <div className="bg-white rounded-2xl border border-charcoal/10 p-4 col-span-2 md:col-span-3">
            <p className="text-xs text-charcoal/50">No successful donations yet.</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search by donor name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[220px] border border-charcoal/15 rounded-full px-4 py-2.5 text-sm outline-none focus:border-purple"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-charcoal/15 rounded-lg px-3 py-2.5 text-sm outline-none"
        >
          <option value="">All statuses</option>
          <option value="successful">Successful</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <select
          value={providerFilter}
          onChange={(e) => setProviderFilter(e.target.value)}
          className="border border-charcoal/15 rounded-lg px-3 py-2.5 text-sm outline-none"
        >
          <option value="">All providers</option>
          <option value="stripe">Stripe</option>
          <option value="paystack">Paystack</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-charcoal/10 overflow-hidden">
        {loading && <p className="p-6 text-sm text-charcoal/50">Loading...</p>}
        {error && <p className="p-6 text-sm text-red-600">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="p-6 text-sm text-charcoal/50">No donations match these filters.</p>
        )}

        {!loading && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[720px]">
              <thead>
                <tr className="text-xs text-charcoal/40 border-b border-charcoal/10">
                  <th className="py-3 px-6 font-medium">Donor</th>
                  <th className="py-3 px-6 font-medium">Amount</th>
                  <th className="py-3 px-6 font-medium">Provider</th>
                  <th className="py-3 px-6 font-medium">Date</th>
                  <th className="py-3 px-6 font-medium">Status</th>
                  <th className="py-3 px-6 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => {
                  const StatusIcon = statusStyle[d.status]?.icon || Clock;
                  return (
                    <tr key={d._id} className="border-b border-charcoal/5 last:border-0">
                      <td className="py-3 px-6">
                        <p className="font-semibold text-charcoal">
                          {d.donorName || "—"}
                        </p>
                        <p className="text-xs text-charcoal/50">{d.donorEmail}</p>
                      </td>
                      <td className="py-3 px-6 text-charcoal/70">
                        {formatMoney(d.amount, d.currency)}
                      </td>
                      <td className="py-3 px-6 text-charcoal/70 capitalize">{d.provider}</td>
                      <td className="py-3 px-6 text-charcoal/70">
                        {new Date(d.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-6">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-medium capitalize ${statusStyle[d.status]?.className}`}
                        >
                          <StatusIcon size={12} />
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-2">
                          {d.isRecurring && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple/10 text-purple">
                              <Repeat size={10} /> Recurring
                            </span>
                          )}
                          {d.dedicatedTo && (
                            <span className="text-[10px] text-charcoal/50 truncate max-w-[120px]">
                              For: {d.dedicatedTo}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
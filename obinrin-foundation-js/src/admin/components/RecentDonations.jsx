import { useEffect, useState } from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import api from "../api/client";

function formatMoney(amountInSmallestUnit, currency) {
  const value = amountInSmallestUnit / 100;
  const symbol = currency === "USD" ? "$" : currency === "NGN" ? "₦" : `${currency} `;
  return `${symbol}${value.toLocaleString()}`;
}

const statusStyle = {
  successful: { icon: CheckCircle2, className: "text-success" },
  pending: { icon: Clock, className: "text-gold" },
  failed: { icon: XCircle, className: "text-red-500" },
};

export default function RecentDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/donations")
      .then((res) => setDonations(res.data.slice(0, 5)))
      .catch(() => setError("Couldn't load donations."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-charcoal/10 p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-charcoal">Recent Donations</h3>
        <button className="text-xs font-semibold text-purple">View All</button>
      </div>

      {loading && <p className="text-xs text-charcoal/50">Loading...</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
      {!loading && !error && donations.length === 0 && (
        <p className="text-xs text-charcoal/50">No donations yet.</p>
      )}

      {!loading && donations.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[480px]">
            <thead>
              <tr className="text-xs text-charcoal/40 border-b border-charcoal/10">
                <th className="py-2 font-medium">Donor</th>
                <th className="py-2 font-medium">Amount</th>
                <th className="py-2 font-medium">Provider</th>
                <th className="py-2 font-medium">Date</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => {
                const StatusIcon = statusStyle[d.status]?.icon || Clock;
                return (
                  <tr key={d._id} className="border-b border-charcoal/5 last:border-0">
                    <td className="py-2.5 font-medium text-charcoal">
                      {d.donorName || d.donorEmail}
                    </td>
                    <td className="py-2.5 text-charcoal/70">
                      {formatMoney(d.amount, d.currency)}
                    </td>
                    <td className="py-2.5 text-charcoal/70 capitalize">{d.provider}</td>
                    <td className="py-2.5 text-charcoal/70">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium capitalize ${statusStyle[d.status]?.className}`}
                      >
                        <StatusIcon size={12} />
                        {d.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

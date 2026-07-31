import { useEffect, useState } from "react";
import api from "../../admin/api/client";

function formatMoney(amountInSmallestUnit, currency) {
  const value = (amountInSmallestUnit || 0) / 100;
  const symbol = currency === "USD" ? "$" : currency === "NGN" ? "₦" : `${currency || ""} `;
  return `${symbol}${value.toLocaleString()}`;
}

export default function Donors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/donors")
      .then((res) => setDonors(res.data))
      .catch(() => setError("Couldn't load donors."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = donors.filter(
    (d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-charcoal">Donors</h1>
          <p className="text-sm text-charcoal/50 mt-1">
            Auto-built from successful donations — records update automatically as donations settle.
          </p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm border border-charcoal/15 rounded-full px-4 py-2.5 text-sm outline-none focus:border-purple"
      />

      <div className="bg-white rounded-2xl border border-charcoal/10 overflow-hidden">
        {loading && <p className="p-6 text-sm text-charcoal/50">Loading...</p>}
        {error && <p className="p-6 text-sm text-red-600">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="p-6 text-sm text-charcoal/50">No donors found.</p>
        )}

        {!loading && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[640px]">
              <thead>
                <tr className="text-xs text-charcoal/40 border-b border-charcoal/10">
                  <th className="py-3 px-6 font-medium">Donor</th>
                  <th className="py-3 px-6 font-medium">Total Donated</th>
                  <th className="py-3 px-6 font-medium">Donations</th>
                  <th className="py-3 px-6 font-medium">Last Gift</th>
                  <th className="py-3 px-6 font-medium">Newsletter</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d._id} className="border-b border-charcoal/5 last:border-0">
                    <td className="py-3 px-6">
                      <p className="font-semibold text-charcoal">{d.name || "—"}</p>
                      <p className="text-xs text-charcoal/50">{d.email}</p>
                    </td>
                    <td className="py-3 px-6 text-charcoal/70">
                      {d.totalsByCurrency?.length
                        ? d.totalsByCurrency
                            .map((t) => formatMoney(t.amount, t.currency))
                            .join(" + ")
                        : "—"}
                    </td>
                    <td className="py-3 px-6 text-charcoal/70">{d.donationCount}</td>
                    <td className="py-3 px-6 text-charcoal/70">
                      {d.lastDonationAt
                        ? new Date(d.lastDonationAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-3 px-6">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          d.subscribedToNewsletter
                            ? "bg-success/15 text-success"
                            : "bg-charcoal/10 text-charcoal/50"
                        }`}
                      >
                        {d.subscribedToNewsletter ? "Subscribed" : "Not subscribed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
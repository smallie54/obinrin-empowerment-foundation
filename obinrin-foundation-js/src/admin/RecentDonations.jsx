import { useEffect, useState } from "react";
import { Check, Clock } from "lucide-react";
import api from "../admin/api/client";

const methodLabels = {
  stripe: "Card (Stripe)",
  paystack: "Paystack",
  bank_transfer: "Bank Transfer",
  opay: "Opay",
  cash: "Cash",
  manual: "Manual",
};

function formatAmount(cents, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format((cents || 0) / 100);
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatusIcon({ done, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-xs ${done ? "text-success" : "text-charcoal/40"}`}
    >
      {done ? <Check size={13} /> : <Clock size={13} />}
      {done ? "Sent" : "Pending"}
    </button>
  );
}

export default function RecentDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadDonations() {
    try {
      const { data } = await api.get("/donations", { params: { status: "successful" } });
      setDonations(data.slice(0, 5));
    } catch (err) {
      console.error("Failed to load donations", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDonations();
  }, []);

  async function toggleFlag(donation, field) {
    try {
      await api.patch(`/donations/${donation._id}/flags`, { [field]: !donation[field] });
      loadDonations();
    } catch (err) {
      console.error("Failed to update donation", err);
    }
  }

  return (
    <section className="bg-white rounded-2xl border border-charcoal/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-bold text-charcoal">Recent Donations</h2>
        <button className="text-xs font-semibold text-purple">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[520px]">
          <thead>
            <tr className="text-xs text-charcoal/50 text-left border-b border-charcoal/10">
              <th className="py-2 font-medium">Donor</th>
              <th className="py-2 font-medium">Amount</th>
              <th className="py-2 font-medium">Method</th>
              <th className="py-2 font-medium">Date</th>
              <th className="py-2 font-medium">Receipt</th>
              <th className="py-2 font-medium">Thank You</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-6 text-center text-charcoal/40 text-sm">Loading donations...</td></tr>
            ) : donations.length === 0 ? (
              <tr><td colSpan={6} className="py-6 text-center text-charcoal/40 text-sm">No donations yet.</td></tr>
            ) : (
              donations.map((d) => (
                <tr key={d._id} className="border-b border-charcoal/5 last:border-0">
                  <td className="py-2.5 text-charcoal font-medium">{d.donorName || d.donorEmail}</td>
                  <td className="py-2.5 text-charcoal">{formatAmount(d.amount, d.currency)}</td>
                  <td className="py-2.5 text-charcoal/60">{methodLabels[d.provider] || d.provider}</td>
                  <td className="py-2.5 text-charcoal/60">{formatDate(d.createdAt)}</td>
                  <td className="py-2.5"><StatusIcon done={d.receiptSent} onClick={() => toggleFlag(d, "receiptSent")} /></td>
                  <td className="py-2.5"><StatusIcon done={d.thankYouSent} onClick={() => toggleFlag(d, "thankYouSent")} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
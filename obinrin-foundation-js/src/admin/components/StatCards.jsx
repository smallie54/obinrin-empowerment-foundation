import { useEffect, useState } from "react";
import { DollarSign, Users, User, School, Handshake, Calendar } from "lucide-react";
import api from "../api/client";

function formatMoney(amountInSmallestUnit, currency) {
  const value = amountInSmallestUnit / 100;
  const symbol = currency === "USD" ? "$" : currency === "NGN" ? "₦" : `${currency} `;
  return `${symbol}${value.toLocaleString()}`;
}

export default function StatCards() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [donationTotals, setDonationTotals] = useState([]); // one entry per currency/provider
  const [donorCount, setDonorCount] = useState(0);
  const [girlsSupported, setGirlsSupported] = useState(0);
  const [schoolsReached, setSchoolsReached] = useState(0);
  const [activePartnerships, setActivePartnerships] = useState(0);
  const [upcomingOutreach, setUpcomingOutreach] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const [
          donationAnalytics,
          schoolAnalytics,
          donationList,
          partnerships,
          outreachUpcoming,
        ] = await Promise.all([
          api.get("/donations/analytics"),
          api.get("/schools/analytics"),
          api.get("/donations", { params: { status: "successful" } }),
          api.get("/partnerships", { params: { status: "active" } }),
          api.get("/outreach/upcoming-count"),
        ]);

        // byProvider gives totals in mixed currencies (Stripe=USD, Paystack=NGN),
        // so we show them as separate figures rather than incorrectly summing
        // different currencies into one number.
        const byProvider = donationAnalytics.data.byProvider || [];
        setDonationTotals(
          byProvider.map((p) => ({
            provider: p._id,
            amount: formatMoney(p.amount, p._id === "stripe" ? "USD" : "NGN"),
          }))
        );

        setGirlsSupported(schoolAnalytics.data.totals?.totalGirlsSupported || 0);
        setSchoolsReached(schoolAnalytics.data.totals?.totalSchools || 0);

        const uniqueDonors = new Set(
          (donationList.data || []).map((d) => d.donorEmail)
        );
        setDonorCount(uniqueDonors.size);

        setActivePartnerships(partnerships.data.length || 0);
        setUpcomingOutreach(outreachUpcoming.data.count || 0);
      } catch (err) {
        setError("Couldn't load live stats — showing what's available.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats = [
    {
      icon: DollarSign,
      iconBg: "bg-purple text-white",
      label: "Total Donations",
      value: loading
        ? "…"
        : donationTotals.length > 0
        ? donationTotals.map((d) => d.amount).join(" + ")
        : "₦0",
      change: donationTotals.length > 1 ? "Across Stripe + Paystack" : null,
    },
    {
      icon: Users,
      iconBg: "bg-gold/20 text-gold",
      label: "Active Donors",
      value: loading ? "…" : donorCount.toLocaleString(),
      change: null,
    },
    {
      icon: User,
      iconBg: "bg-purple text-white",
      label: "Girls Supported",
      value: loading ? "…" : girlsSupported.toLocaleString(),
      change: null,
    },
    {
      icon: School,
      iconBg: "bg-gold/20 text-gold",
      label: "Schools Reached",
      value: loading ? "…" : schoolsReached.toLocaleString(),
      change: null,
    },
    {
      icon: Handshake,
      iconBg: "bg-purple text-white",
      label: "Partnerships",
      value: loading ? "…" : activePartnerships.toLocaleString(),
      change: "Active",
      neutral: true,
    },
    {
      icon: Calendar,
      iconBg: "bg-gold/20 text-gold",
      label: "Upcoming Outreach",
      value: loading ? "…" : upcomingOutreach.toLocaleString(),
      change: "Planned + scheduled",
      neutral: true,
    },
  ];

  return (
    <div>
      {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-charcoal/10 p-4 min-w-0"
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${stat.iconBg}`}>
              <stat.icon size={17} />
            </div>
            <p className="text-xs text-charcoal/50">{stat.label}</p>
            <p className="font-heading font-bold text-xl text-charcoal mt-1 break-words">
              {stat.value}
            </p>
            {stat.change && (
              <p className={`text-xs mt-1 ${stat.neutral ? "text-charcoal/40" : "text-success"}`}>
                {stat.change}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { DollarSign, Users, User, Building2, Handshake, Calendar } from "lucide-react";
import api from "../admin/api/client";

function formatAmount(cents, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format((cents || 0) / 100);
}

export default function StatCards() {
  const [analytics, setAnalytics] = useState(null);
  const [impactSummary, setImpactSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [donationsRes, impactRes] = await Promise.all([
          api.get("/donations/analytics"),
          api.get("/impact/summary"),
        ]);
        setAnalytics(donationsRes.data);
        setImpactSummary(impactRes.data);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const stats = [
    {
      icon: DollarSign,
      iconBg: "bg-purple",
      label: "Total Donations",
      value: loading ? "—" : formatAmount(analytics?.totals?.totalAmount),
    },
    {
      icon: Users,
      iconBg: "bg-gold",
      label: "Active Donors",
      value: loading ? "—" : (analytics?.activeDonors ?? 0).toLocaleString(),
    },
    {
      icon: User,
      iconBg: "bg-purple",
      label: "Girls Supported",
      value: loading ? "—" : (impactSummary?.girlsSupported ?? 0).toLocaleString(),
    },
    {
      icon: Building2,
      iconBg: "bg-gold",
      label: "Schools Reached",
      value: loading ? "—" : (impactSummary?.schools ?? 0).toLocaleString(),
    },
    {
      icon: Handshake,
      iconBg: "bg-purple",
      label: "Partnerships",
      value: "23", // TODO: no Partnership model yet
    },
    {
      icon: Calendar,
      iconBg: "bg-gold",
      label: "Upcoming Outreach",
      value: "7", // TODO: no Outreach model yet
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-2xl border border-charcoal/10 p-5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 ${stat.iconBg}`}>
            <stat.icon size={18} />
          </div>
          <p className="text-xs text-charcoal/50">{stat.label}</p>
          <p className="font-heading font-bold text-xl text-charcoal mt-1">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
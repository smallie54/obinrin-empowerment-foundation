import { useEffect, useState } from "react";
import { CheckCircle2, Clock, XCircle, Mail, MessageSquare } from "lucide-react";
import api from "../../admin/api/client";

const statusStyle = {
  sent: { icon: CheckCircle2, className: "text-success" },
  pending: { icon: Clock, className: "text-gold" },
  failed: { icon: XCircle, className: "text-red-500" },
};

export default function ThankYouMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [channelFilter, setChannelFilter] = useState("");

  function load() {
    setLoading(true);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    if (channelFilter) params.channel = channelFilter;

    api
      .get("/messages", { params })
      .then((res) => setMessages(res.data))
      .catch(() => setError("Couldn't load messages."))
      .finally(() => setLoading(false));
  }

  useEffect(load, [statusFilter, channelFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl text-charcoal">Thank You Messages</h1>
        <p className="text-sm text-charcoal/50 mt-1">
          Full history of AI-drafted messages sent to donors. Draft and send new ones from the
          Dashboard's Thank You Message Center.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-charcoal/15 rounded-lg px-3 py-2.5 text-sm outline-none"
        >
          <option value="">All statuses</option>
          <option value="sent">Sent</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="border border-charcoal/15 rounded-lg px-3 py-2.5 text-sm outline-none"
        >
          <option value="">All channels</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-charcoal/10 overflow-hidden">
        {loading && <p className="p-6 text-sm text-charcoal/50">Loading...</p>}
        {error && <p className="p-6 text-sm text-red-600">{error}</p>}
        {!loading && !error && messages.length === 0 && (
          <p className="p-6 text-sm text-charcoal/50">No messages sent yet.</p>
        )}

        {!loading && messages.length > 0 && (
          <div className="divide-y divide-charcoal/5">
            {messages.map((m) => {
              const StatusIcon = statusStyle[m.status]?.icon || Clock;
              const ChannelIcon = m.channel === "sms" ? MessageSquare : Mail;
              return (
                <div key={m._id} className="p-5 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-lavender flex items-center justify-center shrink-0 text-purple">
                    <ChannelIcon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-charcoal">
                        {m.donorName || m.donorEmail}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium capitalize shrink-0 ${statusStyle[m.status]?.className}`}
                      >
                        <StatusIcon size={12} />
                        {m.status}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal/50 mt-0.5">
                      {m.donorEmail} · {new Date(m.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    {m.subject && (
                      <p className="text-xs font-semibold text-charcoal/70 mt-2">{m.subject}</p>
                    )}
                    <p className="text-sm text-charcoal/60 mt-1 line-clamp-2">{m.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
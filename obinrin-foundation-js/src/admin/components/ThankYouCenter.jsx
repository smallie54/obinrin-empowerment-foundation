import { useEffect, useState } from "react";
import { Mail, Sparkles, Send, Clock } from "lucide-react";
import api from "../api/client";

export default function ThankYouCenter() {
  const [tab, setTab] = useState("email");
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [draft, setDraft] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [draftError, setDraftError] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [recentSent, setRecentSent] = useState([]);

  function loadRecent() {
    api
      .get("/messages/recent")
      .then((res) => setRecentSent(res.data))
      .catch(() => {});
  }

  useEffect(loadRecent, []);

  async function handleGenerate() {
    if (!donorName) {
      setDraftError("Enter a donor name first.");
      return;
    }
    setDraftError("");
    setDrafting(true);
    setSendResult(null);
    try {
      const res = await api.post("/messages/draft", {
        donorName,
        amount,
        currency: "₦",
        channel: tab,
      });
      setDraft(res.data.draft);
    } catch (err) {
      setDraftError(err.response?.data?.message || "Couldn't generate a draft.");
    } finally {
      setDrafting(false);
    }
  }

  async function handleSend() {
    if (!donorEmail || !draft) {
      setSendResult({ ok: false, message: "Need a donor email and a message body first." });
      return;
    }
    setSending(true);
    setSendResult(null);
    try {
      const res = await api.post("/messages/send", {
        donorEmail,
        donorName,
        channel: tab,
        subject: "Thank you for your generous gift",
        body: draft,
      });
      setSendResult({
        ok: true,
        message: tab === "sms" ? res.data.message : "Sent!",
      });
      loadRecent();
    } catch (err) {
      setSendResult({ ok: false, message: err.response?.data?.message || "Couldn't send." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-charcoal/10 p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-purple/10 text-purple flex items-center justify-center shrink-0">
          <Mail size={17} />
        </div>
        <div>
          <h3 className="font-heading font-bold text-charcoal">Thank You Message Center</h3>
          <p className="text-xs text-charcoal/50">
            Draft personalized messages to appreciate your amazing donors.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <p className="text-xs font-semibold text-charcoal/60 flex items-center gap-1 mb-2">
            <Sparkles size={13} className="text-gold" /> AI Message Assistant
          </p>

          <div className="space-y-2 mb-2">
            <input
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="Donor name"
              className="w-full text-xs border border-charcoal/15 rounded-lg px-2.5 py-2 outline-none focus:border-purple"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount (e.g. 50000)"
                className="w-full text-xs border border-charcoal/15 rounded-lg px-2.5 py-2 outline-none focus:border-purple"
              />
              <input
                type="email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                placeholder="Donor email"
                className="w-full text-xs border border-charcoal/15 rounded-lg px-2.5 py-2 outline-none focus:border-purple"
              />
            </div>
          </div>

          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Generated message will appear here — editable before sending."
            className="w-full h-32 text-xs text-charcoal/70 bg-lavender/40 rounded-xl p-3 resize-none outline-none"
          />

          {draftError && <p className="text-[11px] text-red-600 mt-1">{draftError}</p>}

          <button
            onClick={handleGenerate}
            disabled={drafting}
            className="w-full mt-3 bg-purple hover:bg-purple/90 disabled:opacity-60 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
          >
            {drafting ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="md:col-span-1">
          <div className="flex gap-4 border-b border-charcoal/10 mb-3">
            <button
              onClick={() => setTab("email")}
              className={`text-xs font-semibold pb-2 border-b-2 transition-colors ${
                tab === "email" ? "border-purple text-purple" : "border-transparent text-charcoal/40"
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setTab("sms")}
              className={`text-xs font-semibold pb-2 border-b-2 transition-colors ${
                tab === "sms" ? "border-purple text-purple" : "border-transparent text-charcoal/40"
              }`}
            >
              SMS
            </button>
          </div>

          <div className="text-xs text-charcoal/70 leading-relaxed h-32 overflow-y-auto pr-1 whitespace-pre-line">
            {draft || (
              <span className="text-charcoal/30">
                Fill in a donor name and hit Generate to see a preview here.
              </span>
            )}
          </div>

          {tab === "sms" && (
            <p className="text-[10px] text-charcoal/40 mt-1">
              SMS sending isn't connected to a provider yet — it'll log as pending.
            </p>
          )}

          {sendResult && (
            <p className={`text-[11px] mt-2 ${sendResult.ok ? "text-success" : "text-red-600"}`}>
              {sendResult.message}
            </p>
          )}

          <div className="flex gap-2 mt-3">
            <button
              disabled
              title="Scheduled sending isn't built yet"
              className="flex-1 flex items-center justify-center gap-1.5 border border-charcoal/15 text-charcoal/40 text-xs font-semibold py-2.5 rounded-lg cursor-not-allowed"
            >
              <Clock size={13} /> Send Later
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className="flex-1 flex items-center justify-center gap-1.5 bg-gold hover:bg-gold/90 disabled:opacity-60 text-charcoal text-xs font-semibold py-2.5 rounded-lg transition-colors"
            >
              <Send size={13} /> {sending ? "Sending..." : "Send Now"}
            </button>
          </div>
        </div>

        <div className="md:col-span-1">
          <p className="text-xs font-semibold text-charcoal/60 mb-2">Recent Sent</p>
          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {recentSent.length === 0 && (
              <p className="text-[11px] text-charcoal/30">Nothing sent yet.</p>
            )}
            {recentSent.map((r) => (
              <div key={r._id} className="flex items-center justify-between text-xs">
                <div className="min-w-0">
                  <p className="font-semibold text-charcoal truncate">
                    {r.donorName || r.donorEmail}
                  </p>
                  <p className="text-charcoal/50">
                    {r.channel} · {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                    r.status === "sent"
                      ? "bg-success/15 text-success"
                      : r.status === "pending"
                      ? "bg-gold/20 text-gold"
                      : "bg-red-100 text-red-500"
                  }`}
                >
                  {r.status === "sent" ? "✓" : r.status === "pending" ? "…" : "✕"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
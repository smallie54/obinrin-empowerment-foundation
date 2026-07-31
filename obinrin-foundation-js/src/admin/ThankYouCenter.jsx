import { useState } from "react";
import { Mail, Sparkles, ChevronDown, CalendarClock, Send, Check } from "lucide-react";

const recentSent = [
  { name: "Mary A.", amount: "₦50,000", date: "May 24" },
  { name: "John D.", amount: "₦25,000", date: "May 23" },
  { name: "Grace B.", amount: "₦10,000", date: "May 22" },
  { name: "Anonymous", amount: "₦5,000", date: "May 22" },
];

export default function ThankYouCenter() {
  const [tab, setTab] = useState("email");
  const [draft, setDraft] = useState(
    "Thank you {DonorName} for your generous donation of {Amount}. Your support is helping us educate, empower, and elevate girls across Africa. Because of you, brighter futures are becoming a reality."
  );

  return (
    <section className="bg-white rounded-2xl border border-charcoal/10 p-6">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-xl bg-purple/10 text-purple flex items-center justify-center">
          <Mail size={18} />
        </div>
        <h2 className="font-heading font-bold text-charcoal">
          Thank You Message Center
        </h2>
      </div>
      <p className="text-sm text-charcoal/50 mb-6 ml-12">
        Draft personalized messages to appreciate your amazing donors.
      </p>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* AI Assistant */}
        <div className="lg:col-span-1">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-charcoal mb-2">
            AI Message Assistant <Sparkles size={14} className="text-gold" />
          </p>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={7}
            className="w-full text-sm text-charcoal/80 bg-lavender/30 rounded-xl p-4 outline-none resize-none border border-transparent focus:border-purple/30"
          />
          <div className="flex items-center justify-between mt-3">
            <button className="flex items-center gap-1 text-xs text-charcoal/60 border border-charcoal/15 rounded-full px-3 py-1.5">
              Personalize with {"{DonorName}"} <ChevronDown size={12} />
            </button>
            <button className="bg-purple hover:bg-purple/90 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors">
              Generate
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="flex gap-6 border-b border-charcoal/10 mb-4">
            <button
              onClick={() => setTab("email")}
              className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
                tab === "email"
                  ? "text-purple border-purple"
                  : "text-charcoal/50 border-transparent"
              }`}
            >
              Email Preview
            </button>
            <button
              onClick={() => setTab("sms")}
              className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
                tab === "sms"
                  ? "text-purple border-purple"
                  : "text-charcoal/50 border-transparent"
              }`}
            >
              SMS Preview
            </button>
          </div>

          <div className="text-sm text-charcoal/80 leading-relaxed space-y-3">
            <p>Dear {"{DonorName}"},</p>
            {tab === "email" ? (
              <p>
                Thank you so much for your generous donation of {"{Amount}"}.
                Your kindness is helping us provide education, school
                supplies, mentorship, and sanitary pads to girls who need it
                most.
              </p>
            ) : (
              <p>
                Thanks for your {"{Amount}"} gift — you're changing a girl's
                future today. With gratitude, Empower Her Africa.
              </p>
            )}
            <p>
              Together, we are creating brighter futures.
              <br />
              With gratitude,
              <br />
              Empower Her Africa Team
            </p>
          </div>

          <div className="flex gap-3 mt-5">
            <button className="flex items-center gap-2 border border-charcoal/15 text-charcoal text-sm font-semibold px-4 py-2.5 rounded-full">
              <CalendarClock size={15} /> Send Later
            </button>
            <button className="flex items-center gap-2 bg-gold hover:bg-gold/90 text-charcoal text-sm font-semibold px-4 py-2.5 rounded-full transition-colors">
              <Send size={15} /> Send Now
            </button>
          </div>
        </div>

        {/* Recent Sent */}
        <div className="lg:col-span-1">
          <p className="text-sm font-semibold text-charcoal mb-3">Recent Sent</p>
          <div className="space-y-3">
            {recentSent.map((r) => (
              <div key={r.name} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal">{r.name}</p>
                  <p className="text-xs text-charcoal/50">
                    {r.amount} · {r.date}
                  </p>
                </div>
                <span className="w-5 h-5 rounded-full bg-success/15 text-success flex items-center justify-center">
                  <Check size={12} />
                </span>
              </div>
            ))}
          </div>
          <button className="text-purple text-sm font-semibold mt-4">
            View All Messages →
          </button>
        </div>
      </div>
    </section>
  );
}

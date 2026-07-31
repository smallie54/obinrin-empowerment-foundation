import { Flag, Handshake, MailPlus, PenSquare, CalendarPlus, Send, FileBarChart2 } from "lucide-react";

const actions = [
  { label: "New Outreach", icon: Flag, style: "bg-purple text-white" },
  { label: "Add Partner", icon: Handshake, style: "bg-gold text-charcoal" },
  { label: "Draft Thank You", icon: MailPlus, style: "bg-lavender text-purple" },
  { label: "Publish Blog", icon: PenSquare, style: "bg-white text-charcoal border border-charcoal/15" },
  { label: "Create Event", icon: CalendarPlus, style: "bg-purple text-white" },
  { label: "Send Newsletter", icon: Send, style: "bg-gold text-charcoal" },
];

export default function QuickActions() {
  return (
    <section className="bg-white rounded-2xl border border-charcoal/10 p-6">
      <h2 className="font-heading font-bold text-charcoal mb-5">Quick Actions</h2>

      <div className="grid grid-cols-3 gap-3">
        {actions.map((a) => (
          <button
            key={a.label}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl py-4 px-2 text-xs font-semibold hover:opacity-90 transition-opacity ${a.style}`}
          >
            <a.icon size={18} />
            {a.label}
          </button>
        ))}
      </div>

      <button className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl py-3.5 bg-lavender/60 text-purple text-sm font-semibold hover:bg-lavender transition-colors">
        <FileBarChart2 size={16} /> Generate Report
      </button>
    </section>
  );
}

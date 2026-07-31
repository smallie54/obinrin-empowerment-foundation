import { Flag, Handshake, Mail, Edit3, CalendarPlus, Send, FileBarChart } from "lucide-react";

const actions = [
  { label: "New Outreach", icon: Flag, style: "bg-purple text-white" },
  { label: "Add Partner", icon: Handshake, style: "bg-gold text-charcoal" },
  { label: "Draft Thank You", icon: Mail, style: "bg-lavender text-purple" },
  { label: "Publish Blog", icon: Edit3, style: "bg-lavender text-purple" },
  { label: "Create Event", icon: CalendarPlus, style: "bg-purple text-white" },
  { label: "Send Newsletter", icon: Send, style: "bg-gold text-charcoal" },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-2xl border border-charcoal/10 p-5 sm:p-6">
      <h3 className="font-heading font-bold text-charcoal mb-4">Quick Actions</h3>

      <div className="grid grid-cols-3 gap-3">
        {actions.map((a) => (
          <button
            key={a.label}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl py-4 text-xs font-semibold text-center leading-tight ${a.style} hover:opacity-90 transition-opacity`}
          >
            <a.icon size={18} />
            {a.label}
          </button>
        ))}
      </div>

      <button className="w-full flex items-center justify-center gap-2 mt-3 bg-lavender text-purple text-xs font-semibold py-3 rounded-xl">
        <FileBarChart size={16} /> Generate Report
      </button>
    </div>
  );
}

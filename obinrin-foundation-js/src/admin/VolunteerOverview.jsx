import { Users } from "lucide-react";

const rows = [
  { label: "Available Volunteers", value: 42 },
  { label: "Assigned to Outreach", value: 28 },
  { label: "Active This Month", value: 36 },
  { label: "Total Volunteers", value: 128 },
];

export default function VolunteerOverview() {
  return (
    <section className="bg-white rounded-2xl border border-charcoal/10 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading font-bold text-charcoal">Volunteer Overview</h2>
        <button className="text-xs font-semibold text-purple">View All</button>
      </div>

      <div className="space-y-4">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <p className="text-sm text-charcoal/70">{r.label}</p>
            <div className="flex items-center gap-2">
              <p className="font-heading font-bold text-charcoal">{r.value}</p>
              <Users size={15} className="text-purple/50" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

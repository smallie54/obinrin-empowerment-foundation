const partners = [
  {
    name: "The Bloom Foundation",
    contact: "Sarah Johnson",
    status: "Active Partner",
    lastMeeting: "May 10, 2025",
    nextFollowUp: "June 15, 2025",
    progress: 75,
  },
  {
    name: "Education for All Initiative",
    contact: "Michael Oke",
    status: "Active Partner",
    lastMeeting: "May 5, 2025",
    nextFollowUp: "June 12, 2025",
    progress: 60,
  },
  {
    name: "Girls Rise Fund",
    contact: "Amaka Obi",
    status: "Pending",
    lastMeeting: "April 22, 2025",
    nextFollowUp: "June 5, 2025",
    progress: 40,
  },
];

export default function Partnerships() {
  return (
    <section className="bg-white rounded-2xl border border-charcoal/10 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading font-bold text-charcoal">Partnerships</h2>
        <button className="text-xs font-semibold text-purple border border-purple/30 rounded-full px-3 py-1.5">
          + Add Partner
        </button>
      </div>

      <div className="space-y-5">
        {partners.map((p) => (
          <div key={p.name} className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-lavender flex items-center justify-center shrink-0 text-purple font-heading font-bold text-sm">
              {p.name
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-charcoal">{p.name}</p>
                  <p className="text-xs text-charcoal/50">Contact: {p.contact}</p>
                  <p className="text-xs text-charcoal/50">Status: {p.status}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-charcoal/50">Last Meeting</p>
                  <p className="text-xs text-charcoal">{p.lastMeeting}</p>
                  <p className="text-xs text-charcoal/50 mt-1">Next Follow-up</p>
                  <p className="text-xs text-charcoal">{p.nextFollowUp}</p>
                </div>
              </div>

              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-charcoal/50 mb-1">
                  <span>Funding Progress</span>
                  <span className="font-semibold text-charcoal">{p.progress}%</span>
                </div>
                <div className="h-1.5 bg-lavender rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple rounded-full"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="text-purple text-sm font-semibold mt-5">
        View All Partnerships →
      </button>
    </section>
  );
}

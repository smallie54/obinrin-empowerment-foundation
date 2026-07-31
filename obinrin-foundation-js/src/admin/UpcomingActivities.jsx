const activities = [
  {
    month: "MAY",
    day: "28",
    title: "School Visit – Ajegunle High School",
    time: "9:00 AM – 2:00 PM",
    tag: "School Visit",
    tagColor: "bg-purple/10 text-purple",
  },
  {
    month: "MAY",
    day: "30",
    title: "Mentorship Session",
    time: "11:00 AM – 1:00 PM",
    tag: "Mentorship",
    tagColor: "bg-gold/15 text-gold",
  },
  {
    month: "JUN",
    day: "02",
    title: "Donation Drive – Pad for Her",
    time: "All Day Event",
    tag: "Donation Drive",
    tagColor: "bg-pink text-purple",
  },
  {
    month: "JUN",
    day: "05",
    title: "Community Outreach – Ibadan",
    time: "10:00 AM – 3:00 PM",
    tag: "Outreach",
    tagColor: "bg-purple/10 text-purple",
  },
  {
    month: "JUN",
    day: "07",
    title: "Board Meeting",
    time: "2:00 PM – 4:00 PM",
    tag: "Meeting",
    tagColor: "bg-charcoal/10 text-charcoal",
  },
];

export default function UpcomingActivities() {
  return (
    <section className="bg-white rounded-2xl border border-charcoal/10 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading font-bold text-charcoal">Upcoming Activities</h2>
        <button className="text-xs font-semibold text-purple border border-purple/30 rounded-full px-3 py-1.5">
          View Calendar ▾
        </button>
      </div>

      <div className="space-y-5 flex-1">
        {activities.map((a) => (
          <div key={a.title} className="flex gap-4">
            <div className="text-center shrink-0 w-10">
              <p className="text-[10px] font-semibold text-charcoal/40">{a.month}</p>
              <p className="font-heading font-bold text-lg text-charcoal">{a.day}</p>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-charcoal leading-snug">
                  {a.title}
                </p>
                <span
                  className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full ${a.tagColor}`}
                >
                  {a.tag}
                </span>
              </div>
              <p className="text-xs text-charcoal/50 mt-1">{a.time}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="text-purple text-sm font-semibold mt-5">
        View All Messages →
      </button>
    </section>
  );
}

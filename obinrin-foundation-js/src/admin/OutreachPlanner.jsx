const priorityStyles = {
  Low: "bg-success/15 text-success",
  Medium: "bg-gold/20 text-gold",
  High: "bg-red-100 text-red-600",
};

const columns = [
  {
    title: "Ideas",
    count: 3,
    cards: [
      { title: "Career Day – Lagos", detail: "Introduce career opportunities to girls.", priority: "Low" },
      { title: "STEM Workshop", detail: "Empower girls in tech and innovation.", priority: "Low" },
      { title: "Reading Campaign", detail: "Promote reading culture in rural schools.", priority: "Low" },
    ],
  },
  {
    title: "Planning",
    count: 2,
    cards: [
      { title: "Ajegunle School Visit", detail: "May 28, 2025", meta: "Volunteers: 8 · Budget: ₦120,000", priority: "Medium" },
      { title: "Menstrual Health Talk", detail: "June 10, 2025", meta: "Volunteers: 6 · Budget: ₦80,000", priority: "Medium" },
    ],
  },
  {
    title: "Scheduled",
    count: 3,
    cards: [
      { title: "Ibadan Outreach", detail: "June 5, 2025", meta: "Volunteers: 15 · Budget: ₦200,000", priority: "High" },
      { title: "Kano School Visit", detail: "June 15, 2025", meta: "Volunteers: 10 · Budget: ₦150,000", priority: "Medium" },
      { title: "Abuja Mentorship", detail: "June 20, 2025", meta: "Volunteers: 12 · Budget: ₦180,000", priority: "High" },
    ],
  },
  {
    title: "In Progress",
    count: 2,
    cards: [
      { title: "Enugu School Visit", detail: "May 20, 2025", meta: "Volunteers: 10 · Budget: ₦130,000", priority: "High" },
      { title: "Port Harcourt Outreach", detail: "May 18, 2025", meta: "Volunteers: 9 · Budget: ₦110,000", priority: "Medium" },
    ],
  },
  {
    title: "Completed",
    count: 5,
    cards: [
      { title: "April Pad Drive", detail: "April 25, 2025", meta: "Volunteers: 20 · Reached: 500 girls", done: true },
    ],
  },
];

export default function OutreachPlanner() {
  return (
    <section className="bg-white rounded-2xl border border-charcoal/10 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading font-bold text-charcoal">Outreach Planner</h2>
        <button className="flex items-center gap-1 bg-purple hover:bg-purple/90 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors">
          + New Outreach
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {columns.map((col) => (
          <div key={col.title} className="bg-lavender/30 rounded-xl p-3">
            <p className="text-xs font-semibold text-charcoal/60 mb-3 px-1">
              {col.title} ({col.count})
            </p>
            <div className="space-y-2">
              {col.cards.map((card) => (
                <div
                  key={card.title}
                  className={`bg-white rounded-lg p-3 border border-charcoal/10 ${
                    card.done ? "opacity-70" : ""
                  }`}
                >
                  <p className="text-sm font-semibold text-charcoal leading-snug">
                    {card.title}
                  </p>
                  <p className="text-xs text-charcoal/50 mt-1">{card.detail}</p>
                  {card.meta && (
                    <p className="text-[11px] text-charcoal/50 mt-1">{card.meta}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    {card.priority && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priorityStyles[card.priority]}`}
                      >
                        {card.priority}
                      </span>
                    )}
                    {card.done && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/15 text-success">
                        Done
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="text-purple text-sm font-semibold mt-5">View All →</button>
    </section>
  );
}

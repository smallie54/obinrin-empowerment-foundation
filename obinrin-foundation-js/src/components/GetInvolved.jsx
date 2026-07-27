import { motion } from "framer-motion";

const actions = [
  { icon: "❤️", title: "Donate", copy: "Change a girl's future today." },
  { icon: "🤝", title: "Volunteer", copy: "Join our movement." },
  {
    icon: "🎒",
    title: "Sponsor A Girl",
    copy: "Support education for one student.",
  },
  {
    icon: "🏢",
    title: "Corporate Partner",
    copy: "Empower thousands through strategic partnerships.",
  },
];

export default function GetInvolved() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-16">
          Get Involved
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {actions.map((a) => (
            <motion.button
              key={a.title}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-left rounded-2xl border border-charcoal/10 p-7 hover:border-purple hover:shadow-lg transition-colors"
            >
              <div className="text-3xl mb-4">{a.icon}</div>
              <h3 className="font-heading font-bold text-lg mb-1">
                {a.title}
              </h3>
              <p className="text-sm text-charcoal/60">{a.copy}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

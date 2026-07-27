import { motion } from "framer-motion";

const solutions = [
  {
    icon: "📖",
    title: "Educational Materials",
    items: ["School bags", "Books", "Uniforms", "Writing materials"],
  },
  {
    icon: "🩷",
    title: "Free Sanitary Pads",
    items: ["Monthly dignity kits", "Health education", "Hygiene awareness"],
  },
  {
    icon: "👩🏽‍🏫",
    title: "Mentorship",
    items: ["Career guidance", "Female role models", "Leadership coaching"],
  },
  {
    icon: "🌍",
    title: "Leadership Development",
    items: ["Confidence building", "Public speaking", "Entrepreneurship"],
  },
];

export default function Solutions() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-16">
          Our Solutions
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {solutions.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl bg-lavender/50 p-9 hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-3xl mb-6 shadow-sm">
                {s.icon}
              </div>
              <h3 className="font-heading font-bold text-2xl mb-4">
                {s.title}
              </h3>
              <ul className="space-y-2">
                {s.items.map((item) => (
                  <li
                    key={item}
                    className="text-charcoal/70 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

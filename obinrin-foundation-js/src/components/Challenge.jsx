import { motion } from "framer-motion";

const challenges = [
  {
    icon: "🩸",
    title: "Period Poverty",
    copy: "Thousands miss school monthly because they lack sanitary products.",
  },
  {
    icon: "📚",
    title: "School Supply Shortages",
    copy: "Many girls share textbooks or have none.",
  },
  {
    icon: "🎓",
    title: "Educational Inequality",
    copy: "Economic hardship limits educational opportunities.",
  },
  {
    icon: "🏠",
    title: "Early Dropout",
    copy: "Many leave school before graduation.",
  },
];

export default function Challenge() {
  return (
    <section className="bg-lavender py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-16">
          The Challenge
        </h2>

        <div className="relative grid md:grid-cols-4 gap-8">
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-purple/20" />

          {challenges.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative bg-white rounded-2xl p-7 shadow-sm"
            >
              <div className="w-14 h-14 rounded-full bg-pink flex items-center justify-center text-2xl mb-5">
                {item.icon}
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                {item.copy}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

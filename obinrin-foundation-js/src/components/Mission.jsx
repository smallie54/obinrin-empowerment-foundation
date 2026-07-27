import { motion } from "framer-motion";

export default function Mission() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1974&auto=format&fit=crop"
            alt="Girls receiving school kits"
            className="w-full h-[420px] object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className="text-sm font-semibold text-purple uppercase tracking-widest">
            Our Mission
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-4 leading-tight">
            Education changes everything.
          </h2>
          <div className="mt-6 space-y-1 text-lg text-charcoal/80 font-manrope">
            <p>One notebook.</p>
            <p>One mentor.</p>
            <p>One opportunity.</p>
          </div>
          <p className="mt-6 text-lg text-charcoal/70 leading-relaxed">
            That's all it takes to transform a girl's future. We exist to
            remove barriers that stop African girls from achieving their
            dreams.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

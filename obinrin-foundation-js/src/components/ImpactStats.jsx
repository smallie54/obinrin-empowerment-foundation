import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

const stats = [
  { value: 12000, suffix: "+", label: "Girls Supported" },
  { value: 350, suffix: "", label: "Schools Reached" },
  { value: 1.2, suffix: "M", label: "Pads Distributed", isDecimal: true },
  { value: 85000, suffix: "", label: "Learning Materials Delivered" },
];

function Counter({ value, suffix, isDecimal }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [display, setDisplay] = useState(isDecimal ? "0" : "0");

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate(latest) {
        setDisplay(
          isDecimal
            ? latest.toFixed(1)
            : Math.round(latest).toLocaleString()
        );
      },
    });
    return () => controls.stop();
  }, [isInView, value, isDecimal]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function ImpactStats() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="min-w-0 rounded-2xl border border-lavender bg-lavender/40 p-6 sm:p-7 md:p-6 lg:p-8 text-center hover:shadow-[0_0_0_1px_#5B21B6,0_20px_40px_-15px_rgba(91,33,182,0.3)] transition-shadow"
          >
            <p className="font-heading font-extrabold text-3xl sm:text-4xl md:text-3xl lg:text-5xl text-purple leading-tight break-words">
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                isDecimal={stat.isDecimal}
              />
            </p>
            <p className="mt-2 sm:mt-3 text-sm md:text-base text-charcoal/70 font-medium">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
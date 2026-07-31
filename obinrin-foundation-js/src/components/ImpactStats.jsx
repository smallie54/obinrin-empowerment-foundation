import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import publicApi from "../lib/public";

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate(latest) {
        setDisplay(Math.round(latest).toLocaleString());
      },
    });
    return () => controls.stop();
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function ImpactStats() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    publicApi
      .get("/schools/public-stats")
      .then((res) => setData(res.data))
      .catch(() => setError(true));
  }, []);

  const stats = [
    { value: data?.girlsSupported ?? 0, suffix: data?.girlsSupported ? "+" : "", label: "Girls Supported" },
    { value: data?.schoolsReached ?? 0, suffix: "", label: "Schools Reached" },
    { value: data?.padsDistributed ?? 0, suffix: data?.padsDistributed ? "+" : "", label: "Pads Distributed" },
    { value: data?.materialsDelivered ?? 0, suffix: data?.materialsDelivered ? "+" : "", label: "Learning Materials Delivered" },
  ];

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {error && (
          <p className="text-center text-xs text-charcoal/40 mb-4">
            Live figures are temporarily unavailable — showing 0 for now.
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="min-w-0 rounded-2xl border border-lavender bg-lavender/40 p-6 sm:p-7 md:p-6 lg:p-8 text-center hover:shadow-[0_0_0_1px_#5B21B6,0_20px_40px_-15px_rgba(91,33,182,0.3)] transition-shadow"
            >
              <p className="font-heading font-extrabold text-3xl sm:text-4xl md:text-3xl lg:text-5xl text-purple leading-tight break-words">
                {data ? (
                  <Counter value={stat.value} suffix={stat.suffix} />
                ) : (
                  <span className="text-charcoal/20">···</span>
                )}
              </p>
              <p className="mt-2 sm:mt-3 text-sm md:text-base text-charcoal/70 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
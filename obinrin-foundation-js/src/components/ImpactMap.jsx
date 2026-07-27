import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const countries = [
  {
    name: "Nigeria",
    x: "48%",
    y: "52%",
    girls: "24,563",
    schools: "52",
    teams: "18",
  },
  {
    name: "Kenya",
    x: "62%",
    y: "58%",
    girls: "18,204",
    schools: "37",
    teams: "12",
  },
  {
    name: "Ghana",
    x: "42%",
    y: "56%",
    girls: "12,890",
    schools: "29",
    teams: "9",
  },
];

export default function ImpactMap() {
  const [active, setActive] = useState(null);

  return (
    <section className="bg-charcoal py-24">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-center text-white mb-4">
          Our Impact Across Africa
        </h2>
        <p className="text-white/60 text-center mb-16">
          Hover a marker to see program reach in that country.
        </p>

        <div className="relative w-full aspect-[16/10] rounded-3xl bg-white/5 border border-white/10">
          {countries.map((c) => (
            <div
              key={c.name}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: c.x, top: c.y }}
              onMouseEnter={() => setActive(c.name)}
              onMouseLeave={() => setActive(null)}
            >
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-60" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-gold" />
              </span>

              <AnimatePresence>
                {active === c.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute left-1/2 -translate-x-1/2 top-6 w-52 bg-white rounded-xl p-4 shadow-2xl text-left z-10"
                  >
                    <p className="font-heading font-bold text-charcoal mb-2">
                      {c.name}
                    </p>
                    <div className="space-y-1 text-sm text-charcoal/70">
                      <div className="flex justify-between">
                        <span>Girls Supported</span>
                        <span className="font-semibold text-purple">
                          {c.girls}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Schools</span>
                        <span className="font-semibold text-purple">
                          {c.schools}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Volunteer Teams</span>
                        <span className="font-semibold text-purple">
                          {c.teams}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

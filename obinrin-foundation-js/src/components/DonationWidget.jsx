import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const gifts = [
  { amount: 10, copy: "Provides exercise books." },
  { amount: 25, copy: "Provides one school bag." },
  { amount: 50, copy: "Supports sanitary supplies." },
  { amount: 100, copy: "Sponsors educational resources." },
];

export default function DonationWidget() {
  const [selected, setSelected] = useState(25);
  const [confirmed, setConfirmed] = useState(false);

  const navigate = useNavigate();

  const active = gifts.find((g) => g.amount === selected);

  return (
    <section className="bg-lavender py-24">
      <div className="max-w-xl mx-auto px-6">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-12">
          Choose Your Gift
        </h2>

        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {gifts.map((g) => (
              <button
                key={g.amount}
                onClick={() => {
                  setSelected(g.amount);
                  setConfirmed(false);
                }}
                className={`rounded-xl border-2 py-4 font-heading font-bold text-lg transition-colors ${
                  selected === g.amount
                    ? "border-purple bg-purple text-white"
                    : "border-charcoal/10 text-charcoal hover:border-purple/40"
                }`}
              >
                ${g.amount}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setSelected("custom");
              setConfirmed(false);
            }}
            className={`w-full rounded-xl border-2 py-3 font-medium mb-6 transition-colors ${
              selected === "custom"
                ? "border-purple bg-purple text-white"
                : "border-charcoal/10 text-charcoal hover:border-purple/40"
            }`}
          >
            Custom Amount
          </button>

          <AnimatePresence mode="wait">
            {active && (
              <motion.p
                key={active.amount}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-charcoal/60 text-sm mb-6"
              >
                ${active.amount} {active.copy}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            onClick={() =>
              navigate("/donate", {
                state: {
                  amount: selected,
                },
              })
            }
            className="w-full bg-gold hover:bg-gold/90 text-charcoal font-semibold py-4 rounded-xl transition-colors"
          >
            Donate {selected === "custom" ? "" : `$${selected}`}
          </button>

          <AnimatePresence>
            {confirmed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-5 rounded-xl bg-success/10 text-success text-center py-4 font-semibold">
                  Thank you — your gift changes a future. 💜
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
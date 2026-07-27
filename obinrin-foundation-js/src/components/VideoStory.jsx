import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VideoStory() {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative h-[70vh] min-h-[420px] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop"
        alt="Documentary still of a school bag donation"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-charcoal/60" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <span className="text-white/70 text-sm font-semibold uppercase tracking-widest">
          Watch Their Story
        </span>
        <h2 className="font-heading font-bold text-white text-3xl md:text-5xl mt-4 max-w-2xl">
          How One School Bag Changed A Future
        </h2>

        <button
          onClick={() => setOpen(true)}
          className="mt-10 w-16 h-16 rounded-full bg-gold flex items-center justify-center text-charcoal text-2xl hover:scale-110 transition-transform"
          aria-label="Play documentary"
        >
          ▶
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center px-6"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl aspect-video bg-charcoal rounded-2xl flex items-center justify-center text-white/60"
              onClick={(e) => e.stopPropagation()}
            >
              Documentary video player goes here
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

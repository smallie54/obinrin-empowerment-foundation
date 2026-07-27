import { motion } from "framer-motion";
import HeroImg from "../assets/imges/girlsImg/heroImg.png"

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden flex items-center">
      <img
        src={HeroImg}
        alt="African secondary school girls walking to school in the morning light"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-purple/90 via-purple/60 to-purple/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <h1 className="font-heading font-extrabold text-white text-5xl md:text-7xl leading-[1.05] tracking-tight">
            Every girl deserves the opportunity to learn, lead, and thrive.
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/90 max-w-xl leading-relaxed">
            Providing education, mentorship, school supplies and free sanitary
            pads so African girls never have to choose between learning and
            dignity.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button className="bg-gold hover:bg-gold/90 text-charcoal font-semibold px-7 py-3.5 rounded-full transition-colors">
              Donate Now
            </button>
            <button className="border-2 border-white/70 hover:border-white text-white font-semibold px-7 py-3.5 rounded-full transition-colors">
              Become a Partner
            </button>
          </div>

          <p className="mt-8 text-sm text-white/70 uppercase tracking-widest">
            Trusted by schools, communities &amp; partners across Africa
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1 }, y: { repeat: Infinity, duration: 1.8 } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 text-2xl z-10"
      >
        ↓
      </motion.div>
    </section>
  );
}

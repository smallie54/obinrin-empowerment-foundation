import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { webImg } from "../assets/assets";

const getImg = (name) => webImg.find((img) => img.name === name)?.Image;

const stories = [
  {
    name: "Ada",
    age: 15,
    quote:
      "Receiving school supplies gave me confidence to remain in school.",
    school: "Community Secondary School",
    region: "Lagos, Nigeria",
    image: getImg("successStoryImg1"),
  },
  {
    name: "Amara",
    age: 16,
    quote:
      "The mentorship program showed me women who look like me leading in their fields.",
    school: "Girls Model High School",
    region: "Enugu, Nigeria",
    image: getImg("successStoryImg2"),
  },
  {
    name: "Fola",
    age: 14,
    quote:
      "I no longer miss school every month. I can focus on my studies.",
    school: "Unity Girls College",
    region: "Ibadan, Nigeria",
    image: getImg("successStoryImg3"),
  },
];

export default function Stories() {
  const [index, setIndex] = useState(0);
  const story = stories[index];

  return (
    <section className="bg-white py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-16">
          Success Stories
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={story.image}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              src={story.image}
              alt={story.name}
              className="w-full h-[440px] object-cover rounded-3xl"
            />
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <p className="font-heading text-2xl md:text-3xl leading-snug text-charcoal">
                "{story.quote}"
              </p>
              <p className="mt-6 font-semibold text-purple">
                — {story.name}, Age {story.age}
              </p>
              <p className="mt-1 text-sm text-charcoal/60">
                {story.school} · {story.region}
              </p>

              <div className="mt-10 flex gap-3">
                <button
                  onClick={() =>
                    setIndex((i) => (i - 1 + stories.length) % stories.length)
                  }
                  className="w-11 h-11 rounded-full border border-charcoal/20 hover:border-purple hover:text-purple transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={() => setIndex((i) => (i + 1) % stories.length)}
                  className="w-11 h-11 rounded-full border border-charcoal/20 hover:border-purple hover:text-purple transition-colors"
                >
                  →
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
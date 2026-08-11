import { Link } from "react-router-dom";
import { ArrowRight, Target, Eye, Flag, Heart } from "lucide-react";
import { webImg } from "../../assets/assets";
import Nav from "../../components/Nav";

function getImg(name) {
  return webImg.find((item) => item.name === name)?.Image;
}

const missionVisionGoal = [
  {
    icon: Target,
    color: "bg-pink text-purple",
    title: "Our Mission",
    text: "To empower girls through education, mentorship, and life skills development.",
  },
  {
    icon: Eye,
    color: "bg-purple/10 text-purple",
    title: "Our Vision",
    text: "A world where every girl has the opportunity to reach her full potential and become a leader.",
  },
  {
    icon: Flag,
    color: "bg-gold/15 text-gold",
    title: "Our Goal",
    text: "To support and empower 10,000 girls by 2030 across underserved communities.",
  },
];

const values = [
  {
    title: "Empowerment",
    text: "We equip girls with the tools and confidence to shape their own futures.",
    color: "bg-pink text-purple",
  },
  {
    title: "Education",
    text: "We believe education is the foundation for lasting change.",
    color: "bg-purple/10 text-purple",
  },
  {
    title: "Integrity",
    text: "We act with honesty, transparency and accountability.",
    color: "bg-gold/15 text-gold",
  },
  {
    title: "Compassion",
    text: "We serve with empathy and are committed to uplifting communities.",
    color: "bg-pink text-purple",
  },
];

const impactStats = [
  { label: "Girls Educated", value: "2,500+" },
  { label: "Communities Reached", value: "150+" },
  { label: "Mentors & Volunteers", value: "50+" },
  { label: "Partner Organizations", value: "30+" },
];

export default function About() {
  return (
    <div>
      <section className="relative min-h-[480px] md:min-h-[560px] overflow-hidden">
        <img
          src={getImg("headerImg") || getImg("girlsImg1")}
          alt="A mentor supporting a student"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-transparent" />

        <div className="relative px-6 md:px-12 lg:px-24 max-w-3xl pt-32 pb-20">
          <p className="text-gold text-xs font-semibold tracking-widest mb-4">
            ABOUT US
          </p>
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-white leading-tight">
            Empowering Girls.
            <br />
            Transforming Futures.
          </h1>
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 my-6">
              <span className="w-1/3 h-1 bg-gold rounded-full" />
              <span className="w-2 h-2 bg-gold rounded-full" />
              <span className="w-1/3 h-1 bg-gold rounded-full" />
            </div>
          </div>
          <p className="text-white/80 max-w-md">
            At Obinrin Empowerment Foundation, we believe every girl has the
            right to education, dignity, and opportunity. We exist to break
            barriers and build a world where girls can rise, lead, and
            thrive.
          </p>
          <a
            href="#our-story"
            className="inline-flex items-center gap-2 mt-8 bg-purple text-white px-10 py-5 rounded-full font-semibold text-sm hover:bg-purple/90 transition-colors"
          >
            Our Story <ArrowRight size={20} />
          </a>
        </div>
      </section>

      <section
        id="our-story"
        className="px-6 md:px-12 lg:px-24 py-20 grid md:grid-cols-2 gap-12"
      >
        <div>
          <p className="text-purple text-xs font-semibold tracking-widest mb-3">
            OUR STORY
          </p>
          <h2 className="font-heading font-bold text-3xl text-charcoal mb-4">
            From a Dream to a Movement
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <p className="text-sm text-charcoal/70">
              Obinrin Empowerment Foundation was founded on the belief that
              when you educate a girl, you uplift a community. What began as
              a small initiative has grown into a movement of hope, creating
              opportunities for girls to learn, lead, and build brighter
              futures.
            </p>
            <img
              src={getImg("missionImg")}
              alt="Founder at her desk"
              className="rounded-2xl w-full h-56 object-cover"
            />
          </div>
          <div className="mt-6">
            <p className="font-heading font-bold text-lg italic text-charcoal">
             Adedire Aanuoluwa
            </p>
            <p className="text-xs text-purple">Founder</p>
          </div>
        </div>

        <div className="bg-lavender/50 rounded-2xl p-8">
          <p className="text-purple text-xs font-semibold tracking-widest mb-6">
            OUR MISSION, VISION &amp; GOAL
          </p>
          <div className="space-y-6">
            {missionVisionGoal.map((item) => (
              <div key={item.title} className="flex gap-4 items-start">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.color}`}
                >
                  <item.icon size={18} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-charcoal">
                    {item.title}
                  </h3>
                  <p className="text-sm text-charcoal/70 mt-1">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Our Values + Impact So Far ---- */}
      <section className="px-6 md:px-12 lg:px-24 pb-20 grid md:grid-cols-2 gap-8">
        <div className="bg-lavender/40 rounded-2xl p-8">
          <p className="text-purple text-xs font-semibold tracking-widest mb-6">
            OUR VALUES
          </p>
          <div className="grid grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="flex gap-3 items-start">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${v.color}`}
                >
                  <Heart size={15} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-charcoal">
                    {v.title}
                  </h3>
                  <p className="text-xs text-charcoal/60 mt-1">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-lavender/60 rounded-2xl p-8">
          <p className="text-purple text-xs font-semibold tracking-widest mb-6">
            OUR IMPACT SO FAR
          </p>
          <div className="grid grid-cols-2 gap-6">
            {impactStats.map((stat) => (
              <div key={stat.label}>
                <p className="font-heading font-bold text-2xl text-purple">
                  {stat.value}
                </p>
                <p className="text-xs text-charcoal/60 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Bottom CTA ---- */}
      <section className="bg-purple text-white px-6 md:px-12 lg:px-24 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center shrink-0">
            <Heart size={16} className="text-gold" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-gold">Be Part of Her Journey</h3>
            <p className="text-sm text-white/70">
              Together, we can empower more girls and create a brighter
              future for all.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            to="/contact"
            className="flex items-center gap-2 border border-white/30 px-5 py-2.5 rounded-full text-sm hover:bg-white/10 transition-colors"
          >
            <Heart size={14} /> Partner With Us
          </Link>
          <Link
            to="/donate"
            className="flex items-center gap-2 bg-gold hover:bg-gold/90 text-charcoal px-5 py-2.5 rounded-full font-semibold text-sm transition-colors"
          >
            <Heart size={14} /> Donate Now
          </Link>
        </div>
      </section>
    </div>
  );
}

// fix navbar to be sticky and have a background color when scrolling down
// update images to be more relevant to the content
// fix program page for image to show properly on both mobile and desktop
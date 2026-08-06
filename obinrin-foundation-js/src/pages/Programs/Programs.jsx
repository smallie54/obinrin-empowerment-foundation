import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Heart, Users, Award, Sparkles, ArrowRight, Play } from "lucide-react";
import Nav from "../../components/Nav";
import { webImg } from "../../assets/assets"; // adjust to match your project
import publicApi from "../../lib/public";

function getImg(name) {
  return webImg.find((item) => item.name === name)?.Image;
}

const iconMap = {
  BookOpen,
  Heart,
  Users,
  Award,
  Sparkles,
};

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    publicApi
      .get("/programs", { params: { status: "active" } })
      .then((res) => setPrograms(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Nav />

      {/* ---- Hero ---- */}
      <section className="relative min-h-[480px] md:min-h-[560px] overflow-hidden">
        <img
          src={getImg("outreachImg5") || getImg("girlsImg1")}
          alt="Girls in a science class"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-transparent" />

        <div className="relative px-6 md:px-12 lg:px-24 max-w-xl pt-32 pb-20">
          <p className="text-gold text-xs font-semibold tracking-widest mb-4">
            OUR PROGRAMS
          </p>
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-white leading-tight">
            Empowering Girls.
            <br />
            Transforming <span className="text-gold">Futures.</span>
          </h1>
          <span className="block w-24 h-1 bg-gold rounded-full my-6" />
          <p className="text-white/80 max-w-lg">
            Our programs are designed to address the real challenges girls
            face and provide them with the tools, opportunities, and support
            they need to thrive.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            
              href="#what-we-do"
              className="self-start inline-flex items-center gap-2 bg-purple text-white px-6 py-3 rounded-full font-semibold text-sm"
            >
              Explore Our Programs <ArrowRight size={16} />
            </a>
            <Link
              to="/about"
              className="self-start inline-flex items-center gap-2 border border-white text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white hover:text-charcoal transition"
            >
              How We Work <Play size={14} fill="currentColor" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---- What We Do ---- */}
      <div id="what-we-do" className="pt-20 pb-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-purple text-xs font-semibold tracking-widest mb-3">
            WHAT WE DO
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-charcoal">
            Our Programs
          </h2>
          <p className="text-charcoal/60 max-w-xl mx-auto mt-4">
            Every program is built around one goal: giving girls the tools, support, and
            dignity they need to learn, lead, and thrive.
          </p>
        </div>

        {loading && <p className="text-center text-sm text-charcoal/50">Loading programs...</p>}
        {error && (
          <p className="text-center text-sm text-red-600">
            Couldn't load programs right now — please check back soon.
          </p>
        )}
        {!loading && !error && programs.length === 0 && (
          <p className="text-center text-sm text-charcoal/50">
            Programs are being finalized — check back soon.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {programs.map((program) => {
            const Icon = iconMap[program.icon] || Heart;
            return (
              <div
                key={program._id}
                className="rounded-2xl bg-lavender/40 overflow-hidden"
              >
                {program.coverImage?.url && (
                  <img
                    src={program.coverImage.url}
                    alt={program.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-purple shadow-sm mb-5">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-charcoal">
                    {program.name}
                  </h3>
                  {program.highlightStat && (
                    <p className="text-sm font-semibold text-purple mt-2">
                      {program.highlightStat}
                    </p>
                  )}
                  <p className="text-charcoal/70 mt-3 leading-relaxed">
                    {program.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
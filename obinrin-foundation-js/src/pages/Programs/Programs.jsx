import { useEffect, useState } from "react";
import { BookOpen, Heart, Users, Award, Sparkles } from "lucide-react";
import publicApi from "../lib/publicApi";

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
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-purple text-xs font-semibold tracking-widest mb-3">
          WHAT WE DO
        </p>
        <h1 className="font-heading font-bold text-3xl md:text-4xl text-charcoal">
          Our Programs
        </h1>
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
  );
}
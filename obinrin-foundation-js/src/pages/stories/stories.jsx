import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, ArrowRight, Star } from "lucide-react";
import { webImg } from "../../assets/assets";
import Nav from "../../components/Nav";

function getImg(name) {
  return webImg.find((item) => item.name === name)?.Image;
}

const categoryStyles = {
  Education: "bg-purple",
  Mentorship: "bg-pink text-purple",
  Leadership: "bg-gold",
  "Skill Development": "bg-gold",
  "Health & Wellness": "bg-pink text-purple",
  Community: "bg-purple",
};

const filters = [
  "All Stories",
  "Education",
  "Mentorship",
  "Health & Wellness",
  "Leadership",
  "Community",
];

const featuredStories = [
  {
    category: "Education",
    featured: true,
    image: getImg("girlsImg1"),
    title: "From Struggle to Success: Kemi's Journey",
    excerpt:
      "Kemi went from nearly dropping out of school to becoming the best student in her class — thanks to the support she received from Obinrin.",
    name: "Kemi, 16",
    location: "Oyo State, Nigeria",
    avatar: getImg("successStoryImg1"),
  },
  {
    category: "Mentorship",
    image: getImg("mentorshipImg1"),
    title: "Finding My Voice: Aisha's Story",
    excerpt:
      "Through mentorship and life skills training, Aisha discovered her confidence and is now leading a girls' club in her community.",
    name: "Aisha, 17",
    location: "Kwara State, Nigeria",
    avatar: getImg("successStoryImg2"),
  },
  {
    category: "Leadership",
    image: getImg("girlsImg2"),
    title: "Leading Change: Mercy's Impact",
    excerpt:
      "Mercy used the skills she gained from our leadership program to start a sanitation campaign in her school.",
    name: "Mercy, 18",
    location: "Lagos State, Nigeria",
    avatar: getImg("successStoryImg3"),
  },
];

const moreStories = [
  {
    category: "Education",
    image: getImg("outreachImg1"),
    title: "A Brighter Tomorrow for 50 Girls",
    excerpt: "How a new learning center is changing lives in a rural community.",
  },
  {
    category: "Skill Development",
    image: getImg("girlsImg3"),
    title: "From Dreams to Skills",
    excerpt: "Fatima's journey through our vocational training program.",
  },
  {
    category: "Health & Wellness",
    image: getImg("outreachImg2"),
    title: "Stronger, Healthier, Happier",
    excerpt: "How our wellness program is building healthier and more confident girls.",
  },
  {
    category: "Community",
    image: getImg("outreachImg3"),
    title: "Changing Mindsets, Together",
    excerpt: "A community coming together to support girls' education.",
  },
];

export default function Stories() {
  const [activeFilter, setActiveFilter] = useState("All Stories");

  const matchesFilter = (category) =>
    activeFilter === "All Stories" || category === activeFilter;

  const visibleFeatured = featuredStories.filter((s) => matchesFilter(s.category));
  const visibleMore = moreStories.filter((s) => matchesFilter(s.category));
  const noResults = visibleFeatured.length === 0 && visibleMore.length === 0;

  return (
    <div>
      <Nav/>
      {/* ---- Hero ---- */}
      <section className="relative pt-20 md:pt-0" >
        <div className="h-64 md:h-72 relative overflow-hidden">
          <img
            src={getImg("girlsImg2")}
            alt="Girls in a classroom"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-2xl mt-10">
            <p className="text-gold text-xs font-semibold tracking-widest mb-3">
              OUR STORIES
            </p>
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-white leading-tight">
              Real Girls. Real{" "}
              <span className="text-gold underline decoration-gold underline-offset-8">
                Change.
              </span>
            </h1>
            <p className="text-white/80 text-sm mt-4 max-w-md">
              Discover the inspiring stories of brave, talented and
              determined girls whose lives are being transformed through
              education, opportunity and support.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Filters ---- */}
      <section className="px-6 md:px-12 lg:px-24 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                activeFilter === filter
                  ? "bg-purple text-white border-purple"
                  : "bg-white text-charcoal/70 border-charcoal/15 hover:border-purple/40"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-charcoal/60 border border-charcoal/15 rounded-full px-4 py-2 w-fit">
          Sort by: <span className="font-semibold text-charcoal">Latest</span>
        </div>
      </section>

      {noResults && (
        <p className="px-6 md:px-12 lg:px-24 pb-10 text-charcoal/60 text-sm">
          No stories in this category yet — check back soon.
        </p>
      )}

      {/* ---- Featured story cards ---- */}
      {visibleFeatured.length > 0 && (
        <section className="px-6 md:px-12 lg:px-24 grid md:grid-cols-3 gap-6">
          {visibleFeatured.map((story) => (
            <article
              key={story.title}
              className="bg-white rounded-2xl overflow-hidden border border-charcoal/10 shadow-sm"
            >
              <div className="relative h-48">
                <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
                <span
                  className={`absolute top-3 left-3 text-white text-xs font-semibold px-3 py-1 rounded-full ${categoryStyles[story.category]}`}
                >
                  {story.category}
                </span>
                {story.featured && (
                  <span className="absolute top-3 right-3 bg-gold text-charcoal text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star size={12} fill="currentColor" /> Featured
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-heading font-bold text-charcoal">{story.title}</h3>
                <p className="text-sm text-charcoal/70 mt-2">{story.excerpt}</p>
                <div className="flex items-center justify-between mt-5">
                  <div className="flex items-center gap-2">
                    <img
                      src={story.avatar}
                      alt={story.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-charcoal">{story.name}</p>
                      <p className="text-xs text-charcoal/50">{story.location}</p>
                    </div>
                  </div>
                  <span className="text-purple text-sm font-semibold flex items-center gap-1">
                    Read Story <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* ---- More stories (compact cards) ---- */}
      {visibleMore.length > 0 && (
        <section className="px-6 md:px-12 lg:px-24 py-10 grid grid-cols-2 md:grid-cols-4 gap-5">
          {visibleMore.map((story) => (
            <article
              key={story.title}
              className="bg-white rounded-2xl overflow-hidden border border-charcoal/10 shadow-sm"
            >
              <div className="relative h-32">
                <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
                <span
                  className={`absolute top-2 left-2 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full ${categoryStyles[story.category]}`}
                >
                  {story.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-heading font-bold text-sm text-charcoal">{story.title}</h3>
                <p className="text-xs text-charcoal/50 mt-2">{story.excerpt}</p>
                <span className="inline-flex mt-3 text-purple">
                  <ArrowRight size={16} />
                </span>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* ---- Bottom CTA ---- */}
      <section className="relative overflow-hidden bg-lavender mx-6 md:mx-12 lg:mx-24 mb-16 rounded-2xl px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0">
            <Heart size={22} className="text-purple" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-charcoal">
              Be Part of More Stories Like These
            </h3>
            <p className="text-sm text-charcoal/70">
              Together, we can create brighter futures for more girls and
              build stronger communities.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            to="/donate"
            className="flex items-center gap-2 bg-gold hover:bg-gold/90 text-charcoal px-5 py-2.5 rounded-full font-semibold text-sm transition-colors"
          >
            <Heart size={14} /> Donate Now <ArrowRight size={14} />
          </Link>
          <Link
            to="/volunteer"
            className="flex items-center gap-2 bg-white border border-purple text-purple px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-purple/5 transition-colors"
          >
            Get Involved <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
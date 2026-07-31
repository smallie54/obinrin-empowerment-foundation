import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Calendar,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Users,
  Heart,
  Megaphone,
  ShieldCheck,
  PenSquare,
} from "lucide-react";
import { webImg } from "../../assets/assets";
import publicApi from "../../lib/public";

function getImg(name) {
  return webImg.find((item) => item.name === name)?.Image;
}

function readTime(content) {
  const words = content?.split(/\s+/).length || 0;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

const categoryIcons = {
  Education: BookOpen,
  Mentorship: Users,
  "Health & Well-being": Heart,
  Community: Users,
  "News & Updates": Megaphone,
};

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    publicApi
      .get("/blog", { params: { status: "published" } })
      .then((res) => setPosts(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const counts = {};
    posts.forEach((p) => {
      const cat = p.category || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([label, count]) => ({ label, count }));
  }, [posts]);

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* ---- Hero ---- */}
      <section className="relative min-h-[480px] md:min-h-[560px] overflow-hidden">
        <img
          src={getImg("outreachImg3") || getImg("girlsImg2")}
          alt="Girls studying in a classroom"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-transparent" />

        <div className="relative px-6 md:px-12 lg:px-24 max-w-3xl pt-32 pb-20">
          <p className="text-gold text-xs font-semibold tracking-widest mb-4">OUR BLOG</p>

          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
            Stories, Insights &
            <br />
            Ideas That Inspire
            <br />
            <span className="text-gold">Positive Change.</span>
          </h1>

          <div className="flex items-center gap-2 my-6">
            <span className="w-1/3 h-1 bg-gold rounded-full" />
            <span className="w-2 h-2 bg-gold rounded-full" />
            <span className="w-1/3 h-1 bg-gold rounded-full" />
          </div>
          <p className="text-white/80 max-w-2xl text-lg leading-relaxed">
            Discover inspiring stories, field updates, educational resources, and insights
            that highlight how empowering girls transforms families, communities, and the
            future of Africa.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-10 max-w-2xl">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full rounded-full bg-white px-12 pr-4 py-3.5 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 py-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="font-heading font-bold text-2xl text-charcoal mb-6">
            {activeCategory ? activeCategory : "Latest Stories"}
          </h2>

          {loading && <p className="text-sm text-charcoal/50">Loading posts...</p>}
          {error && (
            <p className="text-sm text-red-600">
              Couldn't load posts right now — please check back soon.
            </p>
          )}
          {!loading && !error && filteredPosts.length === 0 && (
            <p className="text-sm text-charcoal/50">
              {posts.length === 0
                ? "No posts published yet — check back soon."
                : "No posts match your search."}
            </p>
          )}

          <div className="grid sm:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post._id}
                className="bg-white rounded-2xl border border-charcoal/10 shadow-sm overflow-hidden"
              >
                <div className="relative h-40">
                  <img
                    src={post.coverImage?.url || getImg("outreachImg1")}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  {post.category && (
                    <span className="absolute bottom-3 left-3 text-white text-xs font-semibold px-3 py-1 rounded-full bg-purple">
                      {post.category}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-charcoal/50 mb-2">
                    <Calendar size={12} />
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    · {readTime(post.content)}
                  </div>
                  <h3 className="font-heading font-bold text-charcoal leading-snug">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-xs text-charcoal/60 mt-2 leading-relaxed">{post.excerpt}</p>
                  )}
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-purple text-sm font-semibold mt-4"
                  >
                    Read More <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ---- Sidebar ---- */}
        <div className="space-y-6">
          <div className="bg-white border border-charcoal/10 rounded-2xl p-6 shadow-sm">
            <h3 className="font-heading font-bold text-charcoal mb-4">Categories</h3>
            {categories.length === 0 && (
              <p className="text-sm text-charcoal/50">No categories yet.</p>
            )}
            <ul className="divide-y divide-charcoal/5">
              {categories.map((cat) => {
                const Icon = categoryIcons[cat.label] || BookOpen;
                const isActive = activeCategory === cat.label;
                return (
                  <li key={cat.label}>
                    <button
                      onClick={() => setActiveCategory(isActive ? null : cat.label)}
                      className="w-full flex items-center justify-between py-3 group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-9 h-9 rounded-full flex items-center justify-center ${
                            isActive ? "bg-purple text-white" : "bg-lavender text-purple"
                          }`}
                        >
                          <Icon size={16} />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-charcoal">{cat.label}</p>
                          <p className="text-xs text-charcoal/50">{cat.count} Articles</p>
                        </div>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-charcoal/20 group-hover:text-purple transition-colors"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="bg-lavender/60 rounded-2xl p-6">
            <span className="block w-8 h-1 bg-gold rounded-full mb-3" />
            <h3 className="font-heading font-bold text-charcoal mb-2">Stay Inspired</h3>
            <p className="text-xs text-charcoal/60 mb-4">
              Get the latest stories, updates, and insights delivered to your inbox.
            </p>
            <NewsletterMiniForm />
            <p className="flex items-center gap-1 text-[11px] text-charcoal/50 mt-3">
              <ShieldCheck size={12} /> We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Bottom CTA ---- */}
      <section className="mx-6 md:mx-12 lg:mx-24 mb-16 rounded-2xl bg-gold/10 border border-gold/20 px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple flex items-center justify-center shrink-0">
            <PenSquare size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-charcoal">Have a story to share?</h3>
            <p className="text-sm text-charcoal/60">
              We'd love to hear from you. Share your experiences and inspire others.
            </p>
          </div>
        </div>
        <a
          href="mailto:hello@obinrin.org"
          className="flex items-center gap-2 bg-gold text-charcoal px-6 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap hover:bg-gold/90 transition-colors"
        >
          Share Your Story <ArrowRight size={14} />
        </a>
      </section>
    </div>
  );
  
}

function NewsletterMiniForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "sending" | "done" | "error"

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      await publicApi.post("/newsletter/subscribe", { email });
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className="text-sm text-success font-semibold">Subscribed — thank you!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="rounded-full border border-charcoal/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple/30"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-purple hover:bg-purple/90 disabled:opacity-60 text-white rounded-full py-2.5 text-sm font-semibold transition-colors"
      >
        {status === "sending" ? "Subscribing..." : "Subscribe"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-600">Couldn't subscribe — try again.</p>
      )}
    </form>
  );
}
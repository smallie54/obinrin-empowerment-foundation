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
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import { webImg } from "../../assets/assets";

function getImg(name) {
    return webImg.find((item) => item.name === name)?.Image;
}

const posts = [
    {
        category: "Education",
        date: "May 20, 2024",
        readTime: "5 min read",
        title: "The Power of Education: Changing Lives, Building Futures",
        excerpt:
            "How access to quality education opens doors of opportunity for girls and transforms entire communities.",
        image: getImg("outreachImg1") || getImg("girlsImg1"),
    },
    {
        category: "Mentorship",
        date: "May 14, 2024",
        readTime: "4 min read",
        title: "Mentorship Matters: Guiding the Next Generation",
        excerpt:
            "Mentorship builds confidence, inspires leadership, and helps girls believe in their limitless potential.",
        image: getImg("mentorshipImg1"),
    },
    {
        category: "Community",
        date: "May 8, 2024",
        readTime: "6 min read",
        title: "Stronger Together: Communities Driving Change",
        excerpt:
            "When communities come together, incredible change happens. Here's how we're building stronger, safer spaces for girls.",
        image: getImg("outreachImg2"),
    },
];

const categories = [
    { icon: BookOpen, label: "Education", count: 12 },
    { icon: Users, label: "Mentorship", count: 8 },
    { icon: Heart, label: "Health & Well-being", count: 7 },
    { icon: Users, label: "Community", count: 10 },
    { icon: Megaphone, label: "News & Updates", count: 6 },
];

const categoryBadgeColor = {
    Education: "bg-purple-700",
    Mentorship: "bg-purple-700",
    Community: "bg-purple-700",
};

export default function Blog() {
    return (
        <div>
            <Nav />

            {/* ---- Hero ---- */}
            <section className="relative min-h-[480px] md:min-h-[560px] overflow-hidden">

                {/* Background Image */}
                <img
                    src={getImg("outreachImg3") || getImg("girlsImg2")}
                    alt="Girls studying in a classroom"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-transparent" />

                {/* Content */}
                <div className="relative px-6 md:px-12 lg:px-24 max-w-3xl pt-32 pb-20">

                    <p className="text-gold text-xs font-semibold tracking-widest mb-4">
                        OUR BLOG
                    </p>

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
                        Discover inspiring stories, field updates, educational resources,
                        and insights that highlight how empowering girls transforms
                        families, communities, and the future of Africa.
                    </p>

                    {/* Search */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-10 max-w-2xl">

                        <div className="relative flex-1">
                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                            />

                            <input
                                type="text"
                                placeholder="Search articles..."
                                className="w-full rounded-full bg-white px-12 pr-4 py-3.5 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-gold"
                            />
                        </div>

                        <button className="inline-flex items-center justify-center gap-2 bg-purple text-white px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-purple/90 transition-colors">
                            Explore Articles
                            <ArrowRight size={16} />
                        </button>

                    </div>

                </div>

            </section>

            <section className="px-6 md:px-12 lg:px-24 py-16 grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                    <h2 className="font-bold text-2xl text-gray-900 mb-6">Latest Stories</h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <article
                                key={post.title}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                            >
                                <div className="relative h-40">
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                                    <span
                                        className={`absolute bottom-3 left-3 text-white text-xs font-semibold px-3 py-1 rounded-full ${categoryBadgeColor[post.category]}`}
                                    >
                                        {post.category}
                                    </span>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                        <Calendar size={12} />
                                        {post.date} · {post.readTime}
                                    </div>
                                    <h3 className="font-bold text-gray-900 leading-snug">{post.title}</h3>
                                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{post.excerpt}</p>
                                    <Link
                                        to="/blog"
                                        className="inline-flex items-center gap-1 text-purple-700 text-sm font-semibold mt-4"
                                    >
                                        Read More <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="flex justify-center mt-10">
                        <Link
                            to="/blog"
                            className="flex items-center gap-2 border border-purple-700 text-purple-700 px-6 py-2.5 rounded-full font-semibold text-sm"
                        >
                            View All Articles <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* ---- Sidebar ---- */}
                <div className="space-y-6">
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
                        <ul className="divide-y divide-gray-100">
                            {categories.map((cat) => (
                                <li key={cat.label}>
                                    <Link
                                        to="/blog"
                                        className="flex items-center justify-between py-3 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center text-purple-700">
                                                <cat.icon size={16} />
                                            </span>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{cat.label}</p>
                                                <p className="text-xs text-gray-500">{cat.count} Articles</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-300 group-hover:text-purple-700" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-purple-50 rounded-2xl p-6">
                        <span className="block w-8 h-1 bg-yellow-400 rounded-full mb-3" />
                        <h3 className="font-bold text-gray-900 mb-2">Stay Inspired</h3>
                        <p className="text-xs text-gray-600 mb-4">
                            Get the latest stories, updates, and insights delivered to your
                            inbox.
                        </p>
                        <form className="flex flex-col gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                            />
                            <button
                                type="submit"
                                className="bg-purple-700 text-white rounded-full py-2.5 text-sm font-semibold"
                            >
                                Subscribe
                            </button>
                        </form>
                        <p className="flex items-center gap-1 text-[11px] text-gray-500 mt-3">
                            <ShieldCheck size={12} /> We respect your privacy. Unsubscribe anytime.
                        </p>
                    </div>
                </div>
            </section>

            {/* ---- Bottom CTA ---- */}
            <section className="mx-6 md:mx-12 lg:mx-24 mb-16 rounded-2xl bg-yellow-50 border border-yellow-100 px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center shrink-0">
                        <PenSquare size={18} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Have a story to share?</h3>
                        <p className="text-sm text-gray-600">
                            We'd love to hear from you. Share your experiences and inspire
                            others.
                        </p>
                    </div>
                </div>
                <Link
                    to="/contact"
                    className="flex items-center gap-2 bg-yellow-400 text-gray-900 px-6 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap"
                >
                    Share Your Story <ArrowRight size={14} />
                </Link>
            </section>

            <Footer />
        </div>
    );
}
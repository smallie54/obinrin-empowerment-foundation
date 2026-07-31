import { Link } from "react-router-dom";
import {
    ArrowRight,
    Users,
    GraduationCap,
    HeartHandshake,
    BookOpen,
    UserCheck,
    Globe,
    Quote,
    HeartPulse,
    Briefcase,
    Award,
} from "lucide-react";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import { webImg } from "../../assets/assets";

function getImg(name) {
    return webImg.find((item) => item.name === name)?.Image;
}

const stats = [
    { icon: Users, value: "25,000+", label: "Girls Empowered" },
    { icon: GraduationCap, value: "18,500+", label: "Educated" },
    { icon: HeartHandshake, value: "150+", label: "Communities Reached" },
    { icon: BookOpen, value: "320+", label: "Schools Supported" },
    { icon: UserCheck, value: "95%", label: "Program Success Rate" },
    { icon: Globe, value: "5", label: "Countries" },
];

const countries = [
    { name: "Kenya", focus: "Education, Leadership", dot: "bg-purple-700" },
    { name: "Uganda", focus: "Education, Health", dot: "bg-yellow-400" },
    { name: "Tanzania", focus: "Education, Economic Empowerment", dot: "bg-purple-700" },
    { name: "Zambia", focus: "Education, Leadership", dot: "bg-yellow-400" },
    { name: "Rwanda", focus: "Education, Health", dot: "bg-purple-700" },
];

const impactAreas = [
    { icon: GraduationCap, label: "Education" },
    { icon: HeartPulse, label: "Health & Wellness" },
    { icon: Briefcase, label: "Economic Empowerment" },
    { icon: Award, label: "Leadership" },
];

export default function Impact() {
    return (
        <div>
            <Nav />

            {/* ---- Hero ---- */}
            <section className="relative min-h-[520px] md:min-h-[600px] overflow-hidden">
                <img
                    src={getImg("girlsImg4") || getImg("outreachImg1")}
                    alt="A girl looking up hopefully in class"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#111827]/85 to-transparent" />

                <div className="relative flex flex-col px-6 md:px-12 lg:px-24 max-w-2xl pt-32 pb-24">
                    <p className="text-yellow-400 text-xs font-semibold tracking-widest mb-4">
                        OUR IMPACT
                    </p>
                    <h1 className="font-bold text-4xl md:text-5xl text-white leading-tight">
                        Real Change.
                        <br />
                        Measurable <span className="text-yellow-400">Impact.</span>
                    </h1>
                      <div className="flex items-center gap-2 my-6">
                        <span className="w-1/3 h-1 bg-gold rounded-full" />
                        <span className="w-2 h-2 bg-gold rounded-full" />
                        <span className="w-1/3 h-1 bg-gold rounded-full" />
                    </div>
                    <p className="text-white/80 max-w-lg">
                        Every girl empowered creates a ripple effect that transforms
                        families, uplifts communities, and builds a brighter future for
                        generations to come.
                    </p>
                </div>

                {/* ---- Stats bar, overlapping the bottom edge of the hero ---- */}
                <div className="relative md:absolute md:left-6 md:right-6 lg:left-24 lg:right-24 md:-bottom-10 bg-white rounded-2xl shadow-lg mx-6 md:mx-0 -mt-6 md:mt-0 grid grid-cols-2 md:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex flex-col items-center text-center px-4 py-6">
                            <stat.icon size={22} className="text-purple-700 mb-2" />
                            <p className="font-bold text-xl text-purple-700">{stat.value}</p>
                            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---- Where We Work ---- */}
            <section className="px-6 md:px-12 lg:px-24 pt-24 md:pt-32 pb-20 grid lg:grid-cols-3 gap-10 items-center">
                <div>
                    <p className="text-yellow-500 text-xs font-semibold tracking-widest mb-3">
                        WHERE WE WORK
                    </p>
                    <h2 className="font-bold text-3xl text-gray-900 leading-tight mb-4">
                        Empowering Girls Across <span className="text-purple-700">Africa</span>
                    </h2>
                    <p className="text-gray-600 text-sm mb-8">
                        Our programs span across 5 countries in Africa, reaching rural
                        and underserved communities where the need is greatest.
                    </p>
                    <Link
                        to="/programs"
                        className="self-start inline-flex items-center gap-2 bg-purple-700 text-white px-6 py-3 rounded-full font-semibold text-sm"
                    >
                        Explore Our Programs <ArrowRight size={16} />
                    </Link>
                </div>

                {/* Simplified map placeholder — swap for a real Africa SVG/map graphic */}
                <div className="flex justify-center">
                    <div className="w-full max-w-xs aspect-square rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                        Africa map graphic
                    </div>
                </div>

                <div className="space-y-5">
                    {countries.map((country) => (
                        <div key={country.name} className="flex items-start gap-3">
                            <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${country.dot}`} />
                            <div>
                                <p className="font-bold text-gray-900 text-sm">{country.name}</p>
                                <p className="text-xs text-gray-500">{country.focus}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---- Growing Impact + Quote card ---- */}
            <section className="px-6 md:px-12 lg:px-24 pb-20 grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 bg-purple-50 rounded-2xl p-8">
                    <h3 className="font-bold text-xl text-gray-900 mb-3">
                        Beyond Borders, Building Futures
                    </h3>
                    <p className="text-gray-600 text-sm mb-6 max-w-lg">
                        Our reach keeps growing every year as more communities open their
                        doors to change. Behind every number is a network of local staff,
                        partner schools, and villages who make this work possible.
                    </p>
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div>
                            <p className="font-bold text-2xl text-purple-700">40+</p>
                            <p className="text-xs text-gray-500 mt-1">Local Staff & Volunteers</p>
                        </div>
                        <div>
                            <p className="font-bold text-2xl text-purple-700">85+</p>
                            <p className="text-xs text-gray-500 mt-1">Partner Schools</p>
                        </div>
                        <div>
                            <p className="font-bold text-2xl text-purple-700">200+</p>
                            <p className="text-xs text-gray-500 mt-1">Villages Reached</p>
                        </div>
                    </div>
                    <Link
                        to="/donate"
                        className="self-start inline-flex items-center gap-2 bg-purple-700 text-white px-6 py-3 rounded-full font-semibold text-sm"
                    >
                        Support This Work <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="relative rounded-2xl overflow-hidden">
                    <img
                        src={getImg("outreachImg9") || getImg("girlsImg2")}
                        alt="A group of girls smiling together"
                        className="w-full h-56 object-cover"
                    />
                    <div className="bg-gray-900 text-white p-6">
                        <Quote size={20} className="text-yellow-400 mb-2" />
                        <p className="text-sm">
                            When you empower a girl, you empower a community, a nation, and a
                            future.
                        </p>
                        <p className="text-xs text-yellow-400 mt-3">— Our Belief</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Play,
    Heart,
    GraduationCap,
    UserRound,
    HeartPulse,
    Briefcase,
    Users,
    HandHeart,
} from "lucide-react";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import { webImg } from "../../assets/assets"; // adjust this path to match your project

function getImg(name) {
    return webImg.find((item) => item.name === name)?.Image;
}

const programs = [
    {
        icon: GraduationCap,
        iconBg: "bg-purple-700",
        title: "Education Support",
        titleColor: "text-purple-700",
        image: getImg("outreachImg1"),
        text: "Providing access to quality education, school supplies, and learning resources to help girls excel academically.",
    },
    {
        icon: UserRound,
        iconBg: "bg-amber-500",
        title: "Mentorship & Leadership",
        titleColor: "text-gray-900",
        image: getImg("mentorshipImg1"),
        text: "Connecting girls with positive role models and mentors to build confidence, leadership skills, and purpose.",
    },
    {
        icon: HeartPulse,
        iconBg: "bg-pink-500",
        title: "Health & Well-being",
        titleColor: "text-pink-600",
        image: getImg("outreachImg2"),
        text: "Promoting physical and mental well-being through health education, counseling, and hygiene support programs.",
    },
    {
        icon: Briefcase,
        iconBg: "bg-green-600",
        title: "Skills Development",
        titleColor: "text-green-600",
        image: getImg("outreachImg3"),
        text: "Equipping girls with practical skills in technology, entrepreneurship, and vocational training for economic independence.",
    },
    {
        icon: Users,
        iconBg: "bg-purple-700",
        title: "Community Engagement",
        titleColor: "text-purple-700",
        image: getImg("outreachImg4"),
        text: "Building safe spaces and community networks that inspire, support, and advocate for girls' rights and opportunities.",
    },
];

export default function Programs() {
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
                <div className="absolute inset-0 bg-gradient-to-r from-[#1A0B2E] via-[#1A0B2E]/80 to-transparent" />

                <div className="relative px-6 md:px-12 lg:px-24 max-w-xl pt-32 pb-20">
                    <p className="text-yellow-400 text-xs font-semibold tracking-widest mb-4">
                        OUR PROGRAMS
                    </p>
                    <h1 className="font-bold text-4xl md:text-5xl text-white leading-tight">
                        Empowering Girls.
                        <br />
                        Transforming <span className="text-yellow-400">Futures.</span>
                    </h1>
                    <span className="block w-14 h-1 bg-yellow-400 rounded-full my-6" />
                    <p className="text-white/80 max-w-md">
                        Our programs are designed to address the real challenges girls
                        face and provide them with the tools, opportunities, and support
                        they need to thrive.
                    </p>
                    <div className="flex flex-wrap gap-3 mt-8">
                        <Link
                            to="#what-we-do"
                            className="flex items-center gap-2 bg-purple-700 text-white px-6 py-3 rounded-full font-semibold text-sm"
                        >
                            Explore Our Programs <ArrowRight size={16} />
                        </Link>
                        <Link
                            to="/about"
                            className="flex items-center gap-2 border border-white text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white hover:text-gray-900 transition"
                        >
                            How We Work <Play size={14} fill="currentColor" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ---- What We Do ---- */}
            <section id="what-we-do" className="px-6 md:px-12 lg:px-24 py-20">
                <div className="text-center mb-14">
                    <h2 className="font-bold text-3xl text-gray-900">
                        What <span className="text-purple-700 underline decoration-purple-300 underline-offset-4">We</span> Do
                    </h2>
                    <p className="text-gray-500 text-sm mt-3">
                        We implement holistic programs that educate, empower, and equip
                        girls for leadership and life.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {programs.map((program) => (
                        <div
                            key={program.title}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                        >
                            <div className="relative h-40">
                                <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
                                <div
                                    className={`absolute -bottom-5 left-5 w-11 h-11 rounded-full flex items-center justify-center ${program.iconBg}`}
                                >
                                    <program.icon size={18} className="text-white" />
                                </div>
                            </div>
                            <div className="p-5 pt-8">
                                <h3 className={`font-bold text-sm mb-2 ${program.titleColor}`}>
                                    {program.title}
                                </h3>
                                <p className="text-xs text-gray-500 leading-relaxed">{program.text}</p>
                                <Link
                                    to="/programs"
                                    className={`inline-flex items-center gap-1 text-xs font-semibold mt-4 ${program.titleColor}`}
                                >
                                    Learn More <ArrowRight size={12} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---- Bottom CTA ---- */}
            <section className="relative mx-6 md:mx-12 lg:mx-24 mb-16 rounded-2xl overflow-hidden bg-[#2D0A63]">
                <img
                    src={getImg("outreachImg6") || getImg("girlsImg2")}
                    alt=""
                    className="absolute right-0 top-0 h-full w-1/3 object-cover opacity-30"
                />
                <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 px-8 py-10">
                    <div className="flex items-center gap-4 max-w-sm">
                        <div className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center shrink-0">
                            <HandHeart size={22} className="text-yellow-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg">Together, we can do more.</h3>
                            <p className="text-sm text-white/70">
                                Support our programs and help more girls unlock their
                                potential and create a brighter future.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 text-center">
                        <div>
                            <p className="font-bold text-2xl text-yellow-400">5+</p>
                            <p className="text-xs text-white/70">Active Programs</p>
                        </div>
                        <span className="w-px h-10 bg-white/20" />
                        <div>
                            <p className="font-bold text-2xl text-yellow-400">1,200+</p>
                            <p className="text-xs text-white/70">Girls Empowered</p>
                        </div>
                        <span className="w-px h-10 bg-white/20" />
                        <div>
                            <p className="font-bold text-2xl text-yellow-400">15+</p>
                            <p className="text-xs text-white/70">Communities Reached</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-2">
                        <Link
                            to="/donate"
                            className="flex items-center gap-2 bg-yellow-400 text-gray-900 px-5 py-2.5 rounded-full font-semibold text-sm"
                        >
                            <Heart size={14} /> Support Our Programs
                        </Link>
                        <Link to="/donate" className="flex items-center gap-1 text-white text-xs">
                            Other Ways to Give <ArrowRight size={12} />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
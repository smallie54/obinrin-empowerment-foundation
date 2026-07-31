import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Image as ImageIcon, ChevronDown } from "lucide-react";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import { webImg } from "../../assets/assets"; 
import publicApi from "../../lib/public";

function getImg(name) {
  return webImg.find((item) => item.name === name)?.Image;
}

const filters = [
  "All Photos",
  "Education",
  "Mentorship",
  "Health & Well-being",
  "Community",
  "Events",
  "Achievements",
];


const fallbackImages = [
  { src: getImg("outreachImg1"), alt: "Community outreach visit", category: "Community" },
  { src: getImg("outreachImg2"), alt: "Community outreach visit", category: "Community" },
  { src: getImg("outreachImg3"), alt: "Community outreach visit", category: "Education" },
  { src: getImg("outreachImg4"), alt: "Community outreach visit", category: "Community" },
  { src: getImg("outreachImg5"), alt: "Community outreach visit", category: "Education" },
  { src: getImg("outreachImg6"), alt: "Community outreach visit", category: "Events" },
  { src: getImg("outreachImg7"), alt: "Community outreach visit", category: "Events" },
  { src: getImg("outreachImg8"), alt: "Pad distribution program", category: "Health & Well-being" },
  { src: getImg("outreachImg9"), alt: "Community outreach visit", category: "Achievements" },
];


const categoryLabelMap = {
  events: "Events",
  schools: "Education",
  outreach: "Community",
  mentorship: "Mentorship",
  training: "Achievements",
};

export default function Gallery() {
  const [images, setImages] = useState(fallbackImages);
  const [activeFilter, setActiveFilter] = useState("All Photos");

useEffect(() => {
  publicApi
    .get("/gallery")
    .then((res) => {
      if (res.data.length > 0) {
        setImages(
          res.data.map((img) => ({
            src: img.url,
            alt: img.caption || `${img.category} photo`,
            category: img.category,
          }))
        );
      }
    })
    .catch(() => {});
}, []);

  const visibleImages =
    activeFilter === "All Photos"
      ? images
      : images.filter((img) => img.category === activeFilter);

  return (
    <div>
      <Nav />

      {/* ---- Hero ---- */}
      <section className="relative min-h-[480px] md:min-h-[560px] overflow-hidden">
        <img
          src={getImg("outreachImg7") || getImg("girlsImg1")}
          alt="Girls in a classroom"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A0B2E] via-[#1A0B2E]/80 to-transparent" />

        <div className="relative flex flex-col px-6 md:px-12 lg:px-24 max-w-2xl pt-32 pb-20">
          <p className="text-yellow-400 text-xs font-semibold tracking-widest mb-4">
            OUR GALLERY
          </p>
          <h1 className="font-bold text-4xl md:text-5xl text-white leading-tight">
            Moments of Impact.
            <br />
            Lives in <span className="text-yellow-400">Transformation.</span>
          </h1>
          <div className="flex items-center gap-2 my-6">
            <span className="w-1/3 h-1 bg-gold rounded-full" />
            <span className="w-2 h-2 bg-gold rounded-full" />
            <span className="w-1/3 h-1 bg-gold rounded-full" />
          </div>
          <p className="text-white/80 max-w-lg">
            Explore moments from our programs, events, and community
            activities that reflect the power of education, mentorship, and
            support for girls.
          </p>
          <Link
            to="/impact"
            className="self-start inline-flex items-center justify-center gap-2 mt-8 border border-white text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white hover:text-gray-900 transition"
          >
            See Our Impact <ArrowRight size={16} />
          </Link>
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
                  ? "bg-purple-700 text-gold border-purple-700"
                  : "bg-white text-gray-700 border-gray-200 hover:border-purple-300"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 rounded-full px-4 py-2 w-fit">
          <ImageIcon size={14} /> Filter by Category <ChevronDown size={14} />
        </button>
      </section>

      {/* ---- Photo grid ---- */}
      <section className="px-6 md:px-12 lg:px-24 grid grid-cols-2 md:grid-cols-4 gap-5">
        {visibleImages.map((img, i) => (
          <div key={i} className="rounded-2xl overflow-hidden aspect-square">
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          </div>
        ))}
      </section>

      {/* ---- Bottom CTA ---- */}
      <section className="mx-6 md:mx-12 lg:mx-24 my-16 rounded-2xl bg-purple-50 px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-purple-700 flex items-center justify-center shrink-0">
            <ImageIcon size={22} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">
              Every photo tells a story of hope, resilience, and empowerment.
            </h3>
            <p className="text-sm text-gray-600">
              Together, we are building a brighter future for girls and
              communities.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Link
            to="/donate"
            className="flex items-center gap-2 bg-purple-700 text-white px-5 py-2.5 rounded-full font-semibold text-sm"
          >
            <Heart size={14} /> Support Our Mission
          </Link>
          <Link
            to="/volunteer"
            className="flex items-center gap-1 text-purple-700 font-semibold text-sm"
          >
            Get Involved <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
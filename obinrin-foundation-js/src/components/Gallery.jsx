import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { webImg } from "../assets/assets";

const getImg = (name) => webImg.find((img) => img.name === name)?.Image;

const images = [
  { src: getImg("outreachImg1"), alt: "Community outreach visit" },
  { src: getImg("outreachImg2"), alt: "Community outreach visit" },
  { src: getImg("outreachImg3"), alt: "Community outreach visit" },
  { src: getImg("outreachImg4"), alt: "Community outreach visit" },
  { src: getImg("outreachImg5"), alt: "Community outreach visit" },
  { src: getImg("outreachImg6"), alt: "Community outreach visit" },
  { src: getImg("outreachImg7"), alt: "Community outreach visit" },
  { src: getImg("outreachImg8"), alt: "Pad distribution program" },
  { src: getImg("outreachImg9"), alt: "Community outreach visit" },
];

export default function Gallery() {
  return (
    <section className="bg-lavender py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-purple text-xs font-semibold tracking-widest mb-4">
            OUR GALLERY
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-charcoal">
            Moments of Impact.
            <br />
            Lives in <span className="text-purple">Transformation.</span>
          </h2>
          <p className="text-charcoal/70 mt-4">
            Explore moments from our programs, events, and community
            activities that reflect the power of education, mentorship, and
            support for girls.
          </p>
          <Link
            to="/impact"
            className="inline-flex items-center justify-center gap-2 mt-8 bg-purple text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-purple/90 transition-colors"
          >
            See Our Impact <ArrowRight size={16} />
          </Link>
        </div>

        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative group break-inside-avoid rounded-2xl overflow-hidden"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/50 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 text-white font-semibold text-sm transition-opacity">
                  View Story
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
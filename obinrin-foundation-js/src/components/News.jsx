import { webImg } from "../assets/assets";

const getImg = (name) => webImg.find((img) => img.name === name)?.Image;

const posts = [
  {
    title: "500 Girls Receive Dignity Kits in Northern Nigeria",
    category: "Program Update",
    date: "Jul 2026",
    readTime: "4 min read",
    image: getImg("outreachImg8"), // pad distribution photo
  },
  {
    title: "Meet the Mentors Shaping Tomorrow's Leaders",
    category: "Stories",
    date: "Jun 2026",
    readTime: "6 min read",
    image: getImg("mentorshipImg1"),
  },
  {
    title: "Our 2026 Annual Impact Report Is Here",
    category: "Transparency",
    date: "May 2026",
    readTime: "3 min read",
    image: getImg("impactReport"),
  },
];

export default function News() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-16">
          Latest News
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.title}
              className="group cursor-pointer rounded-2xl overflow-hidden"
            >
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="pt-5">
                <p className="text-xs font-semibold text-purple uppercase tracking-widest">
                  {post.category}
                </p>
                <h3 className="font-heading font-bold text-lg mt-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-charcoal/50 mt-3">
                  {post.date} · {post.readTime}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
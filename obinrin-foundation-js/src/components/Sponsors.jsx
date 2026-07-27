const sponsors = [
  "UNICEF",
  "UN Women",
  "Google",
  "Microsoft",
  "African Union",
  "Mastercard Foundation",
  "Local NGOs",
];

export default function Sponsors() {
  const loop = [...sponsors, ...sponsors];

  return (
    <section className="bg-white py-16 overflow-hidden">
      <p className="text-center text-sm font-semibold text-charcoal/50 uppercase tracking-widest mb-8">
        Trusted Partners
      </p>

      <div className="relative flex overflow-hidden">
        <div className="flex animate-[scroll_30s_linear_infinite] gap-16 pr-16">
          {loop.map((name, i) => (
            <span
              key={i}
              className="font-heading font-bold text-xl text-charcoal/30 whitespace-nowrap"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

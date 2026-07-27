const columns = [
  {
    title: "Organization",
    links: ["About", "Programs", "Impact", "Stories", "Gallery"],
  },
  {
    title: "Support",
    links: ["Donate", "Volunteer", "Sponsor", "Corporate Giving"],
  },
  {
    title: "Transparency",
    links: [
      "Annual Reports",
      "Financial Reports",
      "Impact Reports",
      "Privacy Policy",
    ],
  },
  {
    title: "Contact",
    links: ["Email", "Phone", "Address"],
  },
];

const socials = ["Instagram", "Facebook", "LinkedIn", "YouTube"];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/70 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-heading font-semibold text-white mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm">© 2026 Obinrin Empowerment Foundation</p>
          <div className="flex gap-5 text-sm">
            {socials.map((s) => (
              <a key={s} href="#" className="hover:text-white transition-colors">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "../assets/imges/logo.png";

const links = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Programs", to: "/programs" },
  { label: "Impact", to: "/impact" },
  { label: "Stories", to: "/stories" },
  { label: "Gallery", to: "/gallery" },
  { label: "Blog", to: "/blog" },
];

export default function Nav({ solid = false }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={
        solid
          ? "relative bg-white shadow-sm z-20"
          : "absolute top-0 left-0 right-0 z-20"
      }
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 sm:py-6">
        <Link to="/" className="flex items-center shrink-0">
          <img
            src={Logo}
            alt="Obinrin Empowerment Foundation"
          className="h-14 sm:h-16 lg:h-20 w-auto object-contain"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `text-sm font-medium pb-1 border-b-2 transition-colors ${isActive
                  ? solid
                    ? "text-purple border-gold"
                    : "text-white border-gold"
                  : solid
                    ? "text-charcoal/80 border-transparent hover:text-charcoal"
                    : "text-white/90 border-transparent hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/donate"
            className="hidden sm:inline-flex bg-gold hover:bg-gold/90 text-charcoal font-semibold text-sm px-5 py-2.5 rounded-full transition-colors"
          >
            Donate Now
          </Link>

          <button
            onClick={() => setMenuOpen(true)}
            className={`lg:hidden p-2 ${solid ? "text-charcoal" : "text-white"}`}
            aria-label="Open menu"
          >
            <Menu size={26} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-charcoal/60 lg:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="absolute top-0 right-0 h-full w-72 bg-white shadow-2xl px-6 py-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-10">
                <img src={Logo} alt="Obinrin Empowerment Foundation" className="h-10 w-auto" />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-charcoal p-2"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/"}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `py-3 border-b border-charcoal/10 font-medium transition-colors ${isActive ? "text-purple" : "text-charcoal hover:text-purple"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              <Link
                to="/donate"
                onClick={() => setMenuOpen(false)}
                className="block text-center w-full mt-8 bg-gold hover:bg-gold/90 text-charcoal font-semibold py-3 rounded-full transition-colors"
              >
                Donate Now
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
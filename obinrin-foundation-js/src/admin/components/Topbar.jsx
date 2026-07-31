import { useState } from "react";
import { Menu, Search, Plus, ChevronDown, Calendar, Bell, LogOut } from "lucide-react";
import { webImg } from "../../assets/assets";
import { useAdminAuth } from "../auth/AdminAuthContext";

const getImg = (name) => webImg.find((img) => img.name === name)?.Image;

export default function Topbar({ onOpenMobileMenu }) {
  const { admin, logout } = useAdminAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-charcoal/10 px-4 sm:px-6 py-4 flex items-center gap-4">
      <button
        onClick={onOpenMobileMenu}
        className="lg:hidden text-charcoal p-1"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <div className="flex-1 flex items-center gap-2 bg-lavender/50 rounded-full px-4 py-2.5 max-w-md">
        <Search size={16} className="text-charcoal/40 shrink-0" />
        <input
          type="text"
          placeholder="Search anything..."
          className="bg-transparent outline-none text-sm text-charcoal placeholder:text-charcoal/40 w-full"
        />
      </div>

      <div className="ml-auto flex items-center gap-3 sm:gap-4">
        <button className="hidden sm:inline-flex items-center gap-2 bg-purple hover:bg-purple/90 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors">
          <Plus size={16} /> Create New <ChevronDown size={14} />
        </button>

        <button className="text-charcoal/60 hover:text-charcoal p-2" aria-label="Calendar">
          <Calendar size={19} />
        </button>

        <button className="relative text-charcoal/60 hover:text-charcoal p-2" aria-label="Notifications">
          <Bell size={19} />
          <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-charcoal text-[10px] font-bold rounded-full flex items-center justify-center">
            5
          </span>
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 pl-2 border-l border-charcoal/10"
          >
            <img
              src={getImg("girlsImg1")}
              alt="Admin"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="hidden sm:block leading-tight text-left">
              <p className="text-sm font-semibold text-charcoal">{admin?.name || "Admin"}</p>
              <p className="text-xs text-charcoal/50 capitalize">{admin?.role || "admin"}</p>
            </div>
            <ChevronDown size={14} className="hidden sm:block text-charcoal/40" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-charcoal/10 rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={15} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

import { Menu, Search, ChevronDown, Calendar, Bell } from "lucide-react";
import { webImg } from "../assets/assets";

const getImg = (name) => webImg.find((img) => img.name === name)?.Image;

export default function AdminTopbar() {
  return (
    <header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-charcoal/10">
      <button className="text-charcoal/60 hover:text-charcoal lg:hidden">
        <Menu size={22} />
      </button>

      <div className="flex-1 max-w-md flex items-center gap-2 bg-lavender/40 rounded-full px-4 py-2.5">
        <Search size={16} className="text-charcoal/40" />
        <input
          type="text"
          placeholder="Search anything..."
          className="bg-transparent outline-none text-sm text-charcoal placeholder:text-charcoal/40 w-full"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button className="hidden sm:flex items-center gap-2 bg-purple hover:bg-purple/90 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors">
          + Create New <ChevronDown size={14} />
        </button>

        <button className="text-charcoal/60 hover:text-charcoal p-2">
          <Calendar size={20} />
        </button>

        <button className="relative text-charcoal/60 hover:text-charcoal p-2">
          <Bell size={20} />
          <span className="absolute top-1 right-1 bg-gold text-charcoal text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            5
          </span>
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-charcoal/10">
          <img
            src={getImg("successStoryImg1")}
            alt="Admin profile"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-charcoal">Admin User</p>
            <p className="text-xs text-charcoal/50">Super Administrator</p>
          </div>
          <ChevronDown size={14} className="text-charcoal/40 hidden sm:block" />
        </div>
      </div>
    </header>
  );
}

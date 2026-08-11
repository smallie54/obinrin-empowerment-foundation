import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  HandCoins,
  MessageSquareHeart,
  CalendarClock,
  BookOpen,
  Handshake,
  UserPlus,
  CalendarDays,
  Newspaper,
  Images,
  BarChart3,
  Settings,
  Book,
  School
} from "lucide-react";
import { webImg } from "../../assets/assets";

const getImg = (name) => webImg.find((img) => img.name === name)?.Image;

const navItems = [
  { label: "Dashboard", to: "/Admin", icon: LayoutDashboard, end: true },
  { label: "Donors", to: "/admin/Donors", icon: Users },
  { label: "Donations", to: "/admin/Donations", icon: HandCoins },
  { label: "Thank You Messages", to: "/admin/Messages", icon: MessageSquareHeart },
  { label: "Outreach Planning", to: "/admin/Outreach", icon: CalendarClock },
  { label: "Programs", to: "/admin/Programs", icon: BookOpen },
  { label: "Stories", to: "/admin/Stories", icon: Book },
  { label: "Partnerships", to: "/admin/Partnerships", icon: Handshake },
  { label: "Volunteers", to: "/admin/Volunteers", icon: UserPlus },
  { label: "Events", to: "/admin/Events", icon: CalendarDays },
  { label: "Blog", to: "/admin/Blog", icon: Newspaper },
  { label: "Gallery", to: "/admin/Gallery", icon: Images },
  { label: "Reports & Analytics", to: "/admin/Reports", icon: BarChart3 },
  { label: "Settings", to: "/admin/Settings", icon: Settings },
  { label: "Schools", to: "/admin/Schools", icon: School },
];

export default function Sidebar({ mobile = false }) {
  return (
    <aside
      className={`${mobile ? "flex" : "hidden lg:flex"
        } flex-col w-64 shrink-0 bg-purple text-white/80 h-screen`}
    >
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10 shrink-0">
        <img src={getImg("logoimg")} alt="Obinrin" className="h-9 w-9 rounded-full object-cover" />
        <div>
          <p className="font-heading font-bold text-white text-sm leading-tight">
            Obinrin Empowerment
          </p>
          <p className="text-[10px] text-white/50 tracking-wide">
            Educate. Empower. Elevate.
          </p>
        </div>
      </div>

      <nav className="flex-1 min-h-0 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                ? "bg-white text-purple"
                : "text-white/75 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="m-4 rounded-2xl bg-white/10 p-5 shrink-0">
        <p className="text-sm text-white/90 leading-snug">
          You are creating brighter futures with every decision.
        </p>
        <button className="mt-4 bg-gold text-charcoal text-xs font-semibold px-4 py-2 rounded-full">
          View Impact
        </button>
      </div>
    </aside>
  );
}

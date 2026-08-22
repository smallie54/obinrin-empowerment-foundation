import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Menu,
  Search,
  Plus,
  ChevronDown,
  Calendar,
  Bell,
  LogOut,
  Handshake,
  UserPlus,
  Newspaper,
  Image,
  Send,
  School,
} from "lucide-react";
import { webImg } from "../../assets/assets";
import { useAdminAuth } from "../auth/AdminAuthContext";
import api from "../api/client";

const getImg = (name) => webImg.find((img) => img.name === name)?.Image;

// Every jump-to-able admin page, used by both Search and Create New.
const pages = [
  { label: "Dashboard", to: "/admin" },
  { label: "Schools", to: "/admin/schools" },
  { label: "Donors", to: "/admin/donors" },
  { label: "Donations", to: "/admin/donations" },
  { label: "Thank You Messages", to: "/admin/messages" },
  { label: "Outreach Planning", to: "/admin/outreach" },
  { label: "Programs", to: "/admin/programs" },
  { label: "Partnerships", to: "/admin/partnerships" },
  { label: "Volunteers", to: "/admin/volunteers" },
  { label: "Events", to: "/admin/events" },
  { label: "Blog", to: "/admin/blog" },
  { label: "Gallery", to: "/admin/gallery" },
  { label: "Reports & Analytics", to: "/admin/reports" },
  { label: "Settings", to: "/admin/settings" },
];

const createActions = [
  { label: "New Outreach", to: "/admin/outreach", icon: Send },
  { label: "Add School", to: "/admin/schools", icon: School },
  { label: "Add Partner", to: "/admin/partnerships", icon: Handshake },
  { label: "Add Volunteer", to: "/admin/volunteers", icon: UserPlus },
  { label: "New Event", to: "/admin/events", icon: Calendar },
  { label: "New Blog Post", to: "/admin/blog", icon: Newspaper },
  { label: "Upload to Gallery", to: "/admin/gallery", icon: Image },
];

export default function Topbar({ onOpenMobileMenu }) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);

  const searchResults = pages.filter((p) =>
    p.label.toLowerCase().includes(search.toLowerCase())
  );

  // Close the search dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSearchKeyDown(e) {
    if (e.key === "Enter" && searchResults.length > 0) {
      navigate(searchResults[0].to);
      setSearch("");
      setSearchOpen(false);
    }
    if (e.key === "Escape") {
      setSearchOpen(false);
    }
  }

  function handleSearchSelect(to) {
    navigate(to);
    setSearch("");
    setSearchOpen(false);
  }

  // Pulls a few real, currently-relevant signals from existing endpoints
  // and turns them into a notification list. Computed live on open, not
  // persisted — see the note in chat about what a full backend-backed
  // notification system would add on top of this.
  async function loadNotifications() {
    setNotifLoading(true);
    try {
      const [messagesRes, donationsRes, outreachRes] = await Promise.all([
        api.get("/messages", { params: { status: "pending" } }),
        api.get("/donations", { params: { status: "pending" } }),
        api.get("/outreach", { params: { status: "scheduled" } }),
      ]);

      const items = [];

      messagesRes.data.slice(0, 5).forEach((m) => {
        items.push({
          id: `msg-${m._id}`,
          text: `Message to ${m.donorName || m.donorEmail} is pending (${m.channel})`,
          to: "/admin/messages",
        });
      });

      donationsRes.data.slice(0, 5).forEach((d) => {
        items.push({
          id: `don-${d._id}`,
          text: `Donation from ${d.donorName || d.donorEmail} is still pending`,
          to: "/admin/donations",
        });
      });

      const soon = Date.now() + 7 * 24 * 60 * 60 * 1000;
      outreachRes.data
        .filter((o) => o.eventDate && new Date(o.eventDate).getTime() < soon)
        .slice(0, 5)
        .forEach((o) => {
          items.push({
            id: `out-${o._id}`,
            text: `"${o.title}" is scheduled within the next 7 days`,
            to: "/admin/outreach",
          });
        });

      setNotifications(items);
    } catch {
      setNotifications([]);
    } finally {
      setNotifLoading(false);
    }
  }

  function toggleNotifications() {
    const opening = !notifOpen;
    setNotifOpen(opening);
    if (opening) loadNotifications();
  }

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-charcoal/10 px-4 sm:px-6 py-4 flex items-center gap-4">
      <button
        onClick={onOpenMobileMenu}
        className="lg:hidden text-charcoal p-1"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Search */}
      <div ref={searchRef} className="relative flex-1 max-w-md">
        <div className="flex items-center gap-2 bg-lavender/50 rounded-full px-4 py-2.5">
          <Search size={16} className="text-charcoal/40 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search anything..."
            className="bg-transparent outline-none text-sm text-charcoal placeholder:text-charcoal/40 w-full"
          />
        </div>

        {searchOpen && search && (
          <div className="absolute left-0 right-0 mt-2 bg-white border border-charcoal/10 rounded-xl shadow-lg overflow-hidden z-20">
            {searchResults.length === 0 ? (
              <p className="px-4 py-3 text-sm text-charcoal/40">No matching pages.</p>
            ) : (
              searchResults.map((p) => (
                <button
                  key={p.to}
                  onClick={() => handleSearchSelect(p.to)}
                  className="w-full text-left px-4 py-2.5 text-sm text-charcoal hover:bg-lavender/50 transition-colors"
                >
                  {p.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-3 sm:gap-4">
        {/* Create New */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setCreateMenuOpen((o) => !o)}
            className="flex items-center gap-2 bg-purple hover:bg-purple/90 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
          >
            <Plus size={16} /> Create New <ChevronDown size={14} />
          </button>

          {createMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-charcoal/10 rounded-xl shadow-lg overflow-hidden z-20">
              {createActions.map((a) => (
                <Link
                  key={a.label}
                  to={a.to}
                  onClick={() => setCreateMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-charcoal hover:bg-lavender/50 transition-colors"
                >
                  <a.icon size={15} className="text-purple shrink-0" />
                  {a.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Calendar shortcut -> Events */}
        <Link
          to="/admin/events"
          className="text-charcoal/60 hover:text-charcoal p-2"
          aria-label="Events calendar"
          title="Events"
        >
          <Calendar size={19} />
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="relative text-charcoal/60 hover:text-charcoal p-2"
            aria-label="Notifications"
          >
            <Bell size={19} />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-charcoal text-[10px] font-bold rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-charcoal/10 rounded-xl shadow-lg overflow-hidden z-20">
              <div className="px-4 py-3 border-b border-charcoal/10">
                <p className="text-sm font-semibold text-charcoal">Notifications</p>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifLoading && (
                  <p className="px-4 py-4 text-sm text-charcoal/40">Loading...</p>
                )}
                {!notifLoading && notifications.length === 0 && (
                  <p className="px-4 py-4 text-sm text-charcoal/40">Nothing needs attention right now.</p>
                )}
                {!notifLoading &&
                  notifications.map((n) => (
                    <Link
                      key={n.id}
                      to={n.to}
                      onClick={() => setNotifOpen(false)}
                      className="block px-4 py-3 text-sm text-charcoal/80 hover:bg-lavender/50 border-b border-charcoal/5 last:border-0 transition-colors"
                    >
                      {n.text}
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen((o) => !o)}
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

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-charcoal/10 rounded-xl shadow-lg overflow-hidden z-20">
              <Link
                to="/admin/settings"
                onClick={() => setProfileMenuOpen(false)}
                className="block px-4 py-3 text-sm text-charcoal hover:bg-lavender/50 transition-colors"
              >
                Settings
              </Link>
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
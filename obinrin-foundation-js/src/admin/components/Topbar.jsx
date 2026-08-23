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
  Check,
} from "lucide-react";
import { webImg } from "../../assets/assets";
import { useAdminAuth } from "../auth/AdminAuthContext";
import api from "../api/client";

const getImg = (name) => webImg.find((img) => img.name === name)?.Image;

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const searchResults = pages.filter((p) =>
    p.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Load once on mount too, so the badge count is accurate even before
  // the bell is ever clicked — not just computed on open.
  useEffect(() => {
    loadNotifications();
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

  async function loadNotifications() {
    setNotifLoading(true);
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch {
      setNotifications([]);
    } finally {
      setNotifLoading(false);
    }
  }

  async function handleNotificationClick(n) {
    if (!n.read) {
      try {
        await api.patch(`/notifications/${n._id}/read`);
        setNotifications((prev) =>
          prev.map((item) => (item._id === n._id ? { ...item, read: true } : item))
        );
      } catch {
        // Non-critical — still navigate even if marking-as-read failed
      }
    }
    setNotifOpen(false);
    if (n.link) navigate(n.link);
  }

  async function handleMarkAllRead() {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // Silently ignore — not critical enough to interrupt the admin
    }
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
            onClick={() => setNotifOpen((o) => !o)}
            className="relative text-charcoal/60 hover:text-charcoal p-2"
            aria-label="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-charcoal text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-charcoal/10 rounded-xl shadow-lg overflow-hidden z-20">
              <div className="px-4 py-3 border-b border-charcoal/10 flex items-center justify-between">
                <p className="text-sm font-semibold text-charcoal">Notifications</p>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-xs font-semibold text-purple hover:text-purple/70"
                  >
                    <Check size={12} /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifLoading && (
                  <p className="px-4 py-4 text-sm text-charcoal/40">Loading...</p>
                )}
                {!notifLoading && notifications.length === 0 && (
                  <p className="px-4 py-4 text-sm text-charcoal/40">No notifications yet.</p>
                )}
                {!notifLoading &&
                  notifications.map((n) => (
                    <button
                      key={n._id}
                      onClick={() => handleNotificationClick(n)}
                      className={`w-full text-left px-4 py-3 text-sm border-b border-charcoal/5 last:border-0 transition-colors hover:bg-lavender/50 ${
                        n.read ? "text-charcoal/50" : "text-charcoal font-medium"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-purple mt-1.5 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p>{n.message}</p>
                          <p className="text-[11px] text-charcoal/40 mt-0.5">
                            {new Date(n.createdAt).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </button>
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